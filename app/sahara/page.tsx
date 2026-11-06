export const dynamic = "force-dynamic";
import Link from "next/link";
import { getHero, getList } from "@/lib/data";
import HouseHero from "@/components/house/HouseHero";

// Three days to the Sahara, from our door (Jacqueline, 31 Oct 2026).
// Linked from the message guests get right after they book. One trip, one price, one button:
// nothing to choose. A private car from the riad, run by the house's own driver.
// Night one at a 500-year-old kasbah (not ours; never named on the page, Jacqueline 31 Oct 2026), night two in the desert camp (dinners and the camel included there).
// Stands on its own: no link to Slow Morocco's journeys.
// Design (31 Oct 2026): an editorial spread, not a brochure. The route drawn as a line,
// each day opened by a large numeral, the photographs given room, colour bands alternating.

/** Per person, two sharing a car and a room (Jacqueline sets it). */
const PRICE_PP = 450;

const WHATSAPP =
  "https://wa.me/212619112008?text=" +
  encodeURIComponent("Hello Zahra, we would like the three days to the Sahara. Our dates:");

const AGAFAY_IMG = "https://res.cloudinary.com/dhv1s6fgm/image/upload/v1773810135/agafay-day-tri_yrkxhk.png";
const DAY_TRIPS_IMG = "https://res.cloudinary.com/dhv1s6fgm/image/upload/v1773810350/mountains_day_trip_dxewot.png";

const img = (x: any) => (x?.Image_URL as string) || "";

const ROUTE: { place: string; note: string; night?: string }[] = [
  { place: "Marrakech", note: "Our door, after breakfast" },
  { place: "Tizi n'Tichka", note: "2,260 m, the High Atlas" },
  { place: "Aït Benhaddou", note: "The red ksar" },
  { place: "The kasbah", note: "500 years old, first night", night: "Night 1" },
  { place: "Todra", note: "The gorge" },
  { place: "Erg Chebbi", note: "A camp far from the tourist ones", night: "Night 2" },
];

export default async function SaharaPage() {
  const [desertHero, kasbahHero, desertGallery, kasbahGallery] = await Promise.all([
    getHero("desert_hero"),
    getHero("kasbah_hero"),
    getList("desert_gallery"),
    getList("kasbah_gallery"),
  ]);

  const dg = (desertGallery || []).map(img).filter(Boolean);
  const kg = (kasbahGallery || []).map(img).filter(Boolean);
  const hero = img(desertHero);
  const kasbah = img(kasbahHero) || kg[0] || "";
  const gallery = [kg[1], dg[3], kg[2], dg[4]].filter(Boolean).slice(0, 3);

  const pad = "px-5 md:px-10 lg:px-14";
  const wrap = "mx-auto max-w-[1500px]";
  const numeral = "house font-light text-[clamp(6rem,16vw,15rem)] leading-[0.8] tracking-[-0.05em] text-bejmat";
  const dayTitle = "house italic font-light text-[clamp(2.4rem,5vw,4.6rem)] leading-[0.98] tracking-[-0.025em] text-ink";
  const body = "text-[1.15rem] md:text-[1.25rem] leading-[1.75] text-ink";
  const kicker = "text-[13px] tracking-[0.18em] uppercase text-ink";

  return (
    <div className="bg-limewash text-ink min-h-screen">
      <HouseHero
        title="Three days to the Sahara"
        lede="After breakfast, the car is at our door. Tonight a kasbah, tomorrow the dunes."
        image={hero}
        alt="The dunes of Erg Chebbi in the Moroccan Sahara"
      />

      {/* The promise, then the route drawn as a line */}
      <section className={`bg-limewash ${pad} py-20 md:py-32`}>
        <div className={wrap}>
          <div className="grid md:grid-cols-12 gap-10 md:gap-14 items-end">
            <p className="md:col-span-7 house font-light text-[clamp(2.2rem,4.6vw,4.4rem)] leading-[1.02] tracking-[-0.03em] text-ink">
              Three days, one car, <span className="italic text-bejmat">nobody else.</span>
            </p>
            <dl className="md:col-span-4 md:col-start-9 grid grid-cols-3 gap-6 border-t border-ink pt-5">
              {[
                ["3", "days"],
                ["2", "nights"],
                ["1", "driver, yours"],
              ].map(([k, v]) => (
                <div key={v}>
                  <dt className="house font-light text-[2.6rem] leading-none text-ink">{k}</dt>
                  <dd className="mt-2 text-[15px] leading-snug text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <ol className="mt-20 md:mt-28 relative grid gap-8 md:gap-0 md:grid-cols-6">
            <span aria-hidden className="hidden md:block absolute left-0 right-0 top-[7px] h-px bg-ink" />
            <span aria-hidden className="md:hidden absolute top-0 bottom-0 left-[7px] w-px bg-ink" />
            {ROUTE.map((r) => (
              <li key={r.place} className="relative ps-9 md:ps-0 md:pe-6">
                <span
                  aria-hidden
                  className={`absolute left-0 top-0 md:static block h-[15px] w-[15px] rounded-full border border-ink ${r.night ? "bg-bejmat border-bejmat" : "bg-limewash"}`}
                />
                <p className="md:mt-6 house text-[1.45rem] leading-tight text-ink">{r.place}</p>
                <p className="mt-1 text-[15px] leading-snug text-ink">{r.note}</p>
                {r.night && <p className={`mt-2 ${kicker} text-bejmat`}>{r.night}</p>}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Day 1: the full-width photograph, then the words in two columns */}
      <section className={`bg-tadelakt ${pad} py-20 md:py-32`}>
        <div className={wrap}>
          <div className="flex items-end justify-between gap-6">
            <span className={numeral}>01</span>
            <p className={`${kicker} pb-3`}>The mountains, then the red earth</p>
          </div>
          {kasbah && (
            <img src={kasbah} alt="A 500-year-old kasbah in the Moroccan south" loading="lazy" draggable={false} className="mt-8 w-full aspect-[16/9] md:aspect-[21/9] object-cover select-none" />
          )}
          <div className="mt-10 md:mt-14 grid md:grid-cols-12 gap-8 md:gap-14">
            <h2 className={`md:col-span-5 ${dayTitle}`}>Over the mountains</h2>
            <p className={`md:col-span-6 md:col-start-7 ${body}`}>
              The city falls away behind you. The road coils up into the High Atlas, the air turns thin and cold, and somewhere near the top you notice you
              have stopped talking. Then the other side: red earth, and Aït Benhaddou glowing as if it grew out of the hill. By dusk you are inside walls
              that have stood for five hundred years, warm bread on the table, the hush of the south settling around you.
            </p>
          </div>
        </div>
      </section>

      {/* Day 2: a tall photograph and a small one, the words set against them */}
      <section className={`bg-straw ${pad} py-20 md:py-32`}>
        <div className={`${wrap} grid md:grid-cols-12 gap-10 md:gap-14 items-start`}>
          <div className="md:col-span-6 relative">
            {(dg[0] || hero) && (
              <img src={dg[0] || hero} alt="Camels on the dunes of Erg Chebbi at sunset" loading="lazy" draggable={false} className="w-full aspect-[4/5] object-cover select-none" />
            )}
            {dg[1] && (
              <img src={dg[1]} alt="The desert camp at dusk" loading="lazy" draggable={false} className="hidden md:block absolute -right-14 -bottom-14 w-[46%] aspect-square object-cover select-none border-[10px] border-straw" />
            )}
          </div>
          <div className="md:col-span-5 md:col-start-8 md:pt-16">
            <span className={numeral}>02</span>
            <p className={`mt-6 ${kicker}`}>The gorge, then the dunes</p>
            <h2 className={`mt-4 ${dayTitle}`}>Into the sand</h2>
            <p className={`mt-8 ${body}`}>
              The gorge closes in until the sky is a blue ribbon far above. Then the land empties, and empties again, until the dunes rise out of nowhere,
              apricot and rose in the late light. You ride out on a camel, far from the busy camps, until all you hear is its soft step and your own breath.
              Supper by the fire. Then the stars, so many and so close they make you laugh.
            </p>
          </div>
        </div>
      </section>

      {/* Day 3: a quiet column of words beside the sunrise */}
      <section className={`bg-limewash ${pad} py-20 md:py-32`}>
        <div className={`${wrap} grid md:grid-cols-12 gap-10 md:gap-14 items-center`}>
          <div className="md:col-span-5 md:order-1 order-2">
            <span className={numeral}>03</span>
            <p className={`mt-6 ${kicker}`}>Sunrise, then home</p>
            <h2 className={`mt-4 ${dayTitle}`}>First light</h2>
            <p className={`mt-8 ${body}`}>
              You wake in the dark and climb a dune barefoot, the sand still cold. Nobody speaks. The sky turns violet, then gold, and the dunes appear around
              you one by one. It is the kind of quiet you carry home, and for days afterwards something in you moves a little slower.
            </p>
          </div>
          {(dg[2] || hero) && (
            <img
              src={dg[2] || hero}
              alt="Sunrise over the Sahara dunes"
              loading="lazy"
              draggable={false}
              className="md:col-span-7 md:order-2 order-1 w-full aspect-[4/3] object-cover select-none"
            />
          )}
        </div>
      </section>

      {/* Three more photographs, staggered */}
      {gallery.length === 3 && (
        <section className={`bg-tadelakt ${pad} py-16 md:py-24`}>
          <div className={`${wrap} grid grid-cols-2 md:grid-cols-12 gap-4 md:gap-6 items-start`}>
            <img src={gallery[0]} alt="" loading="lazy" draggable={false} className="col-span-1 md:col-span-4 w-full aspect-[3/4] object-cover select-none" />
            <img src={gallery[1]} alt="" loading="lazy" draggable={false} className="col-span-1 md:col-span-4 md:mt-20 w-full aspect-[3/4] object-cover select-none" />
            <img src={gallery[2]} alt="" loading="lazy" draggable={false} className="col-span-2 md:col-span-4 md:mt-8 w-full aspect-[4/3] md:aspect-[3/4] object-cover select-none" />
          </div>
        </section>
      )}

      {/* The price, what it covers, one button */}
      <section className={`night bg-night text-limewash ${pad} py-24 md:py-36`}>
        <div className={`${wrap} grid md:grid-cols-12 gap-12 md:gap-14 items-end`}>
          <div className="md:col-span-6">
            <p className={`${kicker} text-limewash`}>Per person</p>
            <h2 className="mt-4 house font-light text-[clamp(4rem,10vw,9rem)] leading-[0.85] tracking-[-0.04em]">€{PRICE_PP}</h2>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <dl className="grid grid-cols-[auto_1fr] gap-x-8 text-[1.05rem] leading-relaxed">
              <dt className={`${kicker} text-limewash pt-1 border-t border-limewash/40 py-4`}>Included</dt>
              <dd className="border-t border-limewash/40 py-4 text-limewash">Car and driver from our door, two nights, dinners, breakfasts, the camel.</dd>
              <dt className={`${kicker} text-limewash pt-1 border-t border-limewash/40 py-4`}>Not included</dt>
              <dd className="border-t border-limewash/40 py-4 text-limewash">Lunches and entry fees, such as the Atlas Studios.</dd>
            </dl>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 block w-full bg-door text-ink text-center py-5 text-[18px] hover:bg-[#F1E2AE] transition-colors"
            >
              Reserve with Zahra
            </a>
            <p className="mt-4 text-[15px] text-limewash">For two travelling together. Alone, or more of you? Tell Zahra and she will give you your price.</p>
          </div>
        </div>
      </section>

      {/* Shorter days out: two full-bleed photographs, the words laid over them */}
      <section className="bg-limewash">
        <div className={`${pad} pt-20 md:pt-28 pb-10 md:pb-14`}>
          <div className={`${wrap} flex flex-col md:flex-row md:items-end md:justify-between gap-4`}>
            <h2 className="house font-light text-[clamp(2.2rem,4.6vw,4.4rem)] leading-[1.02] tracking-[-0.03em] text-ink">
              Not three days? <span className="italic text-bejmat">Then one.</span>
            </h2>
            <p className="text-[1.1rem] text-ink md:max-w-sm md:text-end">Two shorter ways out of the city, from the same door, with the same driver.</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2">
          {[
            {
              href: "/agafay",
              img: AGAFAY_IMG,
              alt: "The stony desert of Agafay at sunset",
              kick: "An evening",
              title: "The other desert",
              line: "Agafay at sunset, a camel, dinner under the Atlas.",
              price: "€130 per person",
            },
            {
              href: "/day-trips",
              img: DAY_TRIPS_IMG,
              alt: "A road through the Atlas mountains",
              kick: "A day",
              title: "Day trips from our door",
              line: "The Atlas, Essaouira, the Ouzoud falls, Aït Benhaddou.",
              price: "From €100 per car",
            },
          ].map((c) => (
            <Link key={c.href} href={c.href} className="group relative block overflow-hidden min-h-[70vh] md:min-h-[86vh]">
              <img
                src={c.img}
                alt={c.alt}
                loading="lazy"
                draggable={false}
                className="absolute inset-0 w-full h-full object-cover select-none transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
              />
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
