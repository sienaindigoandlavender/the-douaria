/** @type {import('next').NextConfig} */
module.exports = {
  images: { unoptimized: true },
  // The rooms moved to /rooms with the riad design (6 Nov 2026).
  // News is handed out by hand (Tripadvisor), never indexed.
  async headers() {
    return [{ source: "/news/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }, { source: "/news", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
  async redirects() {
    return [
      { source: "/stay", destination: "/rooms", permanent: false },
      // Old riaddisiena.com paths someone might type on ii.riaddisiena.com land on the Douaria's own pages.
      { source: "/the-douaria", destination: "/", permanent: false },
      { source: "/the-house-rules", destination: "/house-rules", permanent: false },
      { source: "/the-riad", destination: "/the-house", permanent: false },
      { source: "/stay/:slug", destination: "/rooms#:slug", permanent: false },
    ];
  },
};
