/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ksrtc: {
          red: "#C41E3A",
          "red-dark": "#8B0000",
          cream: "#F5E6C8",
          "cream-dark": "#E8D5A8",
          brown: "#8B4513",
          "brown-dark": "#654321",
          gold: "#DAA520",
          "gold-dark": "#B8860B",
          green: "#228B22",
          "green-dark": "#006400",
          sand: "#F4E1C1",
          dust: "#C2B280",
          sky: "#87CEEB",
          "sky-light": "#E0F0FF",
          window: "#B8D4E3",
          "window-frame": "#8B7355",
        },
        vintage: {
          sepia: "#704214",
          parchment: "#FFF8DC",
          ink: "#2F1B14",
          rust: "#A0522D",
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', "serif"],
        body: ['"Nunito"', "sans-serif"],
        malayalam: ['"Noto Sans Malayalam"', "sans-serif"],
      },
      keyframes: {
        "bus-ride": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "25%": { transform: "translateY(-2px) rotate(0.3deg)" },
          "50%": { transform: "translateY(0px) rotate(0deg)" },
          "75%": { transform: "translateY(-1px) rotate(-0.2deg)" },
        },
        "scenery-scroll": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        "window-shine": {
          "0%, 100%": { opacity: 0.3 },
          "50%": { opacity: 0.7 },
        },
        "ticket-tear": {
          "0%": { clipPath: "inset(0 100% 0 0)" },
          "100%": { clipPath: "inset(0 0 0 0)" },
        },
        "dust-float": {
          "0%": { transform: "translateY(0) rotate(0deg)", opacity: 0 },
          "20%": { opacity: 0.6 },
          "80%": { opacity: 0.6 },
          "100%": { transform: "translateY(-100vh) rotate(720deg)", opacity: 0 },
        },
        "fuel-gauge": {
          "0%": { width: "100%" },
          "100%": { width: "0%" },
        },
      },
      animation: {
        "bus-ride": "bus-ride 2s ease-in-out infinite",
        "scenery-scroll": "scenery-scroll 30s linear infinite",
        "window-shine": "window-shine 3s ease-in-out infinite",
        "ticket-tear": "ticket-tear 1s ease-out forwards",
        "dust-float": "dust-float 15s linear infinite",
        "fuel-gauge": "fuel-gauge 120s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
