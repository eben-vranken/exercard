import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        main: "var(--text-main)",
        medium: "var(--text-medium)",
        light: "var(--text-light)",
        ultralight: "var(--text-ultralight)",
        primary: "rgb(var(--primary))"
      },
      fontSize: {
        'responsive-sm': 'clamp(0.75rem, 0.8vw, 0.875rem)', // Min 12px, scales with 0.8vw, Max 14px
        'responsive-md': 'clamp(0.875rem, 1vw, 1rem)',      // Min 14px, scales with 1vw, Max 16px
        'responsive-lg': 'clamp(1rem, 1.2vw, 1.125rem)',    // Min 16px, scales with 1.2vw, Max 18px
      },
    },
  },
  plugins: [],
} satisfies Config;
