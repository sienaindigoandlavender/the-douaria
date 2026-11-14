/** @type {import('next').NextConfig} */
module.exports = {
  images: { unoptimized: true },
  // The rooms moved to /rooms with the riad design (6 Nov 2026).
  // News is handed out by hand (Tripadvisor), never indexed.
  async headers() {
    return [{ source: "/listing/:path*", headers: [{ key: "Access-Control-Allow-Origin", value: "*" }, { key: "X-Robots-Tag", value: "noindex" }] }, { source: "/news/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }, { source: "/news", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
  // Booking.com guests' pages (14 Nov 2026): welcome, arrival, keys, directions, transfer and the APIs they call are
  // served from indigoandlavender.love through this domain (ii.riaddisiena.com), noindex.
  async rewrites() {
    const IL = "https://www.indigoandlavender.love";
    const paths = ["/welcome", "/arrival", "/keys", "/the-riad/:path+", "/the-douaria/:path+", "/il-static/:path*",
      "/api/arrival", "/api/passport", "/api/tax", "/api/tax/:path*", "/api/transfer", "/api/img", "/api/enter", "/api/sheets/:path*"];
    return {
      // Pages get ?via=ii so the neutral site shows the Douaria footer (Booking guests); APIs and assets go as they are.
      beforeFiles: paths.map((source) => ({ source, destination: `${IL}${source}${/^\/(api|il-static)/.test(source) ? "" : "?via=ii"}` })),
      fallback: [{ source: "/drawings/:path*", destination: `${IL}/drawings/:path*` }],
    };
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
