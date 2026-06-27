import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f2f7f4",
          100: "#e1ede6",
          200: "#c5dbce",
          300: "#9bbbab",
          400: "#6e9481",
          500: "#4f7765",
          600: "#3d5e4f",
          700: "#324c41",
          800: "#2a3e35",
          900: "#1b2a24",
          950: "#121d18", // Deep luxury forest green
        },
        gold: {
          50: "#fdfae9",
          100: "#faf2c6",
          200: "#f4e48c",
          300: "#edd04d",
          400: "#e6bb22",
          500: "#ca9d16",
          600: "#aa7a10",
          700: "#885910",
          800: "#724713",
          900: "#623b15",
          950: "#391f08", // Luxury warm gold
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      boxShadow: {
        premium: "0 10px 30px -10px rgba(18, 29, 24, 0.08), 0 1px 3px rgba(18, 29, 24, 0.02)",
        glow: "0 0 15px rgba(202, 157, 22, 0.15)",
      },
      keyframes: {
        bounceIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      },
      animation: {
        bounceIn: 'bounceIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
      }
    },
  },
  plugins: [],
};
export default config;
