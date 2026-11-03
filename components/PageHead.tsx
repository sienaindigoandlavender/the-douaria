import Link from "next/link";

// The top of every inner page: a small kicker, the title, one quiet line, then a photograph.
export default function PageHead({ kicker, title, line, photo, alt }: { kicker: string; title: React.ReactNode; line?: string; photo?: string; alt?: string }) {
  return (
    <>
      <section className="bg-plaster pt-16">
        <div className="mx-auto max-w-[1400px] px-4 pt-20 pb-14 md:px-10 md:pt-28 md:pb-20">
          <p className="kicker uppercase">{kicker}</p>
          <h1 className="mt-5 max-w-4xl font-display text-[44px] leading-[1.04] md:text-[72px]">{title}</h1>
          {line && <p className="mt-6 max-w-2xl text-[18px]">{line}</p>}
        </div>
      </section>
      {photo && <img src={photo} alt={alt || ""} className="block h-[56svh] w-full object-cover md:h-[78svh]" />}
    </>
  );
}

/** The quiet way on to the next page. */
export function NextPage({ href, kicker, title }: { href: string; kicker: string; title: React.ReactNode }) {
  return (
    <Link href={href} className="group block bg-plaster">
      <div className="mx-auto flex max-w-[1400px] items-end justify-between gap-6 border-t border-ink px-4 py-16 md:px-10 md:py-24">
        <div>
          <p className="kicker uppercase">{kicker}</p>
          <p className="mt-4 font-display text-[34px] leading-[1.05] md:text-[52px]">{title}</p>
        </div>
        <span className="pb-2 text-[28px] transition-transform group-hover:translate-x-1">&rarr;</span>
      </div>
    </Link>
  );
}
