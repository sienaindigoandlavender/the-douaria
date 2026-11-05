import type { MetadataRoute } from "next";
import { STAYS } from "@/lib/stays";
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.thedouaria.com";
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/the-house", "/the-medina", "/philosophy", "/stay", ...STAYS.map((s) => `/stay/${s.slug}`), "/contact", "/before-you-book", "/house-rules", "/booking-conditions"];
  return paths.map((p) => ({ url: `${SITE}${p}`, lastModified: new Date("2026-11-03") }));
}
