import type { Metadata } from "next";
import Prose from "@/components/Prose";

export const metadata: Metadata = { title: "Before you book", description: "The honest notes on staying at the Douaria, an old house in the Marrakech Medina." };

export default function Page() {
  return (
    <Prose
      kicker="Honest notes"
      title="Before you book"
      intro="An old house is not for everyone. Here is everything we would want to know ourselves, so you arrive with nothing left to wonder."
      sections={[
        { title: "A house, not a hotel", body: ["No reception desk, no room service, no lift. Zahra looks after the house from 8 AM to 5 PM and answers on WhatsApp; evening messages are answered the next morning. Booked guests get a number for emergencies at night.", "If you come with a magnifying glass, you will find fault. If you come for a calm, cared-for house in the middle of the Medina, you'll be happy here."] },
        { title: "Light and windows", body: ["Medina houses turn inward, around their courtyard. Not every room has a window to the street; the light comes from the courtyard and the lanterns. If you need a view to sleep well, this isn't your house."] },
        { title: "Damp and heat", body: ["Thick old walls keep the rooms cool in summer and hold on to the damp in the hottest, most humid weeks. Every room has air conditioning that also heats, and a dehumidifier runs where it's needed. We work on it every year; we won't pretend it is gone.", "Old pipes sometimes carry a smell from the drains. Siphons help; in a centuries-old sewage network nothing solves it completely."] },
        { title: "Stairs", body: ["The stairs to Joy, Bliss and the roof terrace are steep and narrow, as stairs in the Medina are. The house isn't suitable for anyone with reduced mobility, and we welcome children from 8 years old: the roof terrace is open and the stairs are no place for toddlers."] },
        { title: "Sharing the courtyard", body: ["When the rooms are booked one by one, you share the courtyard and a good morning with the other guests. If that feels like too much, book the whole house, or a hotel will suit you better."] },
        { title: "Noise", body: ["We keep the inside quiet. We can't control the Medina outside our walls: the call to prayer, a neighbour's celebration, the life of the lane."] },
        { title: "In the rooms", body: ["A double bed with a firm mattress, the Moroccan way. A bathroom inside each room, a hairdryer, luggage racks, a handmade armoire. No fridge and no desk."] },
        { title: "City tax and payment", body: ["The city charges €2.50 a person a night. When you book here it is added to your total at checkout. Stays booked here are paid in full when you book."] },
      ]}
      related={[{ href: "/house-rules", label: "House rules" }, { href: "/booking-conditions", label: "Booking conditions" }, { href: "/stay", label: "Back to the house" }]}
    />
  );
}
