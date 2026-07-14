import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#f7f9f9",
        surface: "#ffffff",
        ink: "#1b2430",
        "ink-soft": "#4c5866",
        hairline: "#e2e7e6",
        teal: "#0f6e6e",
        "teal-soft": "#e6f0ef",
        available: { DEFAULT: "#3f8f5f", bg: "#e9f4ee" },
        trials: { DEFAULT: "#c98a1b", bg: "#faf1de" },
        dev: { DEFAULT: "#5b7c99", bg: "#eaf0f5" },
        none: { DEFAULT: "#8a8f98", bg: "#eeeff0" },
        alert: { DEFAULT: "#c74b3f", bg: "#fbebe8" },
      },
      fontFamily: {
        display: ["ui-serif", "Iowan Old Style", "Palatino Linotype", "Georgia", "serif"],
        mono: ["ui-monospace", "SF Mono", "Cascadia Code", "Menlo", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
