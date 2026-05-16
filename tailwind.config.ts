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
        navy: "#0D1B2A",
        red: {
          DEFAULT: "#C0202A",
          600: "#C0202A",
          700: "#a81b23",
        },
        "gray-50": "#F8FAFC",
      },
      fontFamily: {
        oswald: ["Oswald", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      animation: {
        "slide-left": "slideLeft 30s linear infinite",
        "float": "float 3s ease-in-out infinite",
        "pulse-slow": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        slideLeft: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(3deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
