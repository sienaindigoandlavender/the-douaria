import type { Metadata } from "next";
import HouseMap from "@/components/HouseMap";
import PageHead, { NextPage } from "@/components/PageHead";

export const metadata: Metadata = {
  title: "The Medina",
  description: "35 Derb Fhal Zefriti, Laksour: a lane in the Marrakech Medina, a five-minute stroll from Jemaa el-Fna.",
};

export default function TheMedinaPage() {
  return (
    <>
      <PageHead
        kicker="The Medina"
        title={<>Close to the frenzy, <em>never in it.</em></>}
      />

      {/* Where: the point of the house */}
      <section className="bg-plaster">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-4 pb-20 md:grid-cols-12 md:px-10 md:pb-28">
          <p className="kicker uppercase md:col-span-3">Laksour</p>
          <div className="md:col-span-9">
            <p className="max-w-2xl text-[18px]">Walk out of the door and the old city is at your feet. Jemaa el-Fna is a five-minute stroll, the Koutoubia&apos;s minaret is there to find your way home, and the souks, Le Jardin Secret and the Ben Youssef Madrasa are all within an easy wander.</p>
          </div>
        </div>
        <HouseMap />
        <div className="mx-auto max-w-[1400px] px-4 py-10 md:px-10">
          <p className="max-w-2xl font-display text-[24px] leading-snug md:text-[28px]">35 Derb Fhal Zefriti, Laksour, Medina, 40000 Marrakech, Morocco</p>
          <p className="mt-3 text-[15px]">
            31.6272937, -7.9915523 ·{" "}
            <a href="https://www.google.com/maps/search/?api=1&query=31.6272937%2C-7.9915523" className="underline underline-offset-4">Open in Google Maps</a>
          </p>
          <p className="mt-8 max-w-2xl text-[15px]">Cars can&apos;t reach the door, as everywhere in the Medina. Once you&apos;ve booked, Zahra sends you the way in, step by step. The airport is about 20 minutes by car; we can send a driver.</p>
        </div>
      </section>

      <NextPage href="/stay" kicker="Next" title={<>Stay, <em>the whole house</em></>} />
    </>
  );
}
