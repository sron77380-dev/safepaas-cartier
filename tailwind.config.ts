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
        brand: {
          ink: "#0B1220",
          navy: "#13233F",
          steel: "#1E3358",
          mist: "#E8EEF7",
          sand: "#D4C4A8",
          amber: "#E8A838",
          ember: "#C45C26",
          success: "#2F7D4A",
          danger: "#B33A3A",
        },
        theme: {
          ssiap: "#E8A838",
          tfp: "#2F7D4A",
          aps: "#B33A3A",
          sst: "#6B4C9A",
          cartier: "#1A9BB5",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "hero-grid":
          "linear-gradient(rgba(19,35,63,0.55), rgba(11,18,32,0.92)), radial-gradient(ellipse at 20% 20%, rgba(232,168,56,0.18), transparent 50%), radial-gradient(ellipse at 80% 0%, rgba(26,155,181,0.12), transparent 40%)",
        "panel-sheen":
          "linear-gradient(160deg, rgba(30,51,88,0.9), rgba(11,18,32,0.95))",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-ring": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(232,168,56,0.35)" },
          "50%": { boxShadow: "0 0 0 10px rgba(232,168,56,0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out both",
        "fade-up-delay": "fade-up 0.7s ease-out 0.15s both",
        "fade-up-delay-2": "fade-up 0.7s ease-out 0.3s both",
        "pulse-ring": "pulse-ring 2.4s ease-out infinite",
        shimmer: "shimmer 3s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
