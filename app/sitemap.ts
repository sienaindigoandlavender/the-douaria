import type { MetadataRoute } from "next";
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.thedouaria.com";
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/the-house", "/the-medina", "/philosophy", "/rooms", "/amenities", "/dinners", "/sahara", "/day-trips", "/agafay", "/contact", "/before-you-book", "/house-rules", "/booking-conditions"];
  return paths.map((p) => ({ url: `${SITE}${p}`, lastModified: new Date("2026-11-03") }));
}
