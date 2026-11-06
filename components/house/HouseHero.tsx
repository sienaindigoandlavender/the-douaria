import type { ReactNode } from "react";
import { HeroHour, HeroTint } from "./HeroLight";

/**
 * The opening of every guest page: the photo fills the screen, edge to edge,
 * and the page's name rests on it, set large. Still: no zoom, no movement.
 * A soft veil of evening at the foot of the photo keeps the words readable.
 */
export default function HouseHero({
  title,
  lede,
  image,
  alt,
  tone = "lime",
  light = false,
  living = false,
  children,
}: {
  title: string;
  lede?: string | null;
  image?: string | null;
  alt: string;
  tone?: "lime" | "night";
  /** A pale concept image (not a dark photo): ink words on the right, no evening veil. */
  light?: boolean;
  /** Home only: the photo takes on Marrakech's light at this hour, with one line about it. */
  living?: boolean;
  children?: ReactNode;
}) {
  const dark = !!image || tone === "night";
  return (
    <section
      className={`relative overflow-hidden min-h-[100svh] ${dark ? "night bg-night text-limewash" : "bg-limewash text-ink"}`}
    >
      {image && (
        <>
          {/* Whole photo, never cropped (Jacqueline, 6 Nov 2026): fitted inside the frame, centred both ways, on night. */}
          <img src={image} alt={alt} className="absolute inset-x-0 top-[72px] bottom-0 h-[calc(100%-72px)] w-full object-contain object-center" fetchPriority="high" />
          {living && !light && <HeroTint />}
          <div className="absolute inset-0 bg-gradient-to-t from-night/80 via-night/10 to-transparent" />
        </>
      )}
      <div className={`relative mx-auto max-w-[1500px] min-h-[100svh] px-5 md:px-10 lg:px-14 pt-28 pb-[max(3rem,8svh)] flex flex-col justify-end ${light ? "md:items-end md:text-right" : ""}`}>
        <h1 className="house font-light text-[clamp(3.2rem,9vw,9rem)] leading-[0.9] tracking-[-0.04em] max-w-[14ch]">{title}</h1>
        {lede && (
          <p className={`mt-7 max-w-[34ch] text-[clamp(1.15rem,1.5vw,1.4rem)] leading-relaxed ${dark ? "text-limewash" : "text-ink"}`}>
            {lede}
          </p>
        )}
        {living && dark && <HeroHour />}
        {children && <div className="mt-10">{children}</div>}
      </div>
    </section>
  );
}
