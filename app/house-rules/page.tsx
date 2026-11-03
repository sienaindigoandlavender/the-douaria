import type { Metadata } from "next";
import Prose from "@/components/Prose";
import { getHouseTerms, earlyLateLine } from "@/lib/houseTerms";

export const revalidate = 300;
export const metadata: Metadata = { title: "House rules", description: "How the Douaria runs: breakfast, quiet hours, pets, linens and arriving." };

export default async function Page() {
  const t = await getHouseTerms();
  return (
    <Prose
      kicker="Guest information"
      title="House rules"
      intro="What any home asks: a little care, a smile, a thank you. Here is how the house runs."
      sections={[
        { title: "Breakfast", body: ["Included, every morning from 8:30 to 10:30 AM. Breakfast at 8:00, or a box for an early departure: tell Zahra by 1 PM the day before. Allergies or special diets: tell us early."] },
        { title: "Arriving and leaving", body: ["Check-in from 3 PM to 9 PM; send us your arrival time before you travel. Check-out by 11 AM.", earlyLateLine(t)] },
        { title: "Quiet", body: ["Quiet hours from 11 PM to 8 AM. No visitors after 6 PM, out of respect for local custom. Smoking on the roof terrace only."] },
        { title: "Pets", body: ["Well-behaved pets are welcome at no charge; tell us before you arrive. Any damage a pet causes is charged at repair or replacement cost."] },
        { title: "Linens and towels", body: ["Cotton, washed and cared for by hand. Keep makeup, henna, self-tan, hair dye and shoe polish away from them; those stains never come out. Linens damaged beyond normal use are charged at replacement cost."] },
        { title: "Water and housekeeping", body: ["Towels and bins are refreshed daily; rooms are fully cleaned every three nights, or daily on request. Nothing in the toilet but paper: the pipes are as old as the house."] },
        { title: "Your belongings", body: ["Keep cash, passports and valuables locked in your luggage when you go out. Anything missing must be reported before you leave, so we can look into it together while it can still be verified."] },
      ]}
      related={[{ href: "/before-you-book", label: "Before you book" }, { href: "/booking-conditions", label: "Booking conditions" }]}
    />
  );
}
