"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export type WalkItem = { href?: string; image?: string | null; title?: string; alt?: string; sub?: string | null };

/**
 * A walk through: places side by side in one line you move along with slim
 * arrows (or a swipe). No scrollbar. One size, one shape, one top line:
 * calm and orderly (the staggered version read as chaotic). Photos are still.
 */
const SHAPE = "w-[62vw] sm:w-[38vw] md:w-[24vw] lg:w-[19vw]";
const FRAME = "plaster aspect-[4/5]";

export default function Walk({ items, tone = "lime" }: { items: WalkItem[]; tone?: "lime" | "night" | "clay" }) {
  const track = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const step = (dir: number) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.7, behavior: "smooth" });
  };

  const night = tone === "night" || tone === "clay";
  const arrow = `h-12 w-12 flex items-center justify-center transition-colors disabled:opacity-25 ${
    night ? "text-limewash hover:bg-white/10" : "text-ink hover:bg-tadelakt"
  }`;

  return (
    <div>
      <div
        ref={track}
        onScroll={update}
        className="scrollbar-hide flex gap-5 md:gap-8 overflow-x-auto snap-x snap-mandatory scroll-px-5 md:scroll-px-10 lg:scroll-px-14 px-5 md:px-10 lg:px-14 pb-2 items-start"
      >
        {items.map((it, i) => {
          const inner = (
            <>
              <div className={`${FRAME} bg-tadelakt`}>
                {it.image && (
                  <img
                    src={it.image}
                    alt={it.alt || it.title || ""}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
              </div>
              {it.title && (
                <h3 className={`house font-normal mt-5 text-[clamp(1.1rem,1.3vw,1.35rem)] leading-tight tracking-[-0.02em] ${night ? "group-hover:underline underline-offset-4" : "group-hover:text-bejmat"} transition-colors`}>
                  {it.title}
                </h3>
              )}
              {it.sub && <p className={`mt-1 mb-0 text-base leading-snug ${night ? "text-limewash" : "text-ink"}`}>{it.sub}</p>}
            </>
          );
          const cls = `group shrink-0 snap-start ${SHAPE}`;
          return it.href ? (
            <Link key={i} href={it.href} className={cls}>{inner}</Link>
          ) : (
            <div key={i} className={cls}>{inner}</div>
          );
        })}
        <div className="shrink-0 w-1" aria-hidden="true" />
      </div>

      {items.length > 2 && (
        <div className="mt-6 flex gap-2 px-5 md:px-10 lg:px-14">
          <button type="button" className={arrow} onClick={() => step(-1)} disabled={edge.start} aria-label="Back">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
          </button>
          <button type="button" className={arrow} onClick={() => step(1)} disabled={edge.end} aria-label="Further">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </button>
        </div>
      )}
    </div>
  );
}
