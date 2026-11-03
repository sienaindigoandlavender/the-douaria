// The guest's country from their WhatsApp number's calling code ("+33 6…" → France),
// so the booking form never has to ask for it (Jacqueline, 21 Oct 2026).

const CODES: Record<string, string> = {
  "1": "United States", "7": "Russia", "20": "Egypt", "27": "South Africa", "30": "Greece", "31": "Netherlands",
  "32": "Belgium", "33": "France", "34": "Spain", "36": "Hungary", "39": "Italy", "40": "Romania", "41": "Switzerland",
  "43": "Austria", "44": "United Kingdom", "45": "Denmark", "46": "Sweden", "47": "Norway", "48": "Poland",
  "49": "Germany", "51": "Peru", "52": "Mexico", "54": "Argentina", "55": "Brazil", "56": "Chile", "57": "Colombia",
  "60": "Malaysia", "61": "Australia", "62": "Indonesia", "63": "Philippines", "64": "New Zealand", "65": "Singapore",
  "66": "Thailand", "81": "Japan", "82": "South Korea", "84": "Vietnam", "86": "China", "90": "Türkiye", "91": "India",
  "212": "Morocco", "213": "Algeria", "216": "Tunisia", "351": "Portugal", "352": "Luxembourg", "353": "Ireland",
  "354": "Iceland", "356": "Malta", "357": "Cyprus", "358": "Finland", "359": "Bulgaria", "370": "Lithuania",
  "371": "Latvia", "372": "Estonia", "380": "Ukraine", "381": "Serbia", "385": "Croatia", "386": "Slovenia",
  "420": "Czechia", "421": "Slovakia", "598": "Uruguay", "852": "Hong Kong", "886": "Taiwan", "961": "Lebanon",
  "966": "Saudi Arabia", "971": "United Arab Emirates", "972": "Israel", "974": "Qatar",
};

/** "+33 6 12 34 56 78" → "France"; "" when the number has no "+" or "00" prefix or an unknown code. */
export function countryFromPhone(raw: string | undefined | null): string {
  const s = String(raw || "").trim();
  if (!/^(\+|00)/.test(s)) return "";
  const d = s.replace(/^00/, "").replace(/\D/g, "");
  for (const n of [3, 2, 1]) if (CODES[d.slice(0, n)]) return CODES[d.slice(0, n)];
  return "";
}
