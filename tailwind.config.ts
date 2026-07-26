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
          glow: "rgba(59, 130, 246, 0.3)",
          foreground: "hsl(var(--primary-foreground))",
          container: "hsl(var(--primary-container))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          glow: "rgba(139, 92, 246, 0.3)",
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
        "glass-gradient": "linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4))",
        "accent-gradient": "linear-gradient(135deg, #3b82f6, #8b5cf6)",
        "aurora-gradient": "radial-gradient(ellipse at 20% 50%, rgba(59, 130, 246, 0.04) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(139, 92, 246, 0.03) 0%, transparent 50%)",
        "bento-gradient-1": "linear-gradient(135deg, rgba(59, 130, 246, 0.04), rgba(139, 92, 246, 0.02))",
        "bento-gradient-2": "linear-gradient(135deg, rgba(139, 92, 246, 0.04), rgba(236, 72, 153, 0.02))",
        "bento-gradient-3": "linear-gradient(135deg, rgba(59, 130, 246, 0.03), rgba(59, 130, 246, 0.01))",
      },
      boxShadow: {
        "glass": "0 4px 16px 0 rgba(0, 0, 0, 0.06)",
        "glass-sm": "0 2px 8px 0 rgba(0, 0, 0, 0.04)",
        "neon": "0 0 20px rgba(59, 130, 246, 0.2)",
        "neon-blue": "0 0 20px rgba(139, 92, 246, 0.2)",
        "glow-purple": "0 0 40px rgba(59, 130, 246, 0.1)",
        "glow-blue": "0 0 40px rgba(139, 92, 246, 0.1)",
        "bento": "0 1px 3px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.02)",
        "bento-hover": "0 8px 32px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04)",
      },
      backdropBlur: {
        "xs": "2px",
      },
      fontFamily: {
        geist: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        inter: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      borderRadius: {
        "sm": "0.375rem",
        "DEFAULT": "0.5rem",
        "md": "0.5rem",
        "lg": "0.75rem",
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
