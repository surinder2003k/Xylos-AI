import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          glow: "rgba(124, 58, 237, 0.3)",
          foreground: "hsl(var(--primary-foreground))",
          container: "hsl(var(--primary-container))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          glow: "rgba(0, 162, 230, 0.3)",
          foreground: "hsl(var(--secondary-foreground))",
          container: "hsl(var(--secondary-container))",
        },
        tertiary: {
          DEFAULT: "hsl(var(--tertiary))",
          container: "hsl(var(--tertiary-container))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          gold: "#FFD700",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        sidebar: "hsl(var(--sidebar))",
        surface: {
          DEFAULT: "hsl(var(--surface-container))",
          dim: "hsl(var(--surface-dim))",
          bright: "hsl(var(--surface-bright))",
          low: "hsl(var(--surface-container-low))",
          high: "hsl(var(--surface-container-high))",
          highest: "hsl(var(--surface-container-highest))",
        },
      },
      backgroundImage: {
        "glass-gradient": "linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.01))",
        "accent-gradient": "linear-gradient(135deg, #8b5cf6, #06b6d4, #f472b6)",
        "aurora-gradient": "radial-gradient(ellipse at 20% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(6, 182, 212, 0.07) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(244, 114, 182, 0.05) 0%, transparent 50%)",
        "bento-gradient-1": "linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(6, 182, 212, 0.04))",
        "bento-gradient-2": "linear-gradient(135deg, rgba(6, 182, 212, 0.08), rgba(244, 114, 182, 0.04))",
        "bento-gradient-3": "linear-gradient(135deg, rgba(244, 114, 182, 0.08), rgba(139, 92, 246, 0.04))",
      },
      boxShadow: {
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.4)",
        "glass-sm": "0 4px 16px 0 rgba(0, 0, 0, 0.3)",
        "neon": "0 0 20px rgba(139, 92, 246, 0.3)",
        "neon-blue": "0 0 20px rgba(6, 182, 212, 0.3)",
        "glow-purple": "0 0 40px rgba(139, 92, 246, 0.15)",
        "glow-blue": "0 0 40px rgba(6, 182, 212, 0.15)",
        "bento": "0 4px 24px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.03)",
        "bento-hover": "0 20px 60px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.06), 0 0 40px rgba(139, 92, 246, 0.05)",
      },
      backdropBlur: {
        "xs": "2px",
      },
      fontFamily: {
        geist: ["Geist", "var(--font-fustat)", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      borderRadius: {
        "sm": "0.125rem",
        "DEFAULT": "0.25rem",
        "md": "0.375rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography")
  ],
};
export default config;
