import type { Metadata } from "next";

export const metadata: Metadata = ({
  title: "Three days to the Sahara, from our door",
  description:
    "A private three-day trip from Marrakech to the dunes of Erg Chebbi: the High Atlas, Aït Benhaddou, a night in a 500-year-old kasbah, the Todra gorge, a night in a desert camp far from the tourist camps. Your own car and driver from our door.",
  openGraph: {
    title: "Three days to the Sahara",
    description: "From our door to the dunes and back, in a private car.",
  },
  
});

export default function SaharaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
