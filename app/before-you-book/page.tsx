import type { Metadata } from "next";
import Prose from "@/components/Prose";

export const metadata: Metadata = { title: "Before you book", description: "Good to know before staying at the Douaria, an old house in the Marrakech Medina." };

export default function Page() {
  return (
    <Prose
      kicker="Good to know"
      title="Before you book"
      intro="The Douaria is an old Medina house, kept the way it was built. A few things worth knowing, so the house you arrive at is the one you imagined."
      sections={[
        { title: "A house, looked after", body: ["There is no reception desk. Zahra looks after the house every day from 8 AM to 5 PM and answers on WhatsApp. Once you've booked, you also have a number for the night, should you ever need it."] },
        { title: "Built around the courtyard", body: ["Like every traditional Medina house, the Douaria turns inward. The rooms take their light from the courtyard and the lanterns rather than from the street, which is also why they are so quiet.", "The thick earth walls keep the rooms cool in summer; in wet weather they can feel, and smell, a little damp. Every room has air conditioning that also heats."] },
        { title: "Stairs", body: ["Joy, Bliss and the roof terrace are up a traditional Medina staircase, steep and narrow. The house suits guests who are steady on their feet, and children from 8 years old."] },
        { title: "Room by room, or the whole house", body: ["Booked room by room, you share the courtyard and a good morning with the other guests. For the house to yourselves, book all of it."] },
        { title: "City tax and payment", body: ["The city charges €2.50 a person a night. When you book here it is added to your total at checkout. Stays booked here are paid in full when you book."] },
      ]}
      related={[{ href: "/house-rules", label: "House rules" }, { href: "/booking-conditions", label: "Booking conditions" }, { href: "/stay", label: "Back to the house" }]}
    />
  );
}
