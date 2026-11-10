import Link from "next/link";

// Riad di Siena's three-level footer, in its warm sand tones (Jacqueline, 6 Nov 2026). No link to any other brand.
const link = "text-ink text-sm hover:text-bejmat transition-colors";

export default function Footer() {
  return (
    <footer className="text-ink">
      <div className="bg-[#e8e0d4]">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-2">
              <span className="flex flex-col items-start leading-tight mb-3">
                <span className="text-sm tracking-[0.3em] font-light">THE</span>
                <span className="text-sm tracking-[0.3em] font-light">DOUARIA</span>
              </span>
              <p className="text-sm leading-relaxed max-w-xs mb-0">
                Old walls, steady and sure. A small house that keeps you safe from the city&apos;s rush.
              </p>
              <p className="text-sm leading-relaxed mt-4 mb-0">35 Derb Fhal Zefriti, Laksour<br />Medina, Marrakech</p>
            </div>
            <div>
              <span className="text-xs tracking-widest mb-4 block">STAY</span>
              <ul className="space-y-1.5">
                <li><Link href="/the-house" className={link}>The House</Link></li>
                <li><Link href="/rooms" className={link}>Rooms</Link></li>
                <li><Link href="/amenities" className={link}>Amenities</Link></li>
                <li><Link href="/the-medina" className={link}>The Medina</Link></li>
                <li><Link href="/dinners" className={link}>Dinners</Link></li>
                <li><Link href="/sahara" className={link}>The Sahara</Link></li>
                <li><Link href="/day-trips" className={link}>Day Trips</Link></li>
                <li><Link href="/philosophy" className={link}>Philosophy</Link></li>
              </ul>
            </div>
            <div>
              <span className="text-xs tracking-widest mb-4 block">GOOD TO KNOW</span>
              <ul className="space-y-1.5">
                <li><Link href="/contact" className={link}>Contact Us</Link></li>
                <li><Link href="/before-you-book" className={link}>Before You Book</Link></li>
                <li><Link href="/house-rules" className={link}>House Rules</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#d2c9bb]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between gap-3 text-xs tracking-wide">
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            <Link href="/booking-conditions" className="hover:text-bejmat">Booking conditions</Link>
            <Link href="/house-rules" className="hover:text-bejmat">House rules</Link>
          </div>
          <div className="flex items-center gap-4">
            <span>© {new Date().getFullYear()} The Douaria</span>
            {/* Jacqueline's secret door (10 Nov 2026): first dot = No. 37 directions, second = No. 35, on the neutral guest site. */}
            <span className="flex items-center gap-2 mr-16">
              <a href="https://www.indigoandlavender.love/the-riad/directions" className="w-2.5 h-2.5 rounded-full bg-ink/20 hover:bg-ink/40 transition-colors" aria-label="Directions to No. 37" />
              <a href="https://www.indigoandlavender.love/the-douaria/directions" className="w-2.5 h-2.5 rounded-full bg-ink/20 hover:bg-ink/40 transition-colors" aria-label="Directions to No. 35" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
