import type { Metadata } from "next";

export const metadata: Metadata = ({
  title: "Day trips from our door",
  description:
    "Private day trips from Marrakech: Agafay, the Ourika valley, Imlil, Essaouira, the Ouzoud falls and Aït Benhaddou. Your own car and driver, one price per car for up to four.",
  openGraph: {
    title: "Day trips from our door",
    description: "Your own car and driver for the day. One price per car, up to four of you.",
  },
  
});

export default function DayTripsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
