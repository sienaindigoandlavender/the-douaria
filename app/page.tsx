import Link from "next/link";
import { STAYS, stayPrice } from "@/lib/stays";
import { getHouseTerms } from "@/lib/houseTerms";
import { cityTaxEur } from "@/lib/cityTax";
import BookButton from "@/components/BookButton";

export const revalidate = 300;

export default async function Home() {
  const [terms, tax] = await Promise.all([getHouseTerms(), cityTaxEur()]);
  const house = STAYS[0];
  const rooms = STAYS.slice(1);

  return (
    <>
      {/* Hero: one full-bleed photograph */}
      <section className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-ink">
        <img src="/photos/bliss-wide.webp" alt="Bliss, the long room upstairs, under its brass lantern" className="absolute inset-0 h-full w-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-ink/30" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1400px] px-4 pb-14 text-plaster md:px-10 md:pb-20">
          <p className="rise kicker mb-4">35 Derb Fhal Zefriti · Marrakech Medina</p>
          <h1 className="rise rise-2 max-w-4xl font-display text-[44px] leading-[1.02] md:text-[88px]">
            A small white house, three rooms and a door that closes on the Medina.
          </h1>
          <div className="rise rise-3 mt-8 flex flex-wrap gap-3">
            <Link href="#stay" className="bg-plaster px-7 py-3.5 text-[15px] text-ink hover:bg-saffron transition-colors">See the rooms</Link>
          </div>
        </div>
      </section>

      {/* What a douaria is */}
      <section id="house" className="scroll-mt-16 bg-plaster">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-4 py-24 md:grid-cols-12 md:px-10 md:py-36">
          <p className="kicker md:col-span-3">The house</p>
          <div className="md:col-span-8">
            <p className="font-display text-[30px] leading-[1.2] md:text-[44px]">
              A douaria is the little house that once stood beside a big one, kept for guests and the overflow of a family. Ours has painted beams, brass lanterns and white walls that let the colours do the talking.
            </p>
            <div className="mt-10 grid gap-8 text-[17px] md:grid-cols-2">
              <p>
                It sits on a quiet lane in Laksour, a few minutes on foot from Jemaa el-Fna. Step inside and the snake charmers and motorbikes give way to a courtyard, three bedrooms, a roof terrace and the call to prayer drifting over from the neighbourhood mosque.
              </p>
              <p>
                Zahra looks after the house and its guests, and answers on WhatsApp. Ask her the day before and she cooks: breakfast on the roof terrace, a Moroccan dinner at home. The rest of the day is yours: go out, come back, close the door.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Picture band */}
      <section className="grid grid-cols-2 gap-1 bg-plaster md:grid-cols-4">
        {["/photos/love-2.webp", "/photos/detail-niche.webp", "/photos/joy-2.webp", "/photos/bliss-painting.webp"].map((src) => (
          <img key={src} src={src} alt="" className="aspect-[3/4] w-full object-cover" />
        ))}
      </section>

      {/* The house, as one */}
      <section id="stay" className="scroll-mt-16 bg-lime">
        <div className="mx-auto max-w-[1400px] px-4 py-24 md:px-10 md:py-32">
          <p className="kicker mb-4">Stay</p>
          <h2 className="max-w-3xl font-display text-[36px] leading-[1.1] md:text-[56px]">The whole house, for you and your people.</h2>

          <article className="mt-14 grid gap-0 bg-plaster md:grid-cols-2">
            <img src="/photos/joy-wide.webp" alt="Joy, upstairs" className="aspect-[4/3] h-full w-full object-cover" />
            <div className="flex flex-col justify-between gap-8 p-6 md:p-12">
              <div>
                <p className="kicker">Up to six guests</p>
                <h3 className="mt-2 font-display text-[36px] md:text-[44px]">The Douaria</h3>
                <p className="mt-4 text-[17px]">{house.line}</p>
                <ul className="mt-6 space-y-1.5 text-[16px]">
                  {house.facts.map((f) => <li key={f}>{f}</li>)}
                </ul>
              </div>
              <div className="flex flex-wrap items-center gap-6">
                <p className="text-[17px]"><span className="font-display text-[28px]">€{stayPrice(terms, house)}</span> a night</p>
                <BookButton id={house.id} name={house.bookingName} price={stayPrice(terms, house)} maxGuests={house.maxGuests} cityTax={tax} />
              </div>
            </div>
          </article>
          <p className="mt-6 text-[14px]">City tax (€{tax.toFixed(2)} a person a night) is added at checkout, as the city requires.</p>

          {/* The three rooms inside: described, not sold here */}
          <h3 className="mt-24 font-display text-[30px] md:text-[40px]">The three rooms inside</h3>
          <div className="mt-8 grid gap-1 md:grid-cols-3">
            {rooms.map((s) => (
              <Link key={s.slug} href={`/stay/${s.slug}`} className="group flex flex-col bg-plaster">
                <div className="overflow-hidden">
                  <img src={s.photos[0]} alt={s.name} className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                </div>
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-3">
                    <span className="inline-block h-3 w-3 rounded-full" style={{ background: s.colour }} />
                    <span className="font-display text-[30px] group-hover:underline">{s.name}</span>
                  </div>
                  <p className="mt-3 text-[16px]">{s.line}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Honest note */}
      <section className="bg-cobalt text-plaster">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-24 md:grid-cols-12 md:px-10 md:py-32">
          <p className="kicker md:col-span-3">Before you book</p>
          <div className="md:col-span-8">
            <p className="font-display text-[30px] leading-[1.2] md:text-[44px]">
              It is an old Medina house. If you come with a magnifying glass, you will find fault.
            </p>
            <p className="mt-8 max-w-2xl text-[17px]">
              Stairs are steep, there is no lift, not every room has a window to the street, and in the hottest weeks the walls hold on to the damp. We would rather you knew now than found out later.
            </p>
            <Link href="/before-you-book" className="mt-10 inline-block bg-plaster px-7 py-3.5 text-[15px] text-ink hover:bg-saffron transition-colors">Read the honest notes</Link>
          </div>
        </div>
      </section>

      {/* Where */}
      <section className="bg-plaster">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-24 md:grid-cols-12 md:px-10 md:py-32">
          <p className="kicker md:col-span-3">Where</p>
          <div className="md:col-span-8">
            <p className="font-display text-[30px] leading-[1.2] md:text-[44px]">35 Derb Fhal Zefriti, Laksour, in the Medina of Marrakech.</p>
            <ul className="mt-8 grid gap-3 text-[17px] md:grid-cols-2">
              <li>Jemaa el-Fna: a few minutes on foot</li>
              <li>The Koutoubia: a short walk</li>
              <li>The souks: start at the end of the lane</li>
              <li>Airport: about 20 minutes by car; we can send a driver</li>
            </ul>
            <p className="mt-8 max-w-2xl text-[16px]">Cars can't reach the door. Once you've booked, Zahra sends you the way in, step by step, with photos.</p>
          </div>
        </div>
      </section>
    </>
  );
}
