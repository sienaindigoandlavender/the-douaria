import type { Metadata } from "next";
import { STAYS, stayPrice } from "@/lib/stays";
import { getHouseTerms } from "@/lib/houseTerms";
import { cityTaxEur } from "@/lib/cityTax";
import BookButton from "@/components/BookButton";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Stay",
  description: "The whole Douaria for up to six: your own rooms, your own roof terrace, breakfast on request.",
};

export default async function StayIndex() {
  const [terms, tax] = await Promise.all([getHouseTerms(), cityTaxEur()]);
  const house = STAYS[0];
  const price = stayPrice(terms, house);
  return (
    <>
      {/* The whole house: the one thing to book */}
      <section className="bg-lime pt-16 text-ink">
        <div className="mx-auto grid max-w-[1400px] md:grid-cols-2">
          <img src="/photos/love-wide.webp" alt="Love, off the courtyard" className="aspect-[4/3] h-full w-full object-cover md:aspect-auto md:min-h-[calc(100svh-4rem)]" />
          <div className="flex flex-col justify-center gap-10 px-4 py-14 md:px-14 md:py-20">
            <div>
              <p className="kicker uppercase">Stay</p>
              <h1 className="mt-4 font-display text-[40px] leading-[1.05] md:text-[60px]">
                The whole house, <em>and nobody else.</em>
              </h1>
              <p className="mt-6 text-[17px]">The door closes, and the house is yours: your own rooms, your own roof terrace, and Zahra a message away for breakfast on the roof or a Moroccan dinner cooked at home. For family or friends, up to six.</p>
            </div>

            <div className="flex flex-wrap items-end justify-between gap-6">
              <p>
                <span className="block font-display text-[48px] leading-none md:text-[60px]">€{price}</span>
                <span className="mt-2 block text-[15px]">a night, the whole house, breakfast on request</span>
              </p>
              <BookButton
                id={house.id}
                name={house.bookingName}
                price={price}
                maxGuests={house.maxGuests}
                cityTax={tax}
                className="bg-ink px-8 py-4 text-[16px] text-plaster hover:bg-cobalt transition-colors"
              />
            </div>
            <p className="text-[14px]">City tax (€{tax.toFixed(2)} a person a night) is added at checkout, as the city requires.</p>
          </div>
        </div>
      </section>

    </>
  );
}
