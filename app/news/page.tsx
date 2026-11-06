import Link from "next/link";

export const metadata = { title: "News" };

const NEWS = [
  { href: "/news/riad-di-siena-ii", date: "6 November 2026", title: "Riad di Siena II opens in a newly renovated house at No. 35 Derb Fhal Zefriti" },
];

export default function News() {
  return (
    <div className="bg-limewash text-ink min-h-screen">
      <section className="px-5 md:px-10 lg:px-14 pt-36 md:pt-44 pb-24 md:pb-32">
        <div className="mx-auto max-w-[1500px]">
          <h1 className="house font-light text-[clamp(3rem,7vw,6.5rem)] leading-[0.92] tracking-[-0.04em]">News</h1>
          <ul className="mt-16 border-t border-ink">
            {NEWS.map((n) => (
              <li key={n.href} className="border-b border-ink">
                <Link href={n.href} className="group grid md:grid-cols-12 gap-4 py-8 md:py-10">
                  <span className="md:col-span-3 text-[1rem]">{n.date}</span>
                  <span className="md:col-span-9 house font-light text-[clamp(1.6rem,2.8vw,2.6rem)] leading-[1.08] group-hover:text-bejmat transition-colors">{n.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
