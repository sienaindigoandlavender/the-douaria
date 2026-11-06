import type { Metadata } from "next";
import Link from "next/link";
import HouseHero from "@/components/house/HouseHero";
import { IconShower, IconWifi, IconAC, IconBreakfast, IconTowel, IconShampoo, IconTerrace, IconKey, IconLaundry, IconStairs, IconCar, IconCooking } from "@/components/icons";

export const metadata: Metadata = {
  title: "Amenities",
  description: "What the Douaria has: a bathroom in every room, air conditioning that also heats, Wi-Fi, a roof terrace, breakfast and home-cooked dinners on request.",
};

// The riad's amenities page, in the house design (Jacqueline, 6 Nov 2026). Honest and plain: what is here,
// what is on request, and what isn't (no lift). Facts as on Booking/Airbnb and in lib/stays.ts.

const IN_THE_HOUSE = [
  { icon: <IconShower size={26} />, title: "A bathroom in every room", text: "Love, Joy and Bliss each have their own bathroom inside the room. Hot water that comes down hard." },
  { icon: <IconAC size={26} />, title: "Air conditioning that also heats", text: "Cool in July, warm on a January night. In every room." },
  { icon: <IconWifi size={26} />, title: "Wi-Fi", text: "Free, throughout the house." },
  { icon: <IconTowel size={26} />, title: "Linens and towels", text: "Beds made with care, fresh towels for every guest." },
  { icon: <IconShampoo size={26} />, title: "Shower gel and shampoo", text: "In every bathroom." },
  { icon: <IconTerrace size={26} />, title: "Roof terrace", text: "Up the old stair: the call to prayer at dusk, the city below you." },
];

const ON_REQUEST = [
  { icon: <IconBreakfast size={26} />, title: "Breakfast on the roof", text: "Ask Zahra the night before, and breakfast comes up to the roof terrace in the morning." },
  { icon: <IconCooking size={26} />, title: "A Moroccan dinner, cooked at home", text: "Zahra cooks it when you ask her the day before." },
  { icon: <IconCar size={26} />, title: "A driver from the airport", text: "A private car with driver, about twenty minutes, on request once you have booked." },
  { icon: <IconLaundry size={26} />, title: "Laundry", text: "Ask Zahra. Paid." },
];

const GOOD_TO_KNOW = [
  { icon: <IconKey size={26} />, title: "Check-in from 3 PM", text: "Send us your arrival time before you travel. Check-out by 11 AM." },
  { icon: <IconStairs size={26} />, title: "No lift", text: "Love is on the ground floor. Joy, Bliss and the roof are up a traditional Medina staircase, steep and narrow." },
];

function Block({ title, items, bg }: { title: string; items: { icon: JSX.Element; title: string; text: string }[]; bg: string }) {
  return (
    <section className={`${bg} px-5 md:px-10 lg:px-14 py-24 md:py-32`}>
      <div className="mx-auto max-w-[1500px] grid md:grid-cols-12 gap-10">
        <h2 className="house md:col-span-4 font-light text-[clamp(2rem,4vw,3.6rem)] leading-[1.02] tracking-[-0.03em]">{title}</h2>
        <ul className="md:col-span-8 grid sm:grid-cols-2 gap-x-10 gap-y-10">
          {items.map((it) => (
            <li key={it.title} className="flex gap-4">
              <span className="text-bejmat shrink-0 pt-1">{it.icon}</span>
              <span>
                <span className="house italic block text-[1.45rem] leading-tight">{it.title}</span>
                <span className="block mt-2 text-[1.05rem] leading-[1.6]">{it.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function AmenitiesPage() {
  return (
    <div className="bg-limewash text-ink min-h-screen">
      <HouseHero
        title="Amenities"
        lede="Everything a good night needs, and nothing it doesn't."
        image="/photos/bliss-3.webp"
        alt="Bliss, upstairs at the Douaria"
      />
      <Block title="In the house" items={IN_THE_HOUSE} bg="bg-limewash" />
      <Block title="On request" items={ON_REQUEST} bg="bg-tadelakt" />
      <Block title="Good to know" items={GOOD_TO_KNOW} bg="bg-straw" />
      <section className="px-5 md:px-10 lg:px-14 py-20 md:py-28">
        <div className="mx-auto max-w-[1500px] flex flex-wrap items-center justify-between gap-6">
          <p className="house font-light text-[clamp(1.8rem,3.4vw,3rem)] leading-tight mb-0">Love, Joy and Bliss, <em>or the whole house.</em></p>
          <Link href="/rooms" className="btn-door">See the rooms</Link>
        </div>
      </section>
    </div>
  );
}
