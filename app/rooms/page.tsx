import type { Metadata } from "next";
import HouseHero from "@/components/house/HouseHero";
import BookButton from "@/components/BookButton";
import { STAYS, stayPrice, type Stay } from "@/lib/stays";
import { getHouseTerms } from "@/lib/houseTerms";
import { cityTaxEur } from "@/lib/cityTax";
import { IconBed, IconShower, IconAC, IconBreakfast, IconStairs, IconTerrace, IconRoom } from "@/components/icons";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Rooms",
  description: "Love, Joy and Bliss: three rooms around a courtyard at No. 35 Derb Fhal Zefriti, each with its own bathroom, or the whole house for up to six.",
};

// Riad di Siena's rooms page, with the Douaria's three rooms (Jacqueline, 6 Nov 2026). Each room: the photo on
// the left, whole, the words on the right; then the whole house on tadelakt. The house is sold as one here
// (3 Nov 2026): the rooms are shown, the whole house is what you book. Price from ops (house_terms.douaria).

const icon = (f: string) => {
  const l = f.toLowerCase();
  if (/bathroom|shower/.test(l)) return <IconShower size={20} />;
  if (/air|heat/.test(l)) return <IconAC size={20} />;
  if (/breakfast|dinner/.test(l)) return <IconBreakfast size={20} />;
  if (/stair|floor/.test(l)) return <IconStairs size={20} />;
  if (/terrace/.test(l)) return <IconTerrace size={20} />;
  if (/guest|children|\bbeds?\b|m²/.test(l)) return <IconBed size={20} />;
  if (/bliss|love|joy/.test(l)) return <IconRoom size={20} />;
  return null;
};

function Room({ s, price = 0, tax = 0 }: { s: Stay; price?: number; tax?: number }) {
  const house = s.id === "douaria-house";
  return (
    <article id={s.slug} className="pb-24 md:pb-40 scroll-mt-24">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10 lg:px-14 grid md:grid-cols-12 gap-10 md:gap-12 items-stretch">
        <div className="md:col-span-7 relative overflow-hidden bg-tadelakt aspect-[3/4] md:aspect-auto md:min-h-[78svh]">
          <img src={s.photos[0]} alt={s.name} draggable={false} className="absolute inset-0 w-full h-full object-cover object-center select-none" />
        </div>
        <div className="md:col-span-5 flex flex-col justify-center">
          <h2 className="house italic font-light text-[clamp(2.4rem,4vw,3.8rem)] leading-[0.95] tracking-[-0.035em] mb-6">{s.name}</h2>
          {s.story.map((p, i) => (
            <p key={i} className="text-[1.05rem] leading-[1.65] text-ink mb-4">{p}</p>
          ))}
          <ul className="mt-4 grid grid-cols-2 gap-x-5 gap-y-2">
            {s.facts.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-[14px] text-ink">
                <span className="text-bejmat shrink-0 w-6 flex justify-center">
                  {icon(f) || <span className="w-1.5 h-1.5 rounded-full bg-bejmat block" />}
                </span>
                {f}
              </li>
            ))}
          </ul>
          {house ? (
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <p className="mb-0">
                <span className="text-ink text-base">From </span>
                <span className="house font-light text-[1.9rem] leading-none">€{Math.round(price)}</span>
                <span className="text-ink text-base"> a night</span>
              </p>
              <BookButton
                id={s.id}
                name={s.bookingName}
                price={price}
                maxGuests={s.maxGuests}
                cityTax={tax}
                label="Reserve the whole house"
                className="btn-door"
              />
            </div>
          ) : (
            <a href="#the-whole-house" className="link-house mt-8 inline-block text-lg">Book the house</a>
          )}
          {s.photos.length > 1 && (
            <div className="mt-10 grid grid-cols-3 gap-3">
              {s.photos.slice(1, 4).map((p) => (
                <div key={p} className="relative aspect-[3/4] overflow-hidden bg-tadelakt">
                  <img src={p} alt="" loading="lazy" draggable={false} className="absolute inset-0 h-full w-full object-cover select-none" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default async function RoomsPage() {
  const [terms, tax] = await Promise.all([getHouseTerms(), cityTaxEur()]);
  const house = STAYS.find((s) => s.id === "douaria-house")!;
  const rooms = STAYS.filter((s) => s.id !== "douaria-house");

  return (
    <div className="bg-limewash text-ink min-h-screen">
      <HouseHero
        title="Rooms"
        lede="Love, Joy and Bliss, around a small courtyard open to the sky. The house is yours, whole."
        image="/photos/bliss-3.webp"
        alt="Bliss, upstairs at the Douaria"
      />

      <section className="px-5 md:px-10 lg:px-14 pt-24 md:pt-36 pb-20 md:pb-28">
        <p className="mx-auto max-w-[1500px] house font-light text-[clamp(2.2rem,4.6vw,4.4rem)] leading-[1.04] tracking-[-0.03em] text-ink md:pe-[30%]">
          Every room is different. <span className="italic text-bejmat">Each one keeps its own quiet.</span>
        </p>
      </section>

      <section className="pb-12 md:pb-20">
        {rooms.map((s) => <Room key={s.id} s={s} />)}
      </section>

      <section className="bg-tadelakt pt-20 md:pt-28 pb-12 md:pb-20">
        <div className="mx-auto max-w-[1500px] px-5 md:px-10 lg:px-14 pb-14 md:pb-20 grid md:grid-cols-12 gap-8">
          <h2 className="md:col-span-5 house font-light text-[clamp(2rem,4vw,3.8rem)] leading-[1.02] tracking-[-0.03em]">
            The whole house, yours
          </h2>
          <p className="md:col-span-6 md:col-start-7 text-[1.2rem] leading-[1.7] text-ink">
            All three rooms, the courtyard and the roof terrace, for up to six. Close the door on the Medina with
            nobody but your own people.
          </p>
        </div>
        <Room s={house} price={stayPrice(terms, house)} tax={tax} />
      </section>

      <div className="px-6 pb-4 pt-16">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-base text-ink">
          <a href="/before-you-book" className="underline underline-offset-2">Before you book</a>
          <span aria-hidden="true">|</span>
          <a href="/booking-conditions" className="underline underline-offset-2">Booking conditions</a>
          <span aria-hidden="true">|</span>
          <a href="/house-rules" className="underline underline-offset-2">House rules</a>
        </div>
      </div>
      <div className="px-5 md:px-10 lg:px-14 pb-24">
        <img src="/drawings/walle-cushions.svg" alt="" aria-hidden draggable={false} className="block w-32 md:w-40 ms-auto select-none" />
      </div>
    </div>
  );
}
