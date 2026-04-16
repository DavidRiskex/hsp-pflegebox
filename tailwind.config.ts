import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "surface-tint": "#1b6b54",
        "on-primary-fixed": "#004937",
        "inverse-primary": "#aefbdd",
        "on-background": "#2d3433",
        "secondary-container": "#d5e3ff",
        "secondary-fixed-dim": "#c4d5f5",
        "secondary": "#4f607b",
        "inverse-on-surface": "#9b9d9d",
        "secondary-fixed": "#d5e3ff",
        "tertiary": "#576346",
        "error": "#a83836",
        "surface-container-lowest": "#ffffff",
        "tertiary-fixed-dim": "#e2f0cb",
        "on-error": "#fff7f6",
        "tertiary-fixed": "#f1ffd9",
        "secondary-dim": "#43546e",
        "tertiary-container": "#f1ffd9",
        "on-surface-variant": "#596060",
        "on-primary-container": "#005d47",
        "on-secondary": "#f8f8ff",
        "on-primary-fixed-variant": "#156751",
        "on-primary": "#e5fff2",
        "on-tertiary-fixed-variant": "#616e50",
        "surface-bright": "#f8faf9",
        "surface-variant": "#dde4e3",
        "on-tertiary-fixed": "#455135",
        "on-tertiary": "#f0fed9",
        "surface": "#f8faf9",
        "error-dim": "#67040d",
        "primary-dim": "#035f49",
        "on-secondary-fixed": "#2f4059",
        "on-secondary-container": "#42526d",
        "surface-container-highest": "#dde4e3",
        "primary-container": "#a6f2d5",
        "on-error-container": "#6e0a12",
        "on-surface": "#2d3433",
        "outline": "#757c7b",
        "inverse-surface": "#0b0f0f",
        "outline-variant": "#acb3b2",
        "primary-fixed-dim": "#98e4c7",
        "on-tertiary-container": "#576346",
        "background": "#f8faf9",
        "primary": "#1b6b54", // Sage Green
        "surface-dim": "#d4dbda",
        "error-container": "#fa746f",
        "surface-container-high": "#e4e9e8",
        "on-secondary-fixed-variant": "#4c5c77",
        "tertiary-dim": "#4b573b",
        "primary-fixed": "#a6f2d5",
        "surface-container-low": "#f1f4f3",
        "surface-container": "#eaefee"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      fontFamily: {
        headline: ["Manrope", "sans-serif"],
        body: ["Manrope", "sans-serif"],
        label: ["Manrope", "sans-serif"]
      }
    },
  },
  plugins: [require("@tailwindcss/forms")],
} satisfies Config;
