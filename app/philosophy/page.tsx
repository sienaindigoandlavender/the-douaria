import type { Metadata } from "next";
import PageHead, { NextPage } from "@/components/PageHead";

export const metadata: Metadata = {
  title: "Philosophy",
  description: "Dyafa, the old Moroccan way of receiving a guest: you are not a customer here. A whole house in the Marrakech Medina, kept for rest, good food and quiet.",
};

const CARE = [
  { what: "Rest", line: "Dark rooms, thick walls, a door that closes on the city. The night is for sleeping, and the house is kept that way." },
  { what: "Food", line: "Warm bread, fruit from the season, olive oil, honey. Breakfast on the roof, where the morning light lands first." },
  { what: "Quiet", line: "No music piped in. Birds on the roof, the call to prayer at dusk. You hear your own thoughts again." },
];

export default function PhilosophyPage() {
  return (
    <>
      <PageHead
        kicker="Philosophy"
        title={<>You are not a customer here. <em>You are a guest.</em></>}
        line="Dyafa is the old Moroccan word for receiving someone under your roof. It still runs this house."
        photo="/photos/detail-niche.webp"
        alt="A niche in the plaster wall at No. 35"
      />

      {/* What dyafa means */}
      <section className="bg-plaster">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-4 py-24 md:grid-cols-12 md:px-10 md:py-40">
          <p className="kicker uppercase md:col-span-3">Dyafa</p>
          <div className="md:col-span-9">
            <p className="font-display text-[30px] leading-[1.2] md:text-[46px]">
              In the caravan towns, a traveller who knocked was taken in for three days, fed and sheltered, no questions asked. <em>The guest was protected, and the house was honoured by having one.</em>
            </p>
            <div className="mt-14 grid gap-8 text-[17px] md:grid-cols-2 md:pe-[12%]">
              <p>
                That is the spirit of No. 35. Tea when you arrive. Rooms made ready by hand. Zahra, who knows the house and the lanes around it, and who looks after you as she would look after family.
              </p>
              <p>
                Dyafa runs both ways. We receive you with care, and we ask the same care for the house: its neighbours, its quiet, its old walls. That is why the house rules are few and firm.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What we take care of */}
      <section className="bg-lime">
        <div className="mx-auto max-w-[1400px] px-4 py-24 md:px-10 md:py-36">
          <p className="kicker uppercase">What we look after</p>
          <ol className="mt-12 grid gap-10 md:mt-24 md:grid-cols-3 md:gap-8">
            {CARE.map((c) => (
              <li key={c.what} className="border-t border-ink pt-5">
                <p className="font-display text-[30px] leading-none md:text-[34px]">
                  <em>{c.what}</em>
                </p>
                <p className="mt-4 text-[17px]">{c.line}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* The old house */}
      <section className="bg-plaster">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-4 py-24 md:grid-cols-12 md:px-10 md:py-36">
          <p className="kicker uppercase md:col-span-3">The old house</p>
          <div className="md:col-span-9">
            <p className="max-w-3xl font-display text-[26px] leading-[1.25] md:text-[36px]">
              A Medina house was built to turn its back on the street and its face to the sky. <em>Thick walls hold the cool of the night into the afternoon; the roof catches the first light and the last.</em>
            </p>
            <p className="mt-10 max-w-2xl text-[17px]">
              We keep what the house was built to do, and take away what gets in its way. Plaster that is a little uneven, wool that has been walked on, a painting that was never meant to match the cushions. Nothing here is perfect, and nothing is pretending.
            </p>
          </div>
        </div>
      </section>

      <NextPage href="/the-house" kicker="Next" title={<>The house, <em>room by room</em></>} />
    </>
  );
}
