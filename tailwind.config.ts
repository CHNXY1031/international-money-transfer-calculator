import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#07110F",
        panel: "#0D1C18",
        signal: "#5BFF9A",
        paper: "#F2F0E8",
        amber: "#FFB84D",
      },
      fontFamily: {
        sans: ["var(--font-sora)"],
        mono: ["var(--font-ibm-plex-mono)"],
      },
    },
  },
  plugins: [],
};

export default config;
