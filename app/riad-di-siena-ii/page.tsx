import type { Metadata } from "next";

// Riad di Siena II (Jacqueline, 6 Nov 2026): the name the house carries on Booking and Tripadvisor,
// served at ii.riaddisiena.com. Address, map and the move announcement. Not linked from the nav.
const LAT = 31.6272937;
const LNG = -7.9915523;
const ADDRESS = "35 Derb Fhal Zefriti, Laksour, Medina, 40000 Marrakech, Morocco";
const D = 0.0022;
const OSM = `https://www.openstreetmap.org/export/embed.html?bbox=${LNG - D}%2C${LAT - D}%2C${LNG + D}%2C${LAT + D}&layer=mapnik&marker=${LAT}%2C${LNG}`;
const GMAPS = `https://www.google.com/maps/search/?api=1&query=${LAT}%2C${LNG}`;

export const metadata: Metadata = {
  title: { absolute: "Riad di Siena II · 35 Derb Fhal Zefriti, Marrakech" },
  alternates: { canonical: "https://ii.riaddisiena.com/" },
  description: `Riad di Siena II, ${ADDRESS}. Three rooms around a courtyard, two minutes from Jemaa el-Fna.`,
};

export default function RiadDiSienaII() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: "Riad di Siena II",
    address: { "@type": "PostalAddress", streetAddress: "35 Derb Fhal Zefriti, Laksour", addressLocality: "Marrakech", postalCode: "40000", addressCountry: "MA" },
    geo: { "@type": "GeoCoordinates", latitude: LAT, longitude: LNG },
  };
  return (
    <main className="fixed inset-0 z-[1000] overflow-y-auto bg-plaster text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="mx-auto max-w-3xl px-4 py-24 md:px-10 md:py-32">
        <h1 className="font-display text-[44px] leading-[1.05] md:text-[64px]">Riad di Siena II</h1>
        <p className="mt-8 text-[20px] leading-[1.5]">{ADDRESS}</p>
        <p className="mt-3 text-[15px]">
          {LAT}, {LNG} ·{" "}
          <a href={GMAPS} className="underline underline-offset-4">Open in Google Maps</a>
        </p>
        <div className="mt-10 aspect-[4/3] w-full border border-ink">
          <iframe title="Map: Riad di Siena II, 35 Derb Fhal Zefriti" src={OSM} className="h-full w-full" loading="lazy" />
        </div>
        <p className="mt-3 text-[13px]">Map © OpenStreetMap contributors</p>

        <h2 className="mt-20 font-display text-[30px] leading-tight md:text-[36px]">A new house for Riad di Siena</h2>
        <p className="mt-3 text-[13px]">Marrakech, 6 November 2026</p>
        <div className="mt-6 space-y-5 text-[17px] leading-[1.65]">
          <p>From November 2026, Riad di Siena welcomes its guests in a different house: No. 35 Derb Fhal Zefriti, a few doors from its former address at No. 37, in the Laksour quarter of the Medina, two minutes from Jemaa el-Fna.</p>
          <p>No. 35 is a traditional douaria, fully renovated. It has three guest rooms around a courtyard, Love, Joy and Bliss, each with its own bathroom inside the room, heating and air conditioning, and a roof terrace. Guests staying today find a different house from the one at No. 37.</p>
          <p>The welcome stays the same. Breakfast is made each morning by Zahra, who runs the house, with bread baked in the house and homemade jams.</p>
        </div>
      </div>
    </main>
  );
}
