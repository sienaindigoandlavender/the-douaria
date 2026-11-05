"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "/the-house", label: "The house" },
  { href: "/the-medina", label: "The Medina" },
  { href: "/philosophy", label: "Philosophy" },
  { href: "/stay", label: "Stay" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const path = usePathname();
  const [solid, setSolid] = useState(path !== "/");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (path !== "/") return setSolid(true);
    const on = () => setSolid(window.scrollY > window.innerHeight * 0.6);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [path]);
  useEffect(() => setOpen(false), [path]);

  const light = !solid && !open;
  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-500 ${light ? "text-plaster" : "bg-plaster/95 text-ink backdrop-blur"}`}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 md:px-10">
        <Link href="/" className="font-display text-[22px] tracking-wide">The Douaria</Link>
        <nav className="hidden items-center gap-8 text-[14px] md:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="underline-offset-4 hover:underline">{l.label}</Link>
          ))}
          <Link href="/stay" className={`px-5 py-2.5 ${light ? "bg-plaster text-ink" : "bg-ink text-plaster"}`}>Book</Link>
        </nav>
        <button className="md:hidden text-[14px]" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open && (
        <nav className="flex flex-col gap-5 border-t border-ink/15 bg-plaster px-4 py-8 text-[20px] md:hidden">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="font-display">{l.label}</Link>
          ))}
          <Link href="/stay" className="mt-2 bg-ink px-5 py-3 text-center text-[15px] text-plaster">Book</Link>
        </nav>
      )}
    </header>
  );
}
