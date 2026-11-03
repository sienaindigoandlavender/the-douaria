import type { Metadata } from "next";
import Prose from "@/components/Prose";

export const metadata: Metadata = { title: "Booking conditions", description: "Cancellation, payment and city tax for stays at the Douaria." };

export default function Page() {
  return (
    <Prose
      kicker="Policies"
      title="Booking conditions"
      intro="These conditions form the agreement between you and the Douaria. By confirming a reservation, you accept them."
      sections={[
        { title: "Cancellation", body: ["14 days or more before arrival: full refund. 7 to 13 days before: 50% refund. Less than 7 days, or a no-show: no refund.", "These terms apply to every reservation made on this website, whatever the reason: a change of plans, a missed flight, illness or weather. Bookings made through Airbnb or Booking.com follow the policy shown on that platform. We recommend travel insurance."] },
        { title: "Payment", body: ["The full amount is paid by PayPal (card accepted) when you book."] },
        { title: "City tax", body: ["The city charges €2.50 a person a night. On this website it is included in the total at checkout."] },
        { title: "Belongings and damage", body: ["We are not responsible for belongings lost, forgotten or stolen, in your room, in shared spaces or in luggage storage. Guests pay for linens or fittings damaged beyond normal use, and for any damage a pet causes."] },
        { title: "Events beyond our control", body: ["Floods, earthquakes, extreme weather, strikes, closures, interruptions to travel or utilities: we will do all we reasonably can to keep you comfortable and safe, but these are not grounds for a refund."] },
        { title: "Concerns", body: ["If anything isn't right, tell us while you are here so we can put it right. Missing items must be reported before you leave the house."] },
        { title: "What you confirm", body: ["By booking, you confirm you have read the house rules and the honest notes in Before you book, which form part of these conditions."] },
        { title: "Governing law", body: ["These conditions are governed by the laws of the Kingdom of Morocco. Both parties will first seek an amicable solution before going to the courts of Marrakech."] },
      ]}
      related={[{ href: "/before-you-book", label: "Before you book" }, { href: "/house-rules", label: "House rules" }]}
    />
  );
}
