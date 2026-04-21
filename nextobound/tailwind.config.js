/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      colors: {
        ink: {
          950: "#0c0f14",
          900: "#121722",
          800: "#1a2230",
          700: "#243044",
          600: "#3d4f6a",
          500: "#5a6f8c",
          400: "#8a9bb5",
          300: "#b4c0d4",
          200: "#d6deeb",
          100: "#eef2f8",
        },
        accent: {
          DEFAULT: "#5eead4",
          dim: "#2dd4bf",
          glow: "#99f6e4",
        },
        warn: "#fbbf24",
        danger: "#fb7185",
      },
    },
  },
  plugins: [],
};
