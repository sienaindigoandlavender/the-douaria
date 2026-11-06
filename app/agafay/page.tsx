import Link from "next/link";
import HouseHero from "@/components/house/HouseHero";

// The other desert: an Agafay evening (Jacqueline, 31 Oct 2026). Linked from the pre-arrival message.
// Car from our door, a camel at sunset, dinner at a desert camp (never named).
// Cost for two: car 700 + dinner 2 × 500 + camel 2 × 300 = 2,300 DH. Price below, per person, two sharing.

const PRICE_PP = 130;

const WA =
  "https://wa.me/212619112008?text=" + encodeURIComponent("Hello Zahra, we would like the evening in Agafay. Our date:");

const IMAGE = "https://res.cloudinary.com/dhv1s6fgm/image/upload/v1773810135/agafay-day-tri_yrkxhk.png";

const MOMENTS = [
  { when: "Late afternoon", what: "The car collects you at our door. Forty minutes, and the city gives way to bare hills the colour of a lion's back." },
  { when: "Sunset", what: "A camel walk over the stone desert while the Atlas turns pink, then violet, then gone." },
  { when: "Nightfall", what: "Dinner at a camp in the hills, lanterns on, the sky filling with stars. Then the drive home, back home by late evening." },
];

export default function AgafayPage() {
  return (
    <div className="bg-limewash text-ink min-h-screen">
      <HouseHero
        title="The other desert"
        lede="Agafay at sunset, a camel, and dinner under the Atlas. Back in your bed tonight."
        image={IMAGE}
        alt="The stone desert of Agafay at sunset, with the Atlas behind"
      />

      <section className="bg-limewash px-5 md:px-10 lg:px-14 py-24 md:py-32">
        <p className="house mx-auto max-w-[1500px] font-light text-[clamp(1.7rem,3.4vw,3.2rem)] leading-[1.15] tracking-[-0.02em] [text-wrap:pretty] md:pr-[16%]">
          No sand here: Agafay is a desert of stone, forty minutes from the medina, with the High Atlas laid along the horizon. It is the Sahara's quieter cousin, for an evening rather than three days.
        </p>
      </section>

      {/* The evening as one sky: afternoon light on the left, dusk on the right.
          Each moment carries its own sky mark (sun high, sun on the horizon, moon and stars). */}
      <section
        className="px-5 md:px-10 lg:px-14 py-20 md:py-28 bg-[#F1E2AE] md:bg-[linear-gradient(90deg,#F1E2AE_0%,#EDCB8C_30%,#C9824F_55%,#7A3E28_78%,#3A2520_100%)]"
      >
        <ol className="mx-auto max-w-[1500px] grid md:grid-cols-3 gap-0 md:gap-12">
          {MOMENTS.map((m, i) => (
            <li
              key={m.when}
              className={`py-12 md:py-0 -mx-5 px-5 md:mx-0 md:px-0 ${
                ["bg-[#F1E2AE]", "bg-[#D99A63]", "bg-[#3A2520]"][i]
              } md:bg-transparent ${i === 2 ? "text-limewash" : "text-ink"}`}
            >
              <Sky stage={i} />
              <p className={`mt-8 text-[13px] tracking-[0.18em] uppercase`}>0{i + 1}</p>
              <h2 className="mt-3 house italic font-light text-[clamp(2.4rem,4vw,3.8rem)] leading-[1] tracking-[-0.02em]">{m.when}</h2>
              <p className="mt-6 text-[1.15rem] md:text-[1.2rem] leading-[1.7] max-w-sm">{m.what}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="night bg-night text-limewash px-5 md:px-10 lg:px-14 py-24 md:py-32">
        <div className="mx-auto max-w-[1500px] grid md:grid-cols-12 gap-10 items-end">
          <div className="md:col-span-7">
            <h2 className="house font-light text-[clamp(2.6rem,6vw,5.6rem)] leading-[0.98] tracking-[-0.03em]">€{PRICE_PP} per person</h2>
            <p className="mt-6 text-[1.15rem] md:text-[1.25rem] leading-[1.7] text-limewash">
              Included: a private car and driver from our door and back, the camel at sunset, dinner at the camp.
            </p>
            <p className="mt-3 text-[15px] leading-[1.6] text-limewash">Not included: drinks and tips.</p>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <a href={WA} target="_blank" rel="noopener noreferrer" className="block w-full bg-door text-ink text-center py-5 text-[18px] hover:bg-[#F1E2AE] transition-colors">
              Reserve with Zahra
            </a>
            <p className="mt-4 text-[15px] text-limewash">
              Longer days out: <Link href="/day-trips" className="underline">day trips from our door</Link>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

/** A small horizon with the sun high (0), the sun going down (1), the moon and stars (2). */
function Sky({ stage }: { stage: number }) {
  const ink = stage === 2 ? "#F8F4EE" : "#2a2520";
  return (
    <svg viewBox="0 0 240 90" className="w-full max-w-[260px] h-auto" aria-hidden>
      <line x1="0" y1="70" x2="240" y2="70" stroke={ink} strokeWidth="1" />
      {stage === 0 && <circle cx="150" cy="26" r="15" fill="#F8F4EE" stroke={ink} strokeWidth="1" />}
      {stage === 1 && (
        <>
          <clipPath id="above">
            <rect x="0" y="0" width="240" height="70" />
          </clipPath>
          <circle cx="120" cy="70" r="22" fill="#9A5236" clipPath="url(#above)" />
          {[0, 1, 2].map((k) => (
            <line key={k} x1="80" x2="160" y1={78 + k * 5} y2={78 + k * 5} stroke={ink} strokeWidth="1" strokeDasharray="4 6" opacity={0.6} />
          ))}
        </>
      )}
      {stage === 2 && (
        <>
          <path d="M168 14a17 17 0 1 0 0 34a13 13 0 1 1 0-34z" fill="#EDCB8C" />
          {[
            [40, 20],
            [78, 40],
            [110, 14],
            [206, 32],
            [226, 12],
            [140, 50],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" fill="#F8F4EE" />
          ))}
        </>
      )}
    </svg>
  );
}
