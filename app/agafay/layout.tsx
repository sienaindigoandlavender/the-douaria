import type { Metadata } from "next";

export const metadata: Metadata = ({
  title: "The other desert: an evening in Agafay",
  description:
    "From Marrakech to the stone desert of Agafay: a private car, a camel at sunset, dinner at a desert camp under the Atlas, back in Marrakech the same night.",
  openGraph: {
    title: "The other desert",
    description: "Agafay at sunset, a camel, and dinner under the Atlas.",
  },
});

export default function AgafayLayout({ children }: { children: React.ReactNode }) {
  return children;
}
