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
        surface: "#fcf8ff",
        "surface-bright": "#fcf8ff",
        "surface-dim": "#dcd8e5",
        "surface-container": "#f0ecf9",
        "surface-container-low": "#f5f2ff",
        "surface-container-high": "#eae6f4",
        "surface-container-highest": "#e4e1ee",
        "surface-container-lowest": "#ffffff",
        "surface-variant": "#e4e1ee",
        "on-surface": "#1b1b24",
        "on-surface-variant": "#464555",
        primary: "#3525cd",
        "primary-container": "#4f46e5",
        "on-primary": "#ffffff",
        "on-primary-container": "#dad7ff",
        secondary: "#006b5f",
        "secondary-container": "#62fae3",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#007165",
        outline: "#777587",
        "outline-variant": "#c7c4d8",
        error: "#ba1a1a",
        "error-container": "#ffdad6",
        tertiary: "#7e3000",
        "tertiary-container": "#a44100",
        "on-tertiary": "#ffffff",
        "code-bg": "#0f0f14",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        ambient: "0 32px 64px rgba(79, 70, 229, 0.06)",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
