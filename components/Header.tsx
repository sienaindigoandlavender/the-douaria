"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Riad di Siena's header, word for word in shape (Jacqueline, 6 Nov 2026): burger and the stacked
// name on the left, "Stay with us" on the right, the full-screen menu that unrolls from the top.
const primary = [
  { href: "/the-house", label: "The House" },
  { href: "/rooms", label: "Rooms" },
  { href: "/amenities", label: "Amenities" },
  { href: "/the-medina", label: "The Medina" },
  { href: "/dinners", label: "Dinners" },
  { href: "/sahara", label: "The Sahara" },
  { href: "/day-trips", label: "Day Trips" },
  { href: "/philosophy", label: "Philosophy" },
];
const secondary = [
  { href: "/contact", label: "Contact" },
  { href: "/before-you-book", label: "Before You Book" },
  { href: "/house-rules", label: "House Rules" },
  { href: "/booking-conditions", label: "Booking Conditions" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const path = usePathname();
  useEffect(() => setMenuOpen(false), [path]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-sand/95 backdrop-blur-sm text-ink">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="relative z-[60] w-8 h-8 flex flex-col items-start justify-center gap-[6px] group"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
              >
                <span className={`block h-[1.5px] bg-ink transition-all duration-500 origin-left ${menuOpen ? "w-6 rotate-[40deg] translate-y-[0.5px]" : "w-7 group-hover:w-6"}`} />
                <span className={`block h-[1.5px] bg-ink transition-all duration-500 origin-left ${menuOpen ? "w-6 rotate-[-40deg] translate-y-[-0.5px]" : "w-5 group-hover:w-6"}`} />
              </button>
              <Link href="/" onClick={() => setMenuOpen(false)} className="relative z-[60] flex flex-col items-start leading-tight">
                <span className="text-sm tracking-[0.3em] font-light">THE</span>
                <span className="text-sm tracking-[0.3em] font-light">DOUARIA</span>
              </Link>
            </div>
            <Link
              href="/rooms"
              className="text-xs tracking-widest border border-ink px-6 py-2 hover:bg-ink hover:text-sand transition-colors"
            >
              STAY WITH US
            </Link>
          </div>
        </div>
      </header>

      <div className={`fixed inset-0 z-40 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className={`absolute inset-0 bg-[#c8c4b8] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] origin-top ${menuOpen ? "scale-y-100" : "scale-y-0"}`} />
        <div className={`relative z-10 h-full flex flex-col justify-between px-6 md:px-10 lg:px-14 pt-24 md:pt-28 pb-8 transition-opacity duration-500 delay-200 ${menuOpen ? "opacity-100" : "opacity-0"}`}>
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
            <nav className="flex flex-col max-w-7xl mx-auto w-full">
              {primary.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="text-xs tracking-[0.18em] uppercase text-[#1C1917] hover:text-[#9A5236] transition-colors py-1.5">
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col mt-8">
                {secondary.map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="text-[11px] tracking-[0.18em] uppercase text-[#1C1917] hover:text-[#9A5236] transition-colors py-1.5">
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
          <div className="max-w-7xl mx-auto w-full pt-6">
            <span className="text-[12px] tracking-[0.2em] uppercase text-[#1C1917]">
              A 300-year-old house · Marrakech medina
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
