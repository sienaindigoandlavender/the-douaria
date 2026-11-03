import Link from "next/link";

export interface Section { title: string; body: string[] }

// Plain policy pages: one column, numbered sections, ink at full strength.
export default function Prose({ kicker, title, intro, sections, related }: { kicker: string; title: string; intro: string; sections: Section[]; related: { href: string; label: string }[] }) {
  return (
    <div className="bg-plaster">
      <div className="mx-auto max-w-3xl px-4 pb-24 pt-32 md:px-6 md:pt-40">
        <p className="kicker mb-5">{kicker}</p>
        <h1 className="font-display text-[44px] leading-[1.05] md:text-[64px]">{title}</h1>
        <p className="mt-8 text-[19px]">{intro}</p>
        <div className="mt-14 space-y-12 border-t border-ink pt-12">
          {sections.map((s, i) => (
            <section key={s.title}>
              <div className="mb-4 flex items-baseline gap-4">
                <span className="text-[13px]">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="font-display text-[26px]">{s.title}</h2>
              </div>
              <div className="space-y-4 text-[17px]">
                {s.body.map((p, j) => <p key={j}>{p}</p>)}
              </div>
            </section>
          ))}
        </div>
        <div className="mt-16 flex flex-wrap gap-6 border-t border-ink pt-8 text-[15px]">
          {related.map((r) => <Link key={r.href} href={r.href} className="underline underline-offset-4">{r.label}</Link>)}
        </div>
      </div>
    </div>
  );
}
