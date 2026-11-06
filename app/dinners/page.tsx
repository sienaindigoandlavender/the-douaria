export const dynamic = 'force-dynamic'; // always live — reflect Supabase edits immediately

import type { Metadata } from "next";
import { getHero, getList } from "@/lib/data";
import QuoteCarousel from "@/components/QuoteCarousel";
import HouseHero from "@/components/house/HouseHero";
import Walk from "@/components/house/Walk";
import { DINNER_REVIEWS } from "@/lib/dinnerReviews";

export const metadata: Metadata = ({
  title: "Dinners",
  description:
    "A traditional Moroccan menu cooked by Zahra, served at home, in a 300-year-old house in the Marrakech medina. Reserve with Zahra on WhatsApp.",
  
});

const WHATSAPP = "212619112008";
const waLink = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hello Zahra, I'd like to reserve dinner at the house.")}`;

export default async function DinnersPage() {
  // Photos are added in Supabase: `dinners_hero` (one row) and `dinner_photos` (a list).
  const [hero, photos] = await Promise.all([getHero("dinners_hero"), getList("dinner_photos")]);
  // Until a row is added in Supabase, a calm concept image: one plate on the zellige table.
  const heroImage = hero?.Image_URL || "/images/dinners-hero.jpg";
  const concept = !hero?.Image_URL;

  return (
    <div className="night bg-night text-limewash min-h-screen">
      <HouseHero
        tone="night"
        light={concept}
        title="Dinners"
        lede={hero?.Subtitle || "A menu from the morning market, cooked by Zahra, served in the courtyard."}
        image={heroImage}
        alt="A Moroccan dinner at the house"
      >
        <a href={waLink} className="btn-door">Reserve with Zahra on WhatsApp</a>
      </HouseHero>

      {/* The house dinner */}
      <section className="px-5 md:px-10 lg:px-14 py-24 md:py-36">
        <div className="mx-auto max-w-[1500px] grid md:grid-cols-12 gap-10">
          <h2 className="house md:col-span-5 font-light text-[clamp(2rem,4vw,3.8rem)] leading-[1.04] tracking-[-0.03em]">
            Dinner at the house
          </h2>
          <p className="md:col-span-6 md:col-start-7 text-[1.2rem] md:text-[1.3rem] leading-[1.75] text-limewash">
            Three courses, traditional, made from what came from the market that morning. Zahra cooks, the way
            she cooks breakfast: by hand, from the season. It is served in the courtyard, by candlelight, for guests
            staying with us.
          </p>
        </div>

        {/* The menu, read like a letter at the table */}
        <div className="mx-auto max-w-[1500px] mt-20 md:mt-32 grid md:grid-cols-3 gap-14 md:gap-10 text-center md:text-left">
          <div>
            <p className="house italic text-candle text-lg mb-4">To start</p>
            <p className="house font-light text-[clamp(1.7rem,2.6vw,2.4rem)] leading-[1.15]">Seasonal vegetables and Moroccan salads</p>
          </div>
          <div className="md:pt-16">
            <p className="house italic text-candle text-lg mb-4">Tagine, your choice of</p>
            <p className="house font-light text-[clamp(1.7rem,2.6vw,2.4rem)] leading-[1.15]">Chicken and lemon</p>
            <p className="house italic my-2 text-limewash">or</p>
            <p className="house font-light text-[clamp(1.7rem,2.6vw,2.4rem)] leading-[1.15]">Beef and dried prunes</p>
          </div>
          <div className="md:pt-32">
            <p className="house italic text-candle text-lg mb-4">To finish</p>
            <p className="house font-light text-[clamp(1.7rem,2.6vw,2.4rem)] leading-[1.15]">Orange with cinnamon</p>
          </div>
        </div>

        <dl className="mx-auto max-w-[1500px] mt-20 md:mt-28 grid sm:grid-cols-3 gap-8 border-t border-limewash/15 pt-10 text-[1.15rem]">
          <div>
            <dt className="house italic text-candle mb-2">Price</dt>
            <dd>250 MAD a person</dd>
          </div>
          <div>
            <dt className="house italic text-candle mb-2">For</dt>
            <dd>Guests staying at the house</dd>
          </div>
          <div>
            <dt className="house italic text-candle mb-2">Diets and allergies</dt>
            <dd className="text-limewash">Vegetarian, vegan or gluten-free on request. Tell Zahra when you reserve.</dd>
          </div>
        </dl>
        <div className="mx-auto max-w-[1500px] mt-12 flex flex-wrap items-center gap-x-8 gap-y-5">
          <a href={waLink} className="btn-door">Reserve with Zahra on WhatsApp</a>
          <p className="text-limewash text-base max-w-[38ch] mb-0">All proceeds from dinners go to Zahra and her team.</p>
        </div>
      </section>

      {/* Photos, once they're in: a walk along the table */}
      {photos.length > 0 && (
        <section className="pb-24 md:pb-36">
          <Walk
            tone="night"
            items={photos.map((p: any) => ({
              image: p.Image_URL,
              title: p.Title || undefined,
              alt: p.Title || "Dinner at the house",
            }))}
          />
        </section>
      )}

      {/* What guests say — one at a time, no autoplay */}
      <section className="bg-tadelakt text-ink px-5 md:px-10 lg:px-14 py-24 md:py-36">
        <div className="mx-auto max-w-[1500px]">
          <QuoteCarousel testimonials={DINNER_REVIEWS} />
          <p className="mt-12 text-base text-ink mb-0">From our guests' reviews on Booking.com.</p>
        </div>
      </section>

      {/* The Table */}
    </div>
  );
}
