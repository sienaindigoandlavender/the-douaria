import type { Metadata } from "next";
import Link from "next/link";
import HouseHero from "@/components/house/HouseHero";

export const metadata: Metadata = {
  title: "Philosophy",
  description: "Dyafa, the old Moroccan way of receiving a guest: you are not a customer here. A whole house in the Marrakech Medina, kept for rest, good food and quiet.",
};

// Same structure as the riad's philosophy page (hero, big intro, straw, tadelakt, night, closing quote), the
// Douaria's own words (Jacqueline, 14 Nov 2026: "the Douaria site does not have the same soul").
export default function PhilosophyPage() {
  return (
    <div className="bg-limewash text-ink min-h-screen">
      <HouseHero
        title="Philosophy"
        lede="Dyafa is the old Moroccan word for receiving someone under your roof. It still runs this house."
        image="/photos/detail-niche.webp"
        alt="A niche in the plaster wall at No. 35"
      />

      <section className="px-5 md:px-10 lg:px-14 py-24 md:py-40">
        <p className="house mx-auto max-w-[1500px] font-light text-[clamp(1.9rem,4.2vw,4rem)] leading-[1.12] tracking-[-0.025em] [text-wrap:pretty] md:pr-[12%]">
          You are not a customer here. <em>You are a guest.</em> Tea when you arrive, rooms made ready by hand, and Zahra, who knows the house and the lanes around it and looks after you as she would look after family.
        </p>
        <img src="/drawings/jams.svg" alt="" aria-hidden draggable={false} className="block mx-auto md:me-0 md:ms-auto max-w-[1500px] w-full md:w-[60%] mt-16 md:mt-24 select-none" />
      </section>

      <section className="bg-straw px-5 md:px-10 lg:px-14 py-24 md:py-36">
        <div className="mx-auto max-w-[1500px] grid md:grid-cols-12 gap-10">
          <p className="house italic font-light md:col-span-5 text-[clamp(1.6rem,2.8vw,2.6rem)] leading-[1.15] text-bejmat">
            Rest, food, quiet. That is what we look after.
          </p>
          <p className="md:col-span-6 md:col-start-7 text-[1.2rem] md:text-[1.3rem] leading-[1.75] text-ink">
            Dark rooms, thick walls, a door that closes on the city: the night is for sleeping, and the house is kept that way. Warm bread, fruit from the season, olive oil and honey, breakfast on the roof where the morning light lands first. No music piped in; birds, and the call to prayer at dusk, so that you hear your own thoughts again.
          </p>
        </div>
      </section>

      <section className="bg-tadelakt px-5 md:px-10 lg:px-14 py-24 md:py-36">
        <p className="house mx-auto max-w-[1500px] font-light text-[clamp(1.6rem,3vw,2.8rem)] leading-[1.2] tracking-[-0.02em] md:pl-[20%]">
          A Medina house was built to turn its back on the street and its face to the sky. <em>Thick walls hold the cool of the night into the afternoon; the roof catches the first light and the last.</em> Plaster a little uneven, wool that has been walked on, a painting that was never meant to match the cushions. Nothing here is perfect, and nothing is pretending.
        </p>
      </section>

      <section className="night bg-night text-limewash mt-24 md:mt-36 px-5 md:px-10 lg:px-14 py-28 md:py-44">
        <div className="mx-auto max-w-[1500px] grid md:grid-cols-12 gap-12">
          <h2 className="house md:col-span-5 font-light text-[clamp(2.2rem,4.8vw,4.6rem)] leading-[1.02] tracking-[-0.03em]">
            The origin of dyafa
          </h2>
          <p className="md:col-span-6 md:col-start-7 house italic font-light text-[1.3rem] md:text-[1.5rem] leading-[1.6] text-limewash">
            In the caravan towns, a traveller who knocked was taken in for three days, fed and sheltered, no questions asked. The guest was protected, and the house was honoured by having one.
          </p>
        </div>
      </section>

      <section className="bg-night">
        <div className="bg-limewash px-5 md:px-10 lg:px-14 py-28 md:py-44">
          <figure className="mx-auto max-w-[1500px]">
            <blockquote className="house italic font-light text-[clamp(2rem,4.4vw,4.2rem)] leading-[1.08] tracking-[-0.025em] max-w-[22ch]">
              Dyafa runs both ways.
            </blockquote>
            <figcaption className="mt-8 text-lg text-ink">
              We receive you with care, and we ask the same care for the house: its neighbours, its quiet, its old walls. That is why the house rules are few and firm.
            </figcaption>
            <Link href="/the-house" className="btn-door mt-10 inline-block">The house, room by room</Link>
          </figure>
        </div>
      </section>
    </div>
  );
}
