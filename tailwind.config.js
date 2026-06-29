/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Satoshi", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "monospace"],
      },
      colors: {
        bg: "#060609",
        surface: "rgba(255,255,255,0.04)",
        "surface-hover": "rgba(255,255,255,0.07)",
        border: "rgba(255,255,255,0.08)",
        "border-hover": "rgba(255,255,255,0.14)",
        muted: "rgba(255,255,255,0.38)",
        subtle: "rgba(255,255,255,0.22)",
        violet: "#6366f1",
        "violet-light": "#818cf8",
        "violet-dim": "rgba(99,102,241,0.15)",
        purple: "#a855f7",
        "purple-dim": "rgba(168,85,247,0.15)",
        cyan: "#22d3ee",
        "cyan-dim": "rgba(34,211,238,0.12)",
        green: "#4ade80",
        "green-dim": "rgba(74,222,128,0.12)",
        amber: "#fbbf24",
        "amber-dim": "rgba(251,191,36,0.12)",
        red: "#f87171",
        "red-dim": "rgba(248,113,113,0.12)",
        pink: "#e879f9",
      },
      backgroundImage: {
        "grad-primary": "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
        "grad-text": "linear-gradient(135deg, #818cf8 0%, #c084fc 45%, #e879f9 75%, #fb923c 100%)",
        "grad-hero": "radial-gradient(ellipse 80% 60% at 10% 40%, rgba(99,102,241,0.2) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 90% 10%, rgba(168,85,247,0.15) 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 55% 85%, rgba(34,211,238,0.08) 0%, transparent 50%)",
      },
      boxShadow: {
        liq: "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.2), 0 4px 24px rgba(0,0,0,0.35)",
        "liq-hover": "inset 0 1px 0 rgba(255,255,255,0.12), 0 0 40px rgba(99,102,241,0.15), 0 8px 32px rgba(0,0,0,0.4)",
        btn: "0 8px 32px rgba(99,102,241,0.4), 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.18)",
        "btn-hover": "0 12px 40px rgba(99,102,241,0.55), inset 0 1px 0 rgba(255,255,255,0.22)",
        "glow-violet": "0 0 40px rgba(99,102,241,0.35)",
        "glow-green": "0 0 30px rgba(74,222,128,0.2)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.25rem",
        "4xl": "1.5rem",
      },
      letterSpacing: {
        tightest: "-0.06em",
        tighter: "-0.04em",
        tight: "-0.02em",
        wide: "0.06em",
        widest: "0.14em",
      },
      animation: {
        "fade-up": "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards",
        "fade-in": "fadeIn 0.5s ease forwards",
        shimmer: "shimmer 2.5s ease-in-out infinite",
        drift1: "drift1 14s ease-in-out infinite alternate",
        drift2: "drift2 18s ease-in-out infinite alternate",
        drift3: "drift3 12s ease-in-out infinite alternate",
        ticker: "ticker 22s linear infinite",
        "pulse-dot": "pulseDot 2s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(24px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "50%,100%": { transform: "translateX(100%)" },
        },
        drift1: {
          "0%": { transform: "translate(0,0) scale(1)" },
          "100%": { transform: "translate(40px,30px) scale(1.1)" },
        },
        drift2: {
          "0%": { transform: "translate(0,0) scale(1)" },
          "100%": { transform: "translate(-30px,40px) scale(0.95)" },
        },
        drift3: {
          "0%": { transform: "translate(0,0) scale(1)" },
          "100%": { transform: "translate(20px,-30px) scale(1.05)" },
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        pulseDot: {
          "0%,100%": { opacity: 0.4, transform: "scale(1)" },
          "50%": { opacity: 1, transform: "scale(1.4)" },
        },
      },
    },
  },
  plugins: [],
};