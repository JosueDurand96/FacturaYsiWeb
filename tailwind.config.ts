import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: { green: "#A3E635", dark: "#84CC16" },
        bg: "#0F1419",
        panel: "#171B22",
        elevated: "#1F242D",
        line: "#2A313C",
        content: "#F2F4F7",
        muted: "#98A2B3",
        amber: "#F5A524",
        danger: "#F43F5E",
        info: "#3B82F6",
        success: "#22C55E",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
