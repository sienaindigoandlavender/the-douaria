import type { Config } from "tailwindcss";

// The Douaria wears Riad di Siena's design (Jacqueline, 6 Nov 2026: "the new site lost its soul, duplicate
// the riad's warmth"): lime plaster by day, candlelight by night, the door's pale yellow for buttons.
// The old Douaria names (plaster, lime, cobalt, madder, saffron, wool) now point at the riad's colours,
// so every older page picks up the warmth without a rewrite.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    borderRadius: { none: "0", DEFAULT: "0", full: "9999px" },
    extend: {
      colors: {
        // The house (riad tokens)
        limewash: "#F8F4EE",
        tadelakt: "#EADFD1",
        bejmat: "#9A5236",
        door: "#E8D493",
        straw: "#F1E2AE",
        night: "#1D1814",
        candle: "#EDCB8C",
        ink: "#2a2520",
        sand: "#E8E0D4",
        // Old Douaria names → the riad's colours
        plaster: "#F8F4EE",
        lime: "#EADFD1",
        cobalt: "#9A5236",
        madder: "#9A5236",
        saffron: "#E8D493",
        wool: "#EADFD1",
        // tokens the shared booking modal uses
        foreground: "#2a2520",
        background: "#F8F4EE",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        serif: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "Georgia", "serif"],
        body: ["var(--font-body)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
