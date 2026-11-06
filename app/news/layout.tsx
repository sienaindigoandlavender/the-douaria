import type { Metadata } from "next";

// News (Jacqueline, 6 Nov 2026): not in the menu, footer or sitemap, never indexed. Links are handed out
// by hand (Tripadvisor). next.config.js also sends X-Robots-Tag: noindex for /news.
export const metadata: Metadata = { robots: { index: false, follow: false, googleBot: { index: false, follow: false } } };

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
