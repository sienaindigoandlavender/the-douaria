/** @type {import('next').NextConfig} */
module.exports = {
  images: { unoptimized: true },
  // The rooms moved to /rooms with the riad design (6 Nov 2026).
  async redirects() {
    return [
      { source: "/stay", destination: "/rooms", permanent: false },
      { source: "/stay/:slug", destination: "/rooms#:slug", permanent: false },
    ];
  },
};
