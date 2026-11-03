// Website bookings: one path from "Pay" to "confirmed", owned by the server.
//
//   1. createHold()     — the booking is written first, status "pending_payment",
//                         so the dates are held and the record exists before any money moves.
//   2. confirmBooking() — once PayPal says COMPLETED (from the capture call OR the
//                         webhook, whichever arrives first), the hold becomes "confirmed"
//                         and both emails go out. The status flip is conditional, so the
//                         emails are sent exactly once even if both arrive together.
//   3. expireHolds()    — holds never paid are cancelled after HOLD_MINUTES.

import { getServiceClient } from "@/lib/supabase";
import { sendBookingEmails } from "@/lib/email";
import type { CaptureInfo } from "@/lib/paypal";
import { countryFromPhone } from "@/lib/countryFromPhone";
import { getHouseTerms, findCode, roomNightPrice } from "@/lib/houseTerms";
import { getSetting } from "@/lib/supabase";

export const HOLD_MINUTES = 60;
const EXPIRED_MARK = "[hold expired]";

export interface BookingInput {
  itemId?: string;
  itemName: string;
  property?: string;
  checkIn: string;
  checkOut?: string;
  nights: number;
  guests: number;
  totalEUR: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  language?: string;
  message?: string;
  philosophyAcknowledged?: boolean;
  disclaimerAcknowledged?: boolean;
  code?: string; // discount code typed by the guest (checked here, never trusted)
  ref?: string; // where the guest first came from (components/RefCatcher.tsx), e.g. instagram, card
}

// ── Discount codes (Jacqueline, 1 Nov 2026) ──────────────────────────────────
// The return-guest card: a percentage off room nights only (not dinner, transfers,
// city tax or extras), never stacked, no blackout dates. Codes live in ops house
// terms; the server prices the booking itself whenever a code is used.

export interface CodeQuote {
  code: string;
  percent: number;
  label: string; // "Return-guest code SIENA25"
  roomTotal: number;
  discount: number;
  cityTax: number;
  total: number;
  nights: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;
const MAX_GUESTS: Record<string, number> = { "douaria-house": 6 };

/** Is this an active code for this room? Error text is short and plain, for the guest. */
export async function checkCode(input: unknown, itemId: unknown) {
  const terms = await getHouseTerms();
  const c = findCode(terms, input);
  if (!c) return { error: "That code doesn't work." } as const;
  const price = roomNightPrice(terms, itemId);
  if (price == null) return { error: "This code is for room nights only." } as const;
  const label = `${/return/i.test(c.note) || !c.note ? "Return-guest code" : "Code"} ${c.code}`;
  return { code: c.code, percent: c.percent, label, price } as const;
}

/** The server's own price for a room booking with a code. */
export async function quoteWithCode(b: BookingInput): Promise<CodeQuote | { error: string }> {
  const r = await checkCode(b.code, b.itemId);
  if ("error" in r) return { error: r.error! };
  if (!b.checkOut || !DATE.test(b.checkOut)) return { error: "Missing check-out date" };
  const nights = Math.round((Date.parse(b.checkOut) - Date.parse(b.checkIn)) / 86_400_000);
  if (!(nights >= 1 && nights <= 60)) return { error: "Please check the dates" };
  const max = MAX_GUESTS[String(b.itemId)] ?? 2;
  const guests = Math.min(max, Math.max(1, Math.round(Number(b.guests) || 1)));
  let perNight = 2.5;
  try {
    const v = parseFloat(String(await getSetting("city_tax_eur")));
    if (isFinite(v) && v >= 0) perNight = v;
  } catch {}
  const roomTotal = round2(r.price * nights);
  const discount = round2((roomTotal * r.percent) / 100);
  const cityTax = round2(perNight * guests * nights);
  return { code: r.code, percent: r.percent, label: r.label, roomTotal, discount, cityTax, total: round2(roomTotal - discount + cityTax), nights };
}

/** The server's own price for a stay without a code: nights × the ops price, plus city tax.
 *  The page's total is never trusted. */
export async function quotePlain(b: BookingInput): Promise<{ total: number; nights: number } | { error: string }> {
  const terms = await getHouseTerms();
  const price = roomNightPrice(terms, b.itemId);
  if (price == null) return { error: "Unknown stay" };
  if (!b.checkOut || !DATE.test(b.checkOut)) return { error: "Missing check-out date" };
  const nights = Math.round((Date.parse(b.checkOut) - Date.parse(b.checkIn)) / 86_400_000);
  if (!(nights >= 1 && nights <= 60)) return { error: "Please check the dates" };
  const max = MAX_GUESTS[String(b.itemId)] ?? 2;
  const guests = Math.min(max, Math.max(1, Math.round(Number(b.guests) || 1)));
  let perNight = 2.5;
  try {
    const v = parseFloat(String(await getSetting("city_tax_eur")));
    if (isFinite(v) && v >= 0) perNight = v;
  } catch {}
  return { total: round2(price * nights + perNight * guests * nights), nights };
}

/** The line ops shows in the booking's notes; also read back for the emails if the columns are missing. */
export const codeNote = (q: { code: string; percent: number; discount: number }) =>
  `Return-guest card · code ${q.code} · −€${q.discount.toFixed(2)} (${q.percent}% off room nights, website)`;

function codeFromRow(row: Record<string, any>): { code?: string; discount?: number } {
  if (row.promo_code) return { code: row.promo_code, discount: Number(row.promo_discount_eur) || 0 };
  const m = String(row.notes || "").match(/code ([A-Z0-9-]+) · −€([\d.]+)/);
  return m ? { code: m[1], discount: parseFloat(m[2]) } : {};
}

// The languages Yasmin writes in (ops stores the English name).
export const LANGUAGES = ["English", "French", "Italian", "Spanish", "Portuguese"];

const DATE = /^\d{4}-\d{2}-\d{2}$/;

export function validate(b: Partial<BookingInput>): string | null {
  if (!b.itemName) return "Missing room";
  if (!b.checkIn || !DATE.test(b.checkIn)) return "Missing check-in date";
  if (b.checkOut && !DATE.test(b.checkOut)) return "Bad check-out date";
  if (!b.firstName || !b.email) return "Missing name or email";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(b.email).trim())) return "Please check your email address";
  // A phone (WhatsApp) is required: without it nobody can reach a guest on arrival day (Jacqueline, 21 Oct 2026).
  if (String(b.phone || "").replace(/\D/g, "").length < 7) return "Please add your WhatsApp number, with the country code";
  const total = parseFloat(String(b.totalEUR));
  if (!isFinite(total) || total <= 0) return "Bad amount";
  return null;
}

export async function createHold(b: BookingInput, quote?: CodeQuote | null): Promise<string> {
  const supabase = getServiceClient();
  const bookingId = `TD-${Date.now()}`; // TD- = The Douaria (the riad's PayPal webhook leaves these alone)
  const now = new Date().toISOString();
  const row: Record<string, unknown> = {
    booking_id: bookingId,
    source: "Website",
    status: "pending_payment",
    first_name: b.firstName || "",
    last_name: b.lastName || "",
    email: b.email || "",
    phone: b.phone || "",
    country: countryFromPhone(b.phone),
    language: LANGUAGES.includes(String(b.language)) ? b.language : "",
    property: "The Douaria",
    room: b.itemName,
    check_in: b.checkIn,
    check_out: b.checkOut || null,
    nights: Number(b.nights) || null,
    guests: Number(b.guests) || null,
    adults: Number(b.guests) || null,
    children: 0,
    total_eur: parseFloat(String(b.totalEUR)) || null,
    special_requests: b.message || "",
    philosophy_acknowledged: b.philosophyAcknowledged === true,
    disclaimer_acknowledged: b.disclaimerAcknowledged === true,
    created_at: now,
    updated_at: now,
  };
  if (quote) {
    row.total_eur = quote.total;
    row.nights = quote.nights;
    row.notes = codeNote(quote);
  }
  // "Came from: instagram" so ops can count what Instagram books (Jacqueline, 1 Nov 2026).
  const ref = String(b.ref || "").toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 30);
  if (ref) row.notes = [row.notes, `Came from: ${ref}`].filter(Boolean).join(" · ");
  let { error } = await supabase
    .from("master_guests")
    .insert(quote ? { ...row, promo_code: quote.code, promo_discount_eur: quote.discount } : row);
  // promo_code / promo_discount_eur come from supabase/promo-code.sql; until it is run,
  // the code still lives in the notes line above.
  if (error && quote && /promo_/.test(error.message)) ({ error } = await supabase.from("master_guests").insert(row));
  if (error) throw new Error(`Could not save booking: ${error.message}`);
  return bookingId;
}

/** Cancel holds that were never paid. */
export async function expireHolds(): Promise<number> {
  const supabase = getServiceClient();
  const cutoff = new Date(Date.now() - HOLD_MINUTES * 60_000).toISOString();
  const { data: stale } = await supabase
    .from("master_guests")
    .select("id, special_requests")
    .eq("status", "pending_payment")
    .lt("created_at", cutoff);
  let n = 0;
  for (const row of stale || []) {
    const note = [row.special_requests, `${EXPIRED_MARK} payment not completed`].filter(Boolean).join(" | ");
    const { error } = await supabase
      .from("master_guests")
      .update({ status: "cancelled", special_requests: note, updated_at: new Date().toISOString() })
      .eq("id", row.id)
      .eq("status", "pending_payment");
    if (!error) n++;
  }
  return n;
}

/**
 * Mark a held booking paid and send the emails — exactly once.
 * Returns "confirmed" (this call did it), "already" (someone else did), or an error string.
 */
export async function confirmBooking(cap: CaptureInfo): Promise<"confirmed" | "already" | string> {
  if (cap.status !== "COMPLETED") return `Payment not completed (${cap.status})`;
  if (!cap.bookingId) return "Payment has no booking reference";
  const supabase = getServiceClient();

  const { data: row, error: readErr } = await supabase
    .from("master_guests")
    .select("*")
    .eq("booking_id", cap.bookingId)
    .maybeSingle();
  if (readErr) return `Lookup failed: ${readErr.message}`;
  if (!row) return `No booking ${cap.bookingId}`;
  if (row.status === "confirmed") return "already";

  // A hold that expired but was paid anyway (slow guest) is still a real booking.
  const flippable =
    row.status === "pending_payment" ||
    (row.status === "cancelled" && String(row.special_requests || "").includes(EXPIRED_MARK));
  if (!flippable) return `Booking ${cap.bookingId} is ${row.status}; not changed`;

  const paid = cap.amount ?? row.total_eur;
  const guestMessage = String(row.special_requests || "").replace(/\s*\|?\s*\[hold expired\][^|]*/g, "").trim();
  const note = [
    guestMessage,
    `PayPal: ${cap.captureId || ""}`,
    paid !== row.total_eur ? `Paid ${paid} EUR (website total ${row.total_eur})` : "",
  ]
    .filter(Boolean)
    .join(" | ");

  // Conditional flip: only one caller can move it out of its current status.
  const { data: flipped, error: upErr } = await supabase
    .from("master_guests")
    .update({ status: "confirmed", total_eur: paid, special_requests: note, updated_at: new Date().toISOString() })
    .eq("id", row.id)
    .eq("status", row.status)
    .select("id");
  if (upErr) return `Confirm failed: ${upErr.message}`;
  if (!flipped || flipped.length === 0) return "already";

  try {
    await sendBookingEmails({
      bookingId: row.booking_id,
      firstName: row.first_name || "",
      lastName: row.last_name || "",
      email: row.email || "",
      phone: row.phone || "",
      property: row.property || "The Douaria",
      room: row.room || "",
      checkIn: row.check_in || "",
      checkOut: row.check_out || "",
      nights: Number(row.nights) || 1,
      guests: Number(row.guests) || 1,
      total: Number(paid) || 0,
      paypalOrderId: cap.captureId || "",
      message: guestMessage,
      ...codeFromRow(row),
    });
  } catch (e) {
    // The booking is confirmed and saved; a mail failure must not undo that.
    console.error("BOOKING EMAIL FAILED — booking confirmed but not emailed:", row.booking_id, e);
  }
  return "confirmed";
}
