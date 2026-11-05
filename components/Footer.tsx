import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-ink text-plaster">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-16 md:grid-cols-3 md:px-10">
        <div>
          <p className="font-display text-[28px]">The Douaria</p>
          <p className="mt-3 text-[15px]">35 Derb Fhal Zefriti, Laksour<br />Medina, Marrakech</p>
        </div>
        <div className="text-[15px]">
          <p className="mb-3">The Douaria</p>
          <ul className="space-y-1.5">
            <li><Link href="/the-house" className="hover:underline">The house</Link></li>
            <li><Link href="/the-medina" className="hover:underline">The Medina</Link></li>
            <li><Link href="/philosophy" className="hover:underline">Philosophy</Link></li>
            <li><Link href="/stay" className="hover:underline">Stay</Link></li>
          </ul>
        </div>
        <div className="text-[15px]">
          <p className="mb-3">Good to know</p>
          <ul className="space-y-1.5">
            <li><Link href="/contact" className="hover:underline">Contact</Link></li>
            <li><Link href="/house-rules" className="hover:underline">House rules</Link></li>
            <li><Link href="/booking-conditions" className="hover:underline">Booking conditions</Link></li>
          </ul>
        </div>
      </div>
      <p className="mx-auto max-w-[1400px] px-4 pb-10 text-[13px] md:px-10">© {new Date().getFullYear()} The Douaria</p>
    </footer>
  );
}
