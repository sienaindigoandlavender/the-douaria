"use client";

import { useEffect, useState } from "react";
import { lightQuality, sunAltitude } from "@/lib/solar";

/**
 * The home photo takes on the light Marrakech has right now (Jacqueline, 21 Oct 2026,
 * same as Slow Morocco's living hero): a tint over the photo and one quiet line under
 * the welcome. Computed from the sun, no API. Renders nothing until mounted so the
 * server and the browser agree.
 */
const MARRAKECH = { lat: 31.6295, lon: -7.9811 };

type Q = ReturnType<typeof lightQuality>;

const LIGHT: Record<Q, { tint: string; words: string }> = {
  dark: { tint: "bg-[#0b1430]/55", words: "Night in the medina. The house is quiet." },
  twilight: { tint: "bg-[#3a2a4f]/35", words: "Dusk. The call to prayer drifts over the rooftops." },
  golden: { tint: "bg-[#9A5236]/20", words: "Golden hour. The walls turn the colour of honey." },
  low: { tint: "bg-[#8a5a2b]/10", words: "Soft light in the courtyard." },
  high: { tint: "bg-transparent", words: "Bright day outside. Cool behind the old walls." },
  overhead: { tint: "bg-[#f5e6c8]/10", words: "Midday sun. Cool behind the old walls." },
};

function useLight(): Q | null {
  const [q, setQ] = useState<Q | null>(null);
  useEffect(() => {
    const tick = () => setQ(lightQuality(sunAltitude(new Date(), MARRAKECH.lat, MARRAKECH.lon)));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);
  return q;
}

/** The tint over the photo. Place it right after the image, under the evening veil. */
export function HeroTint() {
  const q = useLight();
  return <div aria-hidden className={`absolute inset-0 mix-blend-multiply transition-colors duration-[3000ms] ${q ? LIGHT[q].tint : ""}`} />;
}

/** One line: what the light is doing in Marrakech now. */
export function HeroHour() {
  const q = useLight();
  return (
    <p className={`mt-6 text-[clamp(1rem,1.2vw,1.15rem)] text-limewash transition-opacity duration-1000 ${q ? "opacity-100" : "opacity-0"}`}>
      {q ? LIGHT[q].words : " "}
    </p>
  );
}
