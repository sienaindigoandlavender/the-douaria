import type { Config } from "tailwindcss";

// The Douaria: white plaster, ink, and the three colours of the rooms' wool
// (Love madder, Joy saffron, Bliss undyed grey), with the cobalt of the paintings.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    borderRadius: { none: "0", DEFAULT: "0", full: "9999px" },
    extend: {
      colors: {
        plaster: "#FBFAF7",
        lime: "#F2EFE8",
        ink: "#16150F",
        madder: "#9E2B33",
        saffron: "#E3A72F",
        wool: "#CFC9BE",
        cobalt: "#25348C",
        // tokens the shared booking modal uses
        foreground: "#16150F",
        background: "#FBFAF7",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        serif: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
