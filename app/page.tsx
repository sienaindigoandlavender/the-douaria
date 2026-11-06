import Link from "next/link";
import HouseHero from "@/components/house/HouseHero";
import Walk from "@/components/house/Walk";
import QuoteCarousel from "@/components/QuoteCarousel";
import { REVIEWS } from "@/lib/reviews";

export const revalidate = 300;

// Riad di Siena's home page, duplicated for the Douaria (Jacqueline, 6 Nov 2026: "the new site lost its soul,
// keep the riad's warmth; only the rooms and the hero photo change"). The walk: the photo and the welcome,
// dyafa, the three rooms, guests' words, an honest note. No dinners or beyond-the-walls (those are the riad's).

const ROOMS = [
  { href: "/rooms#love", image: "/photos/love.webp", title: "Love", sub: "Ground floor, off the courtyard" },
  { href: "/rooms#joy", image: "/photos/joy.webp", title: "Joy", sub: "First floor, saffron yellow" },
  { href: "/rooms#bliss", image: "/photos/bliss.webp", title: "Bliss", sub: "First floor, under the lantern" },
  { href: "/rooms#the-whole-house", image: "/photos/bliss-wide.webp", title: "The whole house", sub: "Up to six, nobody but your own people" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-limewash text-ink">
      <HouseHero
        alt=""
        title="Welcome home."
        lede="A 300-year-old house in the heart of the medina. Old walls, deep quiet, genuine care."
      >
        {/* No hero photo until the new one is taken (Jacqueline, 6 Nov 2026): the tea drawing instead. */}
        <img src="/drawings/breakfast.svg" alt="" aria-hidden draggable={false} className="w-full max-w-[320px] -ms-2 select-none" />
      </HouseHero>

      {/* DYAFA: the one thing that makes us different. */}
      <section className="relative overflow-hidden px-5 md:px-10 lg:px-14 py-28 md:py-44">
        <span
          aria-hidden="true"
          dir="rtl"
          className="pointer-events-none select-none absolute -right-[6vw] top-10 md:top-16 leading-none text-bejmat/[0.07]"
          style={{ fontFamily: "'Amiri', serif", fontSize: "clamp(10rem, 34vw, 34rem)" }}
        >
          ضيافة
        </span>
        <div className="relative mx-auto max-w-[1500px] grid md:grid-cols-12 gap-y-14">
          <h2 className="house md:col-span-10 lg:col-span-9 font-light text-[clamp(2.2rem,5.4vw,5.4rem)] leading-[1.02] tracking-[-0.03em]">
            There is an old Arabic word for the way a guest is received:{" "}
            <span className="whitespace-nowrap">dyafa.</span>
          </h2>
          <img src="/drawings/jams.svg" alt="" aria-hidden draggable={false} className="md:col-span-5 md:row-start-2 self-center w-full max-w-[460px] -ms-2 select-none" />
          <div className="md:col-span-6 md:col-start-6 lg:col-span-5 lg:col-start-7 md:row-start-2">
            <p className="text-[1.2rem] md:text-[1.3rem] leading-[1.75] text-ink">
              Born in the desert, where taking in a weary traveler was a sacred duty, it lives on in Moroccan
              life as a point of honor. When you cross our threshold you are not a customer to be attended to,
              but a guest to be cared for: met with a hot glass of tea, a room prepared with devotion, and the
              ease of knowing you are held by a house that takes real pride in your comfort.
            </p>
            <Link href="/philosophy" className="link-house inline-block mt-8 text-lg">
              Our philosophy
            </Link>
          </div>
        </div>
      </section>

      {/* THE ROOMS: Love, Joy, Bliss, or the whole house. */}
      <section className="night bg-bejmat text-limewash pt-28 md:pt-40 pb-24 md:pb-32">
        <div className="mx-auto max-w-[1500px] px-5 md:px-10 lg:px-14 mb-12 md:mb-16 flex flex-wrap items-end justify-between gap-6">
          <h2 className="house font-light text-limewash text-[clamp(2.1rem,4.6vw,4.4rem)] leading-[1.02] tracking-[-0.03em] max-w-[16ch]">
            Three rooms around a courtyard
          </h2>
          <Link href="/rooms" className="link-house text-lg text-limewash">
            See the rooms
          </Link>
        </div>
        <Walk items={ROOMS} tone="clay" />
      </section>

      {/* GUEST VOICES: one at a time, stepped by hand. */}
      <section className="bg-tadelakt px-5 md:px-10 lg:px-14 py-28 md:py-40">
        <div className="mx-auto max-w-[1500px]">
          <QuoteCarousel testimonials={REVIEWS.map((r) => ({ Quote: r.text, Guest_Name: r.name }))} />
        </div>
      </section>

      {/* A NOTE BEFORE YOU BOOK: honesty as disclosure, low and quiet. */}
      <section className="bg-straw px-5 md:px-10 lg:px-14 py-24 md:py-32">
        <div className="mx-auto max-w-[1500px] grid md:grid-cols-12 gap-8">
          <h2 className="house md:col-span-4 font-normal text-2xl leading-snug">
            A house with three centuries in its walls.
          </h2>
          <div className="md:col-span-6 md:col-start-6">
            <p className="text-[1.1rem] leading-relaxed text-ink">
              Come as you would come to a home: for the quiet, the courtyard open to the sky, the roof terrace in
              the evening. The plaster is soft with age, the stairs are steep and some rooms have no outside window,
              the old way these houses keep cool. The house is lived-in, and held by the people who look after it.
              You will feel it the moment you cross the threshold.
            </p>
            <Link href="/before-you-book" className="link-house inline-block mt-6 text-base">
              Read before you book
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
