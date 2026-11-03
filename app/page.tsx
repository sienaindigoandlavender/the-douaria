import Link from "next/link";
import { STAYS, stayPrice } from "@/lib/stays";
import { getHouseTerms } from "@/lib/houseTerms";
import { cityTaxEur } from "@/lib/cityTax";
import BookButton from "@/components/BookButton";

export const revalidate = 300;

// Peaceful, not loud, and not one long scroll (Jacqueline, 3 Nov 2026): the home page is a
// photograph, one breath of words and three doors (The house, The Medina, Stay). No room
// showcase, no figures. Italics in ink; white plaster and ink.

export default async function Home() {
  const [terms, tax] = await Promise.all([getHouseTerms(), cityTaxEur()]);
  const house = STAYS[0];
  const price = stayPrice(terms, house);

  return (
    <>
      {/* Hero: one photograph, the promise, one button */}
      <section className="relative h-[100svh] min-h-[620px] w-full overflow-hidden bg-ink text-plaster">
        <img src="/photos/bliss-wide.webp" alt="Bliss, the long room upstairs, under its brass lantern" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-ink/35" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[1400px] px-4 pb-8 md:px-10 md:pb-10">
          <p className="rise kicker mb-5 uppercase">No. 35 · Laksour · Marrakech</p>
          <h1 className="rise rise-2 max-w-4xl font-display text-[44px] leading-[1.04] md:text-[80px]">
            Close the door. <em>The Medina waits outside.</em>
          </h1>
          <div className="rise rise-3 mt-10">
            <BookButton
              id={house.id}
              name={house.bookingName}
              price={price}
              maxGuests={house.maxGuests}
              cityTax={tax}
              className="bg-plaster px-7 py-3.5 text-[15px] text-ink hover:bg-lime transition-colors"
            />
          </div>
        </div>
      </section>

      {/* One breath of words, then three doors */}
      <section className="bg-plaster">
        <div className="mx-auto max-w-[1400px] px-4 py-24 md:px-10 md:py-36">
          <p className="max-w-4xl font-display text-[30px] leading-[1.2] md:text-[46px]">
            Out there: drums, smoke from the grills, a thousand voices bargaining. <em>In here, the quiet you forgot you needed.</em>
          </p>
          <nav className="mt-20 grid border-t border-ink md:mt-28 md:grid-cols-3">
            {[
              { href: "/the-house", kicker: "The house", title: <>A door that <em>closes behind you</em></> },
              { href: "/the-medina", kicker: "The Medina", title: <>Five minutes <em>from the square</em></> },
              { href: "/stay", kicker: "Stay", title: <>The whole house, <em>yours</em></> },
            ].map((d) => (
              <Link key={d.href} href={d.href} className="group flex items-end justify-between gap-4 border-b border-ink py-8 md:border-b-0 md:border-e md:px-8 md:py-12 md:first:ps-0 md:last:border-e-0">
                <span>
                  <span className="kicker block uppercase">{d.kicker}</span>
                  <span className="mt-3 block font-display text-[28px] leading-[1.1] md:text-[34px]">{d.title}</span>
                </span>
                <span className="text-[22px] transition-transform group-hover:translate-x-1">&rarr;</span>
              </Link>
            ))}
          </nav>
        </div>
      </section>

    </>
  );
}
