/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // Keep it but we will default to light and remove toggles
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#fdffe6',
          100: '#f9ffc1',
          200: '#f3ff86',
          300: '#eaff41',
          400: '#ddff0d',
          500: '#ccff00', // The neon lime green
          600: '#a3cc00',
          700: '#7a9900',
          800: '#526600',
          900: '#293300',
        },
        secondary: {
          50: '#f0f5ff',
          100: '#e5edff',
          200: '#cddbff',
          300: '#a3c2ff',
          400: '#7aa3ff',
          500: '#5285ff', // Light blue
          600: '#2966ff',
          700: '#0047ff',
          800: '#0033cc',
          900: '#002280',
        },
        // Keep some standard ones for generic things
        success: {
          500: "#22c55e",
        },
        warning: {
          500: "#f59e0b",
        },
        danger: {
          500: "#ef4444",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
