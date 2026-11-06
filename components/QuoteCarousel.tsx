"use client";

import { useState } from "react";

interface Testimonial {
  Quote: string;
  Guest_Name?: string;
}

/**
 * One guest's words at a time, set large. No autoplay, no motion of its own:
 * slim arrows step through by hand. Colours follow the section around it.
 */
export default function QuoteCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const total = testimonials.length;
  if (total === 0) return null;

  const current = testimonials[index];
  const go = (dir: number) => setIndex((i) => (i + dir + total) % total);

  return (
    <figure className="max-w-5xl">
      <blockquote
        key={index}
        className={`house italic font-light leading-[1.18] tracking-[-0.02em] [text-wrap:pretty] ${
          current.Quote.length > 200 ? "text-[clamp(1.35rem,2.5vw,2.25rem)]" : "text-[clamp(1.6rem,3.6vw,3.2rem)]"
        }`}
      >
        &ldquo;{current.Quote.trim().replace(/^[“"‘']+|[”"’']+$/g, "")}&rdquo;
      </blockquote>

      <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
        {current.Guest_Name && <figcaption className="text-lg">{current.Guest_Name}</figcaption>}

        {total > 1 && (
          <div className="flex items-center gap-1 ml-auto">
            <button onClick={() => go(-1)} aria-label="Previous review" className="h-12 w-12 flex items-center justify-center hover:bg-black/5 transition-colors">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
            </button>
            <span className="text-base tabular-nums px-2">
              {index + 1} of {total}
            </span>
            <button onClick={() => go(1)} aria-label="Next review" className="h-12 w-12 flex items-center justify-center hover:bg-black/5 transition-colors">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </button>
          </div>
        )}
      </div>
    </figure>
  );
}
