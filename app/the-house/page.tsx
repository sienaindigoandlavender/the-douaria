import type { Metadata } from "next";
import PageHead, { NextPage } from "@/components/PageHead";

export const metadata: Metadata = {
  title: "The house",
  description: "A whole house in the Marrakech Medina, a lane away from Jemaa el-Fna: quiet rooms, a roof terrace, breakfast on the roof.",
};

const DAY = [
  { when: "Morning", what: "Light finds the roof first. Breakfast up there if you asked Zahra the night before, the city still yawning below you." },
  { when: "Afternoon", what: "Out into the souks, lost on purpose. Back through your own door with something you swore you wouldn't buy." },
  { when: "Dusk", what: "Up on the terrace as the call to prayer rolls from minaret to minaret across the rooftops." },
  { when: "Night", what: "The square for the smoke and the drums. Then home, and the door closes on all of it." },
];

export default function TheHousePage() {
  return (
    <>
      <PageHead
        kicker="The house"
        title={<>The frenzy when you want it. <em>The quiet when you don&apos;t.</em></>}
        photo="/photos/love-wide.webp"
        alt="Love, off the courtyard"
      />

      {/* The house */}
      <section className="bg-plaster">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-4 py-24 md:grid-cols-12 md:px-10 md:py-40">
          <p className="kicker uppercase md:col-span-3">Inside</p>
          <div className="md:col-span-9">
            <p className="font-display text-[30px] leading-[1.2] md:text-[46px]">
              Out there: drums, smoke from the grills, a thousand voices bargaining. <em>In here, white walls, lantern light, and the quiet you forgot you needed.</em>
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

      {/* A day at No. 35 */}
      <section className="bg-lime">
        <div className="mx-auto max-w-[1400px] px-4 py-24 md:px-10 md:py-36">
          <p className="kicker uppercase">A day at No. 35</p>
          <ol className="mt-12 grid gap-10 md:mt-24 md:grid-cols-4 md:gap-8">
            {DAY.map((d) => (
              <li key={d.when} className="border-t border-ink pt-5">
                <p className="font-display text-[30px] leading-none md:text-[34px]">
                  <em>{d.when}</em>
                </p>
                <p className="mt-4 text-[17px]">{d.what}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <NextPage href="/the-medina" kicker="Next" title={<>The Medina, <em>at the door</em></>} />
    </>
  );
}
