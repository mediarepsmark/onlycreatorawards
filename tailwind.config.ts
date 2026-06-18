import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./types/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111817",
        midnight: "#05060d",
        charcoal: "#0b0f18",
        muted: "#65706b",
        "muted-on-dark": "#aeb8c7",
        line: "#dce4df",
        "line-on-dark": "rgba(255, 255, 255, 0.14)",
        brand: {
          green: "#10b981",
          blue: "#38bdf8",
          amber: "#f4c95d",
          rose: "#ec4899",
          purple: "#a855f7",
          cyan: "#22d3ee"
        }
      },
      boxShadow: {
        panel: "0 18px 50px rgba(20, 32, 27, 0.1)",
        "gold-glow": "0 0 34px rgba(244, 201, 93, 0.28)",
        "purple-glow": "0 0 48px rgba(168, 85, 247, 0.28)",
        "cyan-glow": "0 0 42px rgba(34, 211, 238, 0.24)"
      }
    }
  },
  plugins: []
};

export default config;
