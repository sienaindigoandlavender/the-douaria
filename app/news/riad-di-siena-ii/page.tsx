import Link from "next/link";

export const metadata = { title: "Riad di Siena II opens at No. 35 Derb Fhal Zefriti" };

// The press release for Tripadvisor (6 Nov 2026), word for word from the PDF. Address and map included.
const LAT = 31.6272937;
const LNG = -7.9915523;
const D = 0.0022;
const OSM = `https://www.openstreetmap.org/export/embed.html?bbox=${LNG - D}%2C${LAT - D}%2C${LNG + D}%2C${LAT + D}&layer=mapnik&marker=${LAT}%2C${LNG}`;
const GMAPS = `https://www.google.com/maps/search/?api=1&query=${LAT}%2C${LNG}`;

export default function PressRelease() {
  return (
    <div className="bg-limewash text-ink min-h-screen">
      <article className="px-5 md:px-10 lg:px-14 pt-36 md:pt-44 pb-24 md:pb-32">
        <div className="mx-auto max-w-[1500px] grid md:grid-cols-12 gap-10">
          <div className="md:col-span-3">
            <p className="house italic text-bejmat text-xl mb-2">Press release</p>
            <p className="text-[1rem] mb-0">For immediate release<br />Marrakech, 6 November 2026</p>
          </div>
          <div className="md:col-span-8 md:col-start-5">
            <h1 className="house font-light text-[clamp(2.4rem,5vw,4.6rem)] leading-[1] tracking-[-0.035em]">
              Riad di Siena II opens in a newly renovated house at No. 35 Derb Fhal Zefriti
            </h1>
            <div className="mt-12 space-y-6 text-[1.2rem] leading-[1.75]">
              <p>
                From November 2026, Riad di Siena welcomes its guests in a different house, Riad di Siena II, at No. 35
                Derb Fhal Zefriti, a few doors from its former address at No. 37, in the Laksour quarter of the Marrakech
                medina, two minutes from Jemaa el-Fna.
              </p>
              <p>
                No. 35 is a traditional douaria, fully renovated. It has three guest rooms around a courtyard, named Love,
                Joy and Bliss, each with its own bathroom inside the room, heating and air conditioning, and a roof
                terrace. The rooms, layout, courtyard and terrace are all different: guests staying today find a
                different house from the one at No. 37.
              </p>
              <p>
                The welcome stays the same. Breakfast is made each morning by Zahra, who runs the house, with bread baked
                in the house and homemade jams.
              </p>
              <p>All listings have been updated to the new address.</p>
            </div>
          </div>
        </div>
      </article>

      <section className="bg-tadelakt px-5 md:px-10 lg:px-14 py-20 md:py-28">
        <div className="mx-auto max-w-[1500px]">
          <h2 className="house font-light text-[clamp(1.8rem,3.4vw,3rem)] leading-tight mb-10">The rooms at No. 35: Love, Joy and Bliss</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[["/photos/love.webp", "Love"], ["/photos/joy.webp", "Joy"], ["/photos/bliss.webp", "Bliss"]].map(([src, name]) => (
              <figure key={name}>
                <div className="relative aspect-[3/4] overflow-hidden bg-limewash">
                  <img src={src} alt={`${name}, at No. 35 Derb Fhal Zefriti`} draggable={false} className="absolute inset-0 h-full w-full object-cover select-none" />
                </div>
                <figcaption className="house italic text-[1.3rem] mt-3">{name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-straw px-5 md:px-10 lg:px-14 py-20 md:py-28">
        <div className="mx-auto max-w-[1500px] grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <h2 className="house font-light text-[clamp(1.8rem,3.4vw,3rem)] leading-tight">Address and map</h2>
            <p className="mt-6 text-[1.15rem] leading-[1.6] mb-2">Riad di Siena II<br />35 Derb Fhal Zefriti, Quartier Laksour<br />Medina, 40000 Marrakech, Morocco</p>
            <p className="text-[1rem]">{LAT}, {LNG} · <a href={GMAPS} className="link-house">Open in Google Maps</a></p>
            <p className="mt-8 text-[1rem]">Press contact: Jacqueline Ng, owner · <Link href="/contact" className="link-house">Contact</Link></p>
          </div>
          <div className="md:col-span-8">
            <div className="aspect-[4/3] w-full border border-ink">
              <iframe title="Map: 35 Derb Fhal Zefriti, Marrakech" src={OSM} className="h-full w-full" loading="lazy" />
            </div>
            <p className="mt-3 text-[13px]">Map © OpenStreetMap contributors</p>
          </div>
        </div>
      </section>
    </div>
  );
}
