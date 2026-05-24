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
        ink: "#17211d",
        muted: "#65706b",
        line: "#dce4df",
        brand: {
          green: "#127a5b",
          blue: "#246bce",
          amber: "#b46d12",
          rose: "#b8375a"
        }
      },
      boxShadow: {
        panel: "0 18px 50px rgba(20, 32, 27, 0.1)"
      }
    }
  },
  plugins: []
};

export default config;
