import { getSetting } from "@/lib/supabase";
export async function cityTaxEur(): Promise<number> {
  try {
    const v = parseFloat(String(await getSetting("city_tax_eur")));
    return isFinite(v) && v >= 0 ? v : 2.5;
  } catch {
    return 2.5;
  }
}
