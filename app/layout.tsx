import type { Metadata, Viewport } from "next";
import "@fontsource/dm-serif-display/400.css";
import "@fontsource-variable/manrope";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PhotoGuard from "@/components/PhotoGuard";
import RefCatcher from "@/components/RefCatcher";


const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.thedouaria.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: "The Douaria · a small house in the Marrakech Medina", template: "%s · The Douaria" },
  description:
    "Three rooms around a courtyard at 35 Derb Fhal Zefriti, a few minutes from Jemaa el-Fna. The whole house for up to six: Love, Joy and Bliss, each with its own bathroom, and a roof terrace.",
  openGraph: { type: "website", siteName: "The Douaria", images: ["/photos/bliss-wide.webp"] },
};

export const viewport: Viewport = { themeColor: "#FBFAF7" };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BedAndBreakfast",
  name: "The Douaria",
  url: SITE,
  image: `${SITE}/photos/bliss-wide.webp`,
  address: { "@type": "PostalAddress", streetAddress: "35 Derb Fhal Zefriti, Laksour", addressLocality: "Marrakech", addressCountry: "MA" },
  numberOfRooms: 3,
  checkinTime: "15:00",
  checkoutTime: "11:00",
  petsAllowed: true,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans text-[16px] leading-relaxed">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <RefCatcher />
        <PhotoGuard />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
