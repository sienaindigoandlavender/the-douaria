import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { STAYS, stayBySlug, stayPrice } from "@/lib/stays";
import { getHouseTerms } from "@/lib/houseTerms";
import { cityTaxEur } from "@/lib/cityTax";
import BookButton from "@/components/BookButton";

export const revalidate = 300;
export const generateStaticParams = () => STAYS.map((s) => ({ slug: s.slug }));

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const s = stayBySlug(params.slug);
  if (!s) return {};
  return { title: s.name, description: s.line, openGraph: { images: [s.photos[0]] } };
}

export default async function StayPage({ params }: { params: { slug: string } }) {
  const s = stayBySlug(params.slug);
  if (!s) notFound();
  const [terms, tax] = await Promise.all([getHouseTerms(), cityTaxEur()]);
  const price = stayPrice(terms, s);
  const house = STAYS[0];
  const isHouse = s.id === house.id;
  const others = STAYS.filter((o) => o.slug !== s.slug);
  // Each page wears its room's wool; the whole house wears the cobalt of the paintings.
  const wear: Record<string, string> = {
    "the-whole-house": "bg-cobalt text-plaster",
    love: "bg-madder text-plaster",
    joy: "bg-saffron text-ink",
    bliss: "bg-wool text-ink",
  };
  const dark = s.slug === "the-whole-house" || s.slug === "love";
  const btn = dark
    ? "bg-plaster px-7 py-3.5 text-[15px] text-ink hover:bg-saffron transition-colors"
    : "bg-ink px-7 py-3.5 text-[15px] text-plaster hover:bg-cobalt transition-colors";

  return (
    <>
      <section className={`pt-16 ${wear[s.slug]}`}>
        <div className="grid md:grid-cols-12">
          <img src={s.photos[0]} alt={s.name} className="aspect-[4/5] w-full object-cover md:col-span-7 md:aspect-auto md:h-[calc(100svh-4rem)]" />
          <div className="flex flex-col justify-end gap-8 px-4 py-12 md:col-span-5 md:px-12 md:py-16">
            <p className="kicker uppercase">The Douaria · No. 35</p>
            <h1 className="font-display text-[64px] leading-[0.9] md:text-[104px]"><em>{s.name}</em></h1>
            <p className="text-[18px]">{s.line}</p>
            {isHouse ? (
              <div className="flex flex-wrap items-center gap-6">
                <p className="text-[17px]"><span className="font-display text-[32px]">€{price}</span> a night</p>
                <BookButton id={s.id} name={s.bookingName} price={price} maxGuests={s.maxGuests} cityTax={tax} className={btn} />
              </div>
            ) : (
              <div className="space-y-5">
                <p className="text-[17px]">{s.name} is one of the three rooms of the Douaria, let as one house for up to six.</p>
                <div className="flex flex-wrap items-center gap-6">
                  <p className="text-[17px]"><span className="font-display text-[32px]">€{stayPrice(terms, house)}</span> a night, the whole house</p>
                  <BookButton id={house.id} name={house.bookingName} price={stayPrice(terms, house)} maxGuests={house.maxGuests} cityTax={tax} label="Book the house" className={btn} />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-plaster">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-4 py-20 md:grid-cols-12 md:px-10 md:py-28">
          <div className="space-y-6 text-[18px] md:col-span-6 md:col-start-2">
            {s.story.map((p, i) => (
              <p key={i} className={i === 0 ? "font-display text-[28px] leading-[1.25] md:text-[38px]" : ""}>{p}</p>
            ))}
          </div>
          <ul className="space-y-3 border-t border-ink pt-6 text-[16px] md:col-span-3 md:col-start-9">
            {s.facts.map((f) => (
              <li key={f}>{f}</li>
            ))}
            <li>Wi-Fi</li>
            <li>Check-in 3 PM to 9 PM, check-out by 11 AM</li>
          </ul>
        </div>
      </section>

      {s.photos.length > 1 && (
        <section className="grid gap-1 bg-plaster md:grid-cols-3">
          {s.photos.slice(1, 4).map((src) => (
            <img key={src} src={src} alt="" className="aspect-[3/4] w-full object-cover" />
          ))}
        </section>
      )}

      <section className="bg-lime">
        <div className="mx-auto max-w-[1400px] px-4 py-20 md:px-10">
          <p className="kicker mb-8">{isHouse ? "The rooms inside" : "The rest of the house"}</p>
          <div className="grid gap-1 md:grid-cols-3">
            {others.map((o) => (
              <Link key={o.slug} href={`/stay/${o.slug}`} className="group block bg-plaster">
                <img src={o.photos[0]} alt={o.name} className="aspect-[4/3] w-full object-cover" />
                <div className="flex items-baseline justify-between p-5">
                  <span className="font-display text-[26px] group-hover:underline">{o.name}</span>
                </div>
              </Link>
            ))}
          </div>
          <p className="mt-10 text-[15px]">
            Old house, honest notes: <Link href="/before-you-book" className="underline underline-offset-4">read them before you book</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
