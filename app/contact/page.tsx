import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import HouseMap from "@/components/HouseMap";
import { NEARBY } from "@/lib/places";

export const metadata: Metadata = { title: "Contact", description: "Write to the Douaria, 35 Derb Fhal Zefriti, a few minutes on foot from Jemaa el-Fna." };

export default function ContactPage() {
  return (
    <div className="bg-plaster">
      <section className="mx-auto grid max-w-[1400px] gap-14 px-4 pb-20 pt-32 md:grid-cols-12 md:px-10 md:pt-40">
        <div className="md:col-span-5">
          <p className="kicker mb-5">Contact</p>
          <h1 className="font-display text-[44px] leading-[1.05] md:text-[64px]">Write to us.</h1>
          <p className="mt-6 text-[18px]">A question, a date, a group of six who can't agree on anything except Marrakech. We'll write back soon.</p>
          <div className="mt-10 space-y-1 text-[16px]">
            <p className="font-display text-[22px]">The Douaria</p>
            <p>35 Derb Fhal Zefriti, Laksour</p>
            <p>Medina, Marrakech</p>
          </div>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <ContactForm />
        </div>
      </section>
      <HouseMap className="h-[460px] md:h-[600px]" />
      <section className="mx-auto max-w-[1400px] px-4 py-16 md:px-10">
        <p className="kicker mb-6">On foot from the door</p>
        <ul className="grid gap-4 text-[17px] md:grid-cols-4">
          {NEARBY.map((p) => (
            <li key={p.name} className="border-t border-ink pt-3"><span className="font-display text-[22px]">{p.name}</span><br />{p.walk}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
