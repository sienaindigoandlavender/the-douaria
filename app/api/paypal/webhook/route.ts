import { NextResponse } from "next/server";
import { verifyWebhook, type CaptureInfo } from "@/lib/paypal";
import { confirmBooking } from "@/lib/booking";

export const dynamic = "force-dynamic";

// The safety net: PayPal tells us directly when a payment completes, so a booking is
// confirmed even if the guest's browser never came back. Same confirmBooking() as the
// checkout, so a booking is never confirmed or emailed twice.
export async function POST(request: Request) {
  let event: any;
  try {
    event = await request.json();
  } catch {
    return NextResponse.json({ error: "bad body" }, { status: 400 });
  }

  const genuine = await verifyWebhook(request.headers, event).catch(() => false);
  if (!genuine) return NextResponse.json({ error: "unverified" }, { status: 401 });

  if (event?.event_type !== "PAYMENT.CAPTURE.COMPLETED") return NextResponse.json({ ignored: event?.event_type });

  const r = event.resource || {};
  const cap: CaptureInfo = {
    status: r.status || "UNKNOWN",
    captureId: r.id || null,
    bookingId: r.custom_id || null,
    amount: r.amount?.value ? parseFloat(r.amount.value) : null,
    currency: r.amount?.currency_code || null,
    payerEmail: null,
  };
  // Payments made outside the website (no booking reference) are not ours to record.
  // (other shops on the same PayPal account use their own references, so only TD- ids count).
  if (!cap.bookingId || !cap.bookingId.startsWith("TD-")) return NextResponse.json({ ignored: "not a website booking" });

  const result = await confirmBooking(cap);
  if (result === "confirmed" || result === "already") return NextResponse.json({ ok: true, result });
  console.error("WEBHOOK could not confirm:", cap.bookingId, result);
  // Only a passing database problem is worth PayPal retrying (a 500 makes it retry).
  const transient = result.startsWith("Lookup failed") || result.startsWith("Confirm failed");
  return NextResponse.json({ ok: false, result }, { status: transient ? 500 : 200 });
}
