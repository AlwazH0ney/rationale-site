import type { Config } from "tailwindcss";

/**
 * Brand tokens (v0.3 brand guide). Colours mirror the CSS variables in
 * app/globals.css so they can be used from Tailwind and from 3D/chart code.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      page: "#F2F0EC",
      paper: "#FFFFFF",
      cream: "#FAFAF7",
      linen: "#F2F0EA",
      chalk: "#E6E4DD",
      fog: "#C9C6BE",
      stone: "#8A8780",
      slate: "#4A4844",
      ink: "#15150F",
      sage: {
        DEFAULT: "#6B7E73",
        soft: "#A8B5AC",
        ghost: "#E9EDE9",
      },
    },
    fontFamily: {
      sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
      mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
    },
    fontSize: {
      // Display sizes scale down on small screens; the max is the brand value.
      display1: ["clamp(40px, 6.2vw, 72px)", { lineHeight: "1.02", letterSpacing: "-0.03em", fontWeight: "800" }],
      display2: ["clamp(32px, 4.4vw, 48px)", { lineHeight: "1.06", letterSpacing: "-0.03em", fontWeight: "800" }],
      lede: ["20px", { lineHeight: "1.45", fontWeight: "300" }],
      h1: ["32px", { lineHeight: "1.15", letterSpacing: "-0.03em", fontWeight: "700" }],
      h2: ["22px", { lineHeight: "1.25", fontWeight: "600" }],
      body: ["15px", { lineHeight: "1.55", fontWeight: "400" }],
      label: ["13px", { lineHeight: "1.4", fontWeight: "500" }],
      data: ["13px", { lineHeight: "1.4" }],
      micro: ["11px", { lineHeight: "1.3" }],
    },
    borderRadius: {
      none: "0",
      sm: "10px",
      md: "14px",
      lg: "20px",
      pill: "999px",
    },
    extend: {
      maxWidth: { card: "1240px" },
      boxShadow: { card: "0 1px 2px rgba(21,21,15,0.04), 0 12px 40px rgba(21,21,15,0.05)" },
      transitionTimingFunction: { brand: "cubic-bezier(0.2, 0.7, 0.2, 1)" },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
      },
      animation: { marquee: "marquee 28s linear infinite" },
    },
  },
  plugins: [],
};

export default config;
