// House terms: every price, fee and rule number in one place (Jacqueline, 31 Oct 2026).
// The values live in ops (ops.riaddisiena.com/prices), saved as the settings row
// "house_terms" in the shared Supabase. The website, the house rules and the
// pre-arrival message read them from here; change a number once, in ops.
// DEFAULTS are only the fallback if the row is missing or unreadable.

import { getSetting } from "@/lib/supabase";

export interface HouseTerms {
  /** Nightly prices on the website, in euros. Main riad rooms also live in rooms.price_eur. */
  rooms: { "hidden-gem": number; "tresor-cache": number; "jewel-box": number };
  douaria: { love: number; bliss: number; joy: number; house: number };
  earlyLateTo2pm: number; // €, early check-in from noon or late check-out until 2 PM
  earlyLateTo6pm: number; // €, until 6 PM
  tripFreeNights: number; // bags kept free during a trip of up to N nights, if back to stay
  tripBagFee: number; // € per bag otherwise
  tripMaxWeeks: number;
  dinnerMad: number;
  transferMad: number;
  cityTaxMad: number;
  /** Discount codes, checked on the server only; never sent to the public settings feed.
   *  Room nights only (not dinner, transfers, city tax, extras), not stackable (Jacqueline, 1 Nov 2026). */
  codes: DiscountCode[];
}

export interface DiscountCode {
  code: string; // upper case, letters, digits and dashes
  percent: number; // off room nights, 0–100
  active: boolean;
  note: string;
}

export const DEFAULTS: HouseTerms = {
  rooms: { "hidden-gem": 105, "tresor-cache": 120, "jewel-box": 75 },
  douaria: { love: 95, bliss: 95, joy: 85, house: 325 },
  earlyLateTo2pm: 20,
  earlyLateTo6pm: 50,
  tripFreeNights: 4,
  tripBagFee: 20,
  tripMaxWeeks: 3,
  dinnerMad: 250,
  transferMad: 200,
  cityTaxMad: 27.5,
  codes: [{ code: "SIENA25", percent: 25, active: true, note: "Return-guest card" }],
};

/** "  siena25 " → "SIENA25". */
export const normCode = (v: unknown) => String(v ?? "").trim().toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 30);

function mergeCodes(v: unknown): DiscountCode[] {
  if (!Array.isArray(v)) return DEFAULTS.codes; // never saved yet: the defaults
  const seen = new Set<string>();
  const out: DiscountCode[] = [];
  for (const c of v) {
    const code = normCode(c?.code);
    if (!code || seen.has(code)) continue;
    seen.add(code);
    const p = Number(c?.percent);
    out.push({
      code,
      percent: isFinite(p) ? Math.min(100, Math.max(0, p)) : 0,
      active: c?.active !== false,
      note: typeof c?.note === "string" ? c.note.slice(0, 80) : "",
    });
  }
  return out;
}

/** The active code matching what a guest typed (case-insensitive, trimmed), or null. */
export function findCode(t: HouseTerms, input: unknown): DiscountCode | null {
  const want = normCode(input);
  if (!want) return null;
  return t.codes.find((c) => c.active && c.percent > 0 && c.code === want) || null;
}

/** Merge a stored (possibly partial) object over the defaults. */
export function mergeTerms(raw: unknown): HouseTerms {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, any>;
  const num = (v: unknown, d: number) => (typeof v === "number" && isFinite(v) ? v : d);
  const pick = <T extends Record<string, number>>(d: T, v: any): T =>
    Object.fromEntries(Object.entries(d).map(([k, x]) => [k, num(v?.[k], x)])) as T;
  // Only known keys, numbers only: dates and stray fields never leak into the terms.
  return {
    ...pick(
      { earlyLateTo2pm: DEFAULTS.earlyLateTo2pm, earlyLateTo6pm: DEFAULTS.earlyLateTo6pm, tripFreeNights: DEFAULTS.tripFreeNights, tripBagFee: DEFAULTS.tripBagFee, tripMaxWeeks: DEFAULTS.tripMaxWeeks, dinnerMad: DEFAULTS.dinnerMad, transferMad: DEFAULTS.transferMad, cityTaxMad: DEFAULTS.cityTaxMad },
      r,
    ),
    rooms: pick(DEFAULTS.rooms, r.rooms),
    douaria: pick(DEFAULTS.douaria, r.douaria),
    codes: mergeCodes(r.codes),
  };
}

export async function getHouseTerms(): Promise<HouseTerms> {
  try {
    const v = await getSetting("house_terms");
    return mergeTerms(v ? JSON.parse(v) : null);
  } catch {
    return DEFAULTS;
  }
}

/** The early/late line, word for word the same everywhere it appears. */
export function earlyLateLine(t: HouseTerms): string {
  return `Early check-in or late check-out, only when the room is free (ask Zahra the day before): from noon or until 2 PM, €${t.earlyLateTo2pm}; until 6 PM, €${t.earlyLateTo6pm}. Later than 6 PM counts as a night.`;
}

export function tripLuggageLine(t: HouseTerms): string {
  return `Leaving for a trip? We keep your bags free while you're away up to ${t.tripFreeNights} nights, if you're staying with us when you return. Otherwise, €${t.tripBagFee} per bag (up to ${t.tripMaxWeeks} weeks), paid when you leave them. Bags are kept at your own risk: no cash, passports or valuables inside. Bags left longer than ${t.tripMaxWeeks} weeks without word from you are given away.`;
}

/** "27.50" — whole numbers stay whole ("30"). */
export const cityTaxDh = (t: HouseTerms) => (Number.isInteger(t.cityTaxMad) ? String(t.cityTaxMad) : t.cityTaxMad.toFixed(2));

/** Website room id → nightly price from the terms; null for anything a code doesn't cover
 *  (the Kasbah, the Desert Camp, journeys). Codes apply to these room nights only. */
export function roomNightPrice(t: HouseTerms, itemId: unknown): number | null {
  const id = String(itemId || "");
  if (id in t.rooms) return t.rooms[id as keyof HouseTerms["rooms"]];
  const d: Record<string, number> = { "douaria-love": t.douaria.love, "douaria-bliss": t.douaria.bliss, "douaria-joy": t.douaria.joy, "douaria-house": t.douaria.house };
  return id in d ? d[id] : null;
}
