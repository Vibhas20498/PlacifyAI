import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--white)",
        foreground: "var(--black)",
        gray: {
          50: "#F7F7F7",
          100: "#F0F0F0",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
          950: "#0A0A0A",
        }
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Fraunces", "Instrument Serif", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter Tight", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "IBM Plex Mono", "monospace"],
      },
      borderRadius: {
        'card': '14px',
      }
    },
  },
  plugins: [],
};
export default config;
