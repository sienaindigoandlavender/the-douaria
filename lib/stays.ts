// The four ways to stay at the Douaria (Jacqueline, 28 Oct 2026): the whole house,
// or Love, Joy and Bliss on their own. Prices come from ops (house_terms.douaria);
// `bookingName` must match the room name ops and the iCal tables use.

import type { HouseTerms } from "@/lib/houseTerms";

export interface Stay {
  slug: string;
  id: "douaria-house" | "douaria-love" | "douaria-joy" | "douaria-bliss";
  bookingName: string;
  name: string;
  line: string; // one line under the name
  colour: string; // the room's wool
  photos: string[];
  story: string[];
  facts: string[];
  maxGuests: number;
}

export const STAYS: Stay[] = [
  {
    slug: "the-whole-house",
    id: "douaria-house",
    bookingName: "The Douaria — whole house",
    name: "The whole house",
    line: "Three bedrooms, three bathrooms, a roof terrace, and nobody but your own people.",
    colour: "#25348C",
    photos: ["/photos/bliss-wide.webp", "/photos/love-wide.webp", "/photos/joy-wide.webp", "/photos/detail-niche.webp"],
    story: [
      "Close the door at No. 35 and the Medina is on the other side of it. Mornings start slowly, with breakfast on the roof terrace if you've asked for it. Afternoons, someone comes back from the souks with the carpet they swore they wouldn't buy. Evenings, you walk to the square for the smoke and the drums, and walk home to quiet.",
      "For two couples and a friend, a family with older children, or friends who want to travel together and still each have a door to close.",
    ],
    facts: ["Up to 6 guests", "Love, Joy and Bliss, each with its own bathroom", "Roof terrace", "Breakfast on the roof terrace and home-cooked dinners, on request", "Children from 8 years"],
    maxGuests: 6,
  },
  {
    slug: "love",
    id: "douaria-love",
    bookingName: "Love",
    name: "Love",
    line: "Ground floor, off the courtyard. A red blanket, a crystal chandelier, the room you fall into after the souks.",
    colour: "#9E2B33",
    photos: ["/photos/love.webp", "/photos/love-2.webp", "/photos/love-wide.webp"],
    story: [
      "Love is the room you reach first, just off the courtyard. A red Amazigh blanket across a wide white bed, a crystal chandelier that has no business in a Medina house and looks perfectly at home, and one of Rhonda's big paintings keeping watch over the bed.",
      "It is the first door you reach when your feet have walked the Medina all day: no stairs, just the bed.",
    ],
    facts: ["2 guests", "Ground floor", "Bathroom inside the room", "Air conditioning that also heats", "Breakfast on request"],
    maxGuests: 2,
  },
  {
    slug: "joy",
    id: "douaria-joy",
    bookingName: "Joy",
    name: "Joy",
    line: "First floor. Saffron yellow, bright prints, and a shower that means business.",
    colour: "#E3A72F",
    photos: ["/photos/joy.webp", "/photos/joy-2.webp", "/photos/joy-wide.webp", "/photos/joy-art.webp"],
    story: [
      "Joy wears saffron: a yellow wool blanket the colour of the spice stalls, striped cushions, small bright prints on a white wall. It is the simplest of the three rooms and the kindest on the budget.",
      "And the shower: the water comes down hard and hot, which in an old Medina house is no small thing.",
    ],
    facts: ["2 guests", "First floor, up a steep stair", "Bathroom inside the room", "Air conditioning that also heats", "Breakfast on request"],
    maxGuests: 2,
  },
  {
    slug: "bliss",
    id: "douaria-bliss",
    bookingName: "Bliss",
    name: "Bliss",
    line: "First floor. Grey wool, a cobalt figure on the wall, a lantern that scatters stars on the ceiling at night.",
    colour: "#CFC9BE",
    photos: ["/photos/bliss.webp", "/photos/bliss-wide.webp", "/photos/bliss-painting.webp", "/photos/bliss-side.webp"],
    story: [
      "Bliss is the long room: painted beams overhead, a pierced brass lantern that throws its pattern on the ceiling at night, and a wide bed under a grey wool blanket with a long hand-knotted fringe.",
      "Above the bed hangs the house's most talked-about painting, a figure wrapped in cobalt blue. You will either love it or ask to sleep facing the other way.",
    ],
    facts: ["2 guests", "First floor, up a steep stair", "Bathroom inside the room", "Air conditioning that also heats", "Breakfast on request"],
    maxGuests: 2,
  },
];

export const stayBySlug = (slug: string) => STAYS.find((s) => s.slug === slug);

export function stayPrice(t: HouseTerms, s: Stay): number {
  if (s.id === "douaria-house") return t.douaria.house;
  if (s.id === "douaria-love") return t.douaria.love;
  if (s.id === "douaria-joy") return t.douaria.joy;
  return t.douaria.bliss;
}
