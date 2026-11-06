import Link from "next/link";

// The top of every inner page: a small kicker, the title, one quiet line, then a photograph.
export default function PageHead({ kicker, title, line, photo, alt }: { kicker: string; title: React.ReactNode; line?: string; photo?: string; alt?: string }) {
  return (
    <>
      <section className="bg-limewash pt-16">
        <div className="mx-auto max-w-[1500px] px-5 pt-20 pb-14 md:px-10 lg:px-14 md:pt-28 md:pb-20">
          <p className="house italic text-bejmat text-xl md:text-2xl mb-0">{kicker}</p>
          <h1 className="house mt-5 max-w-5xl font-light text-[clamp(2.6rem,6vw,5.6rem)] leading-[0.98] tracking-[-0.035em]">{title}</h1>
          {line && <p className="mt-7 max-w-[40ch] text-[clamp(1.15rem,1.5vw,1.35rem)] leading-relaxed">{line}</p>}
        </div>
      </section>
      {photo && <img src={photo} alt={alt || ""} className="block h-[56svh] w-full object-cover md:h-[78svh]" />}
    </>
  );
}

/** The quiet way on to the next page. */
export function NextPage({ href, kicker, title }: { href: string; kicker: string; title: React.ReactNode }) {
  return (
    <Link href={href} className="group block bg-tadelakt">
      <div className="mx-auto flex max-w-[1500px] items-end justify-between gap-6 px-5 py-20 md:px-10 lg:px-14 md:py-28">
        <div>
          <p className="house italic text-bejmat text-xl mb-0">{kicker}</p>
          <p className="house mt-4 mb-0 font-light text-[clamp(2.1rem,4.6vw,4.4rem)] leading-[1.02] tracking-[-0.03em]">{title}</p>
        </div>
        <span className="pb-2 text-[28px] transition-transform group-hover:translate-x-1">&rarr;</span>
      </div>
    </Link>
  );
}
