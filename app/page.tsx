import Link from "next/link";
import { STAYS, stayPrice } from "@/lib/stays";
import { getHouseTerms } from "@/lib/houseTerms";
import { cityTaxEur } from "@/lib/cityTax";
import BookButton from "@/components/BookButton";
import HouseMap from "@/components/HouseMap";
import { NEARBY } from "@/lib/places";

export const revalidate = 300;

// The sizzle pass (Jacqueline, 3 Nov 2026): the house leads, the three wools carry the colour.
// Love madder, Joy saffron, Bliss undyed grey, each room a full band of its own wool.
// Bands alternate so no two neighbours share a ground.
const WOOL: Record<string, { bg: string; text: string; rule: string }> = {
  love: { bg: "bg-madder", text: "text-plaster", rule: "border-plaster" },
  joy: { bg: "bg-saffron", text: "text-ink", rule: "border-ink" },
  bliss: { bg: "bg-wool", text: "text-ink", rule: "border-ink" },
};

const DAY = [
  { when: "Morning", what: "Light finds the roof first. Breakfast up there if you asked Zahra the night before, the city still yawning below you." },
  { when: "Afternoon", what: "Out into the souks, lost on purpose. Back through your own door with something you swore you wouldn't buy." },
  { when: "Dusk", what: "Up on the terrace as the call to prayer rolls from minaret to minaret across the rooftops." },
  { when: "Night", what: "The square for the smoke and the drums. Then home, and the door closes on all of it." },
];

export default async function Home() {
  const [terms, tax] = await Promise.all([getHouseTerms(), cityTaxEur()]);
  const house = STAYS[0];
  const rooms = STAYS.slice(1);
  const price = stayPrice(terms, house);

  return (
    <>
      {/* Hero: one photograph, the promise, and the facts at the foot */}
      <section className="relative h-[100svh] min-h-[620px] w-full overflow-hidden bg-ink text-plaster">
        <img src="/photos/bliss-wide.webp" alt="Bliss, the long room upstairs, under its brass lantern" className="hero-drift absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-ink/35" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1400px] px-4 pb-8 md:px-10 md:pb-10">
          <p className="rise kicker mb-5 uppercase">No. 35 · Laksour · Marrakech</p>
          <h1 className="rise rise-2 max-w-5xl font-display text-[52px] leading-[0.98] tracking-[-0.01em] md:text-[112px]">
            Close the door. <em className="text-saffron">The Medina waits outside.</em>
          </h1>
          <div className="rise rise-3 mt-10 grid gap-6 border-t border-plaster/60 pt-6 md:grid-cols-12 md:items-end">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-[15px] md:col-span-7 md:grid-cols-4">
              <li>A whole house</li>
              <li>Up to six guests</li>
              <li>Three rooms, three baths</li>
              <li>A roof terrace</li>
            </ul>
            <div className="flex flex-wrap items-center gap-6 md:col-span-5 md:justify-end">
              <p className="text-[15px]">
                <span className="font-display text-[30px]">€{price}</span> a night, the house
              </p>
              <BookButton
                id={house.id}
                name={house.bookingName}
                price={price}
                maxGuests={house.maxGuests}
                cityTax={tax}
                className="bg-plaster px-7 py-3.5 text-[15px] text-ink hover:bg-saffron transition-colors"
              />
            </div>
          </div>
        </div>
      </section>

      {/* The house */}
      <section id="house" className="scroll-mt-16 bg-plaster">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-4 py-24 md:grid-cols-12 md:px-10 md:py-40">
          <p className="kicker uppercase md:col-span-3">The house</p>
          <div className="md:col-span-9">
            <p className="font-display text-[34px] leading-[1.12] md:text-[60px]">
              Out there: drums, smoke from the grills, a thousand voices bargaining. <em className="text-madder">In here, white walls, lantern light, and the quiet you forgot you needed.</em>
            </p>
            <div className="mt-14 grid gap-8 text-[17px] md:grid-cols-2 md:pe-[12%]">
              <p>
                The Douaria sits on a lane in Laksour, close enough to walk to Jemaa el-Fna when the lights come on, far enough that the noise stops at the corner. Go out into the frenzy when you want it. Come back to a door that closes behind you.
              </p>
              <p>
                At dusk, climb to the roof terrace and listen to the call to prayer travel from minaret to minaret across the Medina. Zahra looks after the house: ask her the day before, and breakfast comes up to the roof or a Moroccan dinner is cooked at home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Three rooms, three wools: each a full band of its own colour */}
      <section id="rooms" className="scroll-mt-16 grid md:grid-cols-3">
        {rooms.map((s, i) => {
          const w = WOOL[s.slug];
          return (
            <Link key={s.slug} href={`/stay/${s.slug}`} className={`group flex flex-col ${w.bg} ${w.text}`}>
              <div className="overflow-hidden">
                <img src={s.photos[0]} alt={s.name} className="aspect-[3/4] w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]" />
              </div>
              <div className="flex flex-1 flex-col p-6 md:p-10">
                <p className="kicker uppercase">0{i + 1} · {s.facts[1]}</p>
                <h2 className="mt-3 font-display text-[64px] leading-[0.9] md:text-[88px]">
                  <em>{s.name}</em>
                </h2>
                <p className="mt-5 flex-1 text-[17px]">{s.line}</p>
                <p className={`mt-8 flex items-center justify-between border-t ${w.rule} pt-4 text-[15px]`}>
                  <span>Inside the room</span>
                  <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
                </p>
              </div>
            </Link>
          );
        })}
      </section>

      {/* A day at No. 35 */}
      <section className="bg-lime">
        <div className="mx-auto max-w-[1400px] px-4 py-24 md:px-10 md:py-36">
          <div className="grid gap-6 md:grid-cols-12 md:items-end">
            <p className="kicker uppercase md:col-span-3">A day at No. 35</p>
            <h2 className="font-display text-[40px] leading-[1.02] md:col-span-9 md:text-[72px]">
              The frenzy when you want it. <em className="text-cobalt">The quiet when you don&apos;t.</em>
            </h2>
          </div>
          <ol className="mt-16 grid gap-10 md:mt-24 md:grid-cols-4 md:gap-8">
            {DAY.map((d, i) => (
              <li key={d.when} className="border-t border-ink pt-5">
                <p className="kicker">0{i + 1}</p>
                <p className="mt-3 font-display text-[38px] leading-none md:text-[44px]">
                  <em>{d.when}</em>
                </p>
                <p className="mt-4 text-[17px]">{d.what}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Where: the point of the house */}
      <section id="where" className="scroll-mt-16 bg-plaster">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-4 pt-24 pb-16 md:grid-cols-12 md:px-10 md:pt-36">
          <p className="kicker uppercase md:col-span-3">Where</p>
          <div className="md:col-span-9">
            <p className="font-display text-[40px] leading-[1.02] md:text-[72px]">
              Close to the frenzy, <em className="text-madder">never in it.</em>
            </p>
            <p className="mt-6 max-w-2xl text-[17px]">35 Derb Fhal Zefriti, Laksour. Walk out of the door and the whole of the old city is at your feet: the square for the evening, the souks for the morning, the Koutoubia&apos;s minaret to find your way home.</p>
          </div>
        </div>
        <div className="mx-auto max-w-[1400px] px-4 md:px-10">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
            {NEARBY.map((p) => (
              <li key={p.name} className="border-t border-ink pt-4">
                <p className="font-display text-[56px] leading-none md:text-[80px]">{p.walk.replace("about ", "").replace(" minutes", "")}<span className="ms-2 text-[20px] md:text-[24px]">min</span></p>
                <p className="mt-3 text-[16px]">{p.name}, on foot</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-16"><HouseMap /></div>
        <div className="mx-auto max-w-[1400px] px-4 py-10 md:px-10">
          <p className="max-w-2xl text-[15px]">Cars can&apos;t reach the door, as everywhere in the Medina. Once you&apos;ve booked, Zahra sends you the way in, step by step. The airport is about 20 minutes by car; we can send a driver.</p>
        </div>
      </section>

      {/* The whole house: the one thing to book */}
      <section id="stay" className="scroll-mt-16 bg-ink text-plaster">
        <div className="mx-auto grid max-w-[1400px] md:grid-cols-2">
          <img src="/photos/love-wide.webp" alt="Love, off the courtyard" className="aspect-[4/3] h-full w-full object-cover" />
          <div className="flex flex-col justify-center gap-10 px-4 py-14 md:px-14 md:py-20">
            <div>
              <p className="kicker uppercase">Stay</p>
              <h2 className="mt-4 font-display text-[44px] leading-[1] md:text-[68px]">
                The whole house, <em className="text-saffron">and nobody else.</em>
              </h2>
              <p className="mt-6 text-[17px]">{house.line}</p>
            </div>
            <ul className="grid grid-cols-1 gap-y-2 border-t border-plaster/60 pt-6 text-[16px] sm:grid-cols-2 sm:gap-x-6">
              {house.facts.map((f) => <li key={f}>{f}</li>)}
            </ul>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <p>
                <span className="block font-display text-[64px] leading-none md:text-[84px]">€{price}</span>
                <span className="mt-2 block text-[15px]">a night, the whole house, breakfast on request</span>
              </p>
              <BookButton
                id={house.id}
                name={house.bookingName}
                price={price}
                maxGuests={house.maxGuests}
                cityTax={tax}
                className="bg-saffron px-8 py-4 text-[16px] text-ink hover:bg-plaster transition-colors"
              />
            </div>
            <p className="text-[14px]">City tax (€{tax.toFixed(2)} a person a night) is added at checkout, as the city requires.</p>
          </div>
        </div>
      </section>

      {/* Honest note */}
      <section className="bg-cobalt text-plaster">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-24 md:grid-cols-12 md:px-10 md:py-36">
          <p className="kicker uppercase md:col-span-3">Before you book</p>
          <div className="md:col-span-9">
            <p className="font-display text-[34px] leading-[1.12] md:text-[56px]">
              It is an old Medina house. <em>If you come with a magnifying glass, you will find fault.</em>
            </p>
            <p className="mt-8 max-w-2xl text-[17px]">
              Stairs are steep, there is no lift, not every room has a window to the street, and in the hottest weeks the walls hold on to the damp. We would rather you knew now than found out later.
            </p>
            <Link href="/before-you-book" className="mt-10 inline-block bg-plaster px-7 py-3.5 text-[15px] text-ink hover:bg-saffron transition-colors">Read the honest notes</Link>
          </div>
        </div>
      </section>

      {/* Last word: one more photograph, one button */}
      <section className="relative flex min-h-[86svh] items-end overflow-hidden bg-ink text-plaster">
        <img src="/photos/joy-wide.webp" alt="Joy, in saffron wool" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent" />
        <div className="relative mx-auto w-full max-w-[1400px] px-4 pb-14 md:px-10 md:pb-20">
          <p className="kicker uppercase">Your dates</p>
          <h2 className="mt-4 max-w-4xl font-display text-[48px] leading-[0.98] md:text-[100px]">
            A house in the Medina, <em className="text-saffron">yours for a few days.</em>
          </h2>
          <div className="mt-10">
            <BookButton
              id={house.id}
              name={house.bookingName}
              price={price}
              maxGuests={house.maxGuests}
              cityTax={tax}
              className="bg-plaster px-8 py-4 text-[16px] text-ink hover:bg-saffron transition-colors"
            />
          </div>
        </div>
      </section>
    </>
  );
}
