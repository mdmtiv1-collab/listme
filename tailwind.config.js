/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      spacing: {
        '4.5': '1.125rem',
      },
      colors: {
        lime: {
          DEFAULT: "#84E000",
          neon: "#84E000",
          bright: "#92F200",
          dark: "#62A800",
          deep: "#497D00",
          subtle: "#F4FCE3",
          border: "#D9F99D",
        },
        obsidian: {
          DEFAULT: "#0B0E11",
          card: "#12171D",
          surface: "#181F26",
          border: "#232D37",
        },
        paper: {
          DEFAULT: "#F8F7F4",
          50: "#FFFFFF",
          100: "#FAF9F6",
          200: "#F2EFE9",
          300: "#E6E1D6",
          400: "#D3CBC0",
        },
        forest: {
          DEFAULT: "#84E000",
          emerald: "#62A800",
          light: "#92F200",
          dark: "#0B0E11",
          subtle: "#F4FCE3",
        },
        ink: {
          DEFAULT: "#0F172A",
          muted: "#64748B",
          faint: "#94A3B8",
          border: "#E2E8F0",
        }
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.03), 0 1px 2px -1px rgba(0, 0, 0, 0.03)",
        elevated: "0 10px 30px -4px rgba(0, 0, 0, 0.06), 0 4px 10px -2px rgba(0, 0, 0, 0.03)",
        glow: "0 0 25px -5px rgba(132, 224, 0, 0.35)",
        floating: "0 16px 40px -8px rgba(0, 0, 0, 0.12), 0 4px 16px -2px rgba(0, 0, 0, 0.04)",
      }
    },
  },
  plugins: [],
};
