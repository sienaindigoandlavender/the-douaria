import Link from "next/link";
import HouseHero from "@/components/house/HouseHero";
import { getHero } from "@/lib/data";

export const dynamic = "force-dynamic";

// Day trips from our door (Jacqueline, 31 Oct 2026). Linked from the pre-arrival message.
// One price per car (1 to 4 people), private, run by the house's driver. Prices = the driver's
// cost plus a small margin for the house; change them here.

const WA =
  "https://wa.me/212619112008?text=" + encodeURIComponent("Hello Zahra, we would like a day trip. Which one and our date:");

const TRIPS = [
  {
    title: "Agafay",
    hours: "About 6 hours",
    eur: 100,
    line: "The stone desert forty minutes from the medina. No sand, only rock, silence and the Atlas on the horizon.",
    image: "https://res.cloudinary.com/dhv1s6fgm/image/upload/v1773810135/agafay-day-tri_yrkxhk.png",
  },
  {
    title: "The Ourika valley",
    hours: "About 6 hours",
    eur: 110,
    line: "The green valley south of the city: Amazigh villages, terraced gardens, a river that runs cold from the mountains.",
    image: "https://res.cloudinary.com/dhv1s6fgm/image/upload/v1773810433/ourika-valley-day-trip_qbtcyn.png",
  },
  {
    title: "Imlil and the High Atlas",
    hours: "About 7 hours",
    eur: 110,
    line: "The village at the foot of Toubkal. Walnut trees, mule paths, a short walk where the city ends and the mountains begin.",
    image: "https://res.cloudinary.com/dhv1s6fgm/image/upload/v1773810350/mountains_day_trip_dxewot.png",
  },
  {
    title: "Essaouira",
    hours: "About 12 hours",
    eur: 160,
    line: "The wind city on the Atlantic. Blue boats, white walls, thuya wood and sardines off the grill.",
    image: "https://res.cloudinary.com/dhv1s6fgm/image/upload/v1773810273/essaouira_day_trip_afpgjn.png",
  },
  {
    title: "The Ouzoud falls",
    hours: "About 10 hours",
    eur: 170,
    line: "Morocco's highest waterfall, 110 metres of it, with macaques in the olive trees above.",
    image: "https://res.cloudinary.com/dhv1s6fgm/image/upload/v1773810490/ouzoud-falls-day-trip_dbvfwd.png",
  },
  {
    title: "Aït Benhaddou",
    hours: "About 12 hours",
    eur: 205,
    line: "Over the Tizi n'Tichka pass to the red earthen ksar, and the film studios of Ouarzazate if you like.",
    image: "https://res.cloudinary.com/dhv1s6fgm/image/upload/v1773810543/ait-ben-haddou-day-trip_nverg3.png",
  },
];

export default async function DayTripsPage() {
  const saharaImg = ((await getHero("desert_hero")) as any)?.Image_URL as string | undefined;
  return (
    <div className="bg-limewash text-ink min-h-screen">
      <HouseHero
        title="Day trips from our door"
        lede="Your own car and driver for the day. One price per car, up to four of you."
        image="https://res.cloudinary.com/dhv1s6fgm/image/upload/v1773810350/mountains_day_trip_dxewot.png"
        alt="The road out of Marrakech toward the Atlas"
      />

      <section className="bg-limewash px-5 md:px-10 lg:px-14 py-20 md:py-28">
        <ol className="mx-auto max-w-[1500px] grid md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
          {TRIPS.map((t) => (
            <li key={t.title} className="flex flex-col">
              <img src={t.image} alt={t.title} loading="lazy" draggable={false} className="w-full aspect-[4/3] object-cover select-none" />
              <h2 className="house font-light text-[clamp(1.8rem,2.6vw,2.4rem)] leading-[1.05] mt-6">{t.title}</h2>
              <p className="text-[15px] text-ink mt-1">{t.hours}</p>
              <p className="text-[1.1rem] leading-[1.65] text-ink mt-4 flex-grow">{t.line}</p>
              <p className="mt-6 border-t border-ink/20 pt-5">
                <span className="house text-[2rem] leading-none text-bejmat">€{t.eur}</span>
                <span className="ms-3 text-[14px] text-ink">per car, 1 to 4 people</span>
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* One button for every trip: Zahra asks which one */}
      <section className="night bg-night text-limewash px-5 md:px-10 lg:px-14 py-24 md:py-32">
        <div className="mx-auto max-w-[1500px] grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-7">
            <h2 className="house font-light text-[clamp(2.6rem,6vw,5.6rem)] leading-[0.98] tracking-[-0.03em]">
              Pick a day. <span className="italic">Tell Zahra.</span>
            </h2>
            <p className="mt-6 text-[1.15rem] md:text-[1.25rem] leading-[1.7] text-limewash">
              Included: a private car and driver from our door and back, fuel and tolls.
            </p>
            <p className="mt-3 text-[15px] leading-[1.6] text-limewash">Not included: lunch, entry fees and tips.</p>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <a href={WA} target="_blank" rel="noopener noreferrer" className="block w-full bg-door text-ink text-center py-5 text-[18px] hover:bg-[#F1E2AE] transition-colors">
              Reserve with Zahra
            </a>
            <p className="mt-4 text-[15px] text-limewash">Tell her which trip and your date. She replies on WhatsApp.</p>
          </div>
        </div>
      </section>

      {/* Longer, or later: the Agafay evening and the Sahara, as two full-bleed photographs */}
      <section className="bg-limewash">
        <div className="px-5 md:px-10 lg:px-14 pt-20 md:pt-28 pb-10 md:pb-14">
          <div className="mx-auto max-w-[1500px] flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="house font-light text-[clamp(2.2rem,4.6vw,4.4rem)] leading-[1.02] tracking-[-0.03em] text-ink">
              Or stay out <span className="italic text-bejmat">a little longer.</span>
            </h2>
            <p className="text-[1.1rem] text-ink md:max-w-sm md:text-end">An evening in the stone desert, or three days to the dunes. Same door, same driver.</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2">
          {[
            {
              href: "/agafay",
              img: TRIPS[0].image,
              alt: "The stone desert of Agafay at sunset",
              kick: "An evening",
              title: "The other desert",
              line: "Agafay at sunset, a camel, dinner under the Atlas.",
              price: "€130 per person",
            },
            {
              href: "/sahara",
              img: saharaImg,
              alt: "The dunes of Erg Chebbi in the Sahara",
              kick: "Three days",
              title: "To the Sahara",
              line: "Over the mountains, a 500-year-old kasbah, then a night in the dunes.",
              price: "€450 per person",
            },
          ].map((c) => (
            <Link key={c.href} href={c.href} className="group relative block overflow-hidden min-h-[70vh] md:min-h-[86vh] bg-night">
              {c.img && (
                <img
                  src={c.img}
                  alt={c.alt}
                  loading="lazy"
                  draggable={false}
                  className="absolute inset-0 w-full h-full object-cover select-none transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
                />
              )}
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#1D1814]/85 via-[#1D1814]/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-12 text-limewash">
                <p className="text-[13px] tracking-[0.18em] uppercase">{c.kick}</p>
                <h3 className="mt-3 house italic font-light text-[clamp(2.6rem,5vw,4.8rem)] leading-[0.95] tracking-[-0.025em]">{c.title}</h3>
                <p className="mt-4 text-[1.1rem] md:text-[1.2rem] leading-relaxed max-w-md">{c.line}</p>
                <div className="mt-6 flex items-center justify-between gap-6 border-t border-limewash/50 pt-4 max-w-md">
                  <span className="text-[16px]">{c.price}</span>
                  <span className="text-[16px] group-hover:translate-x-1 transition-transform">See it &rarr;</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
