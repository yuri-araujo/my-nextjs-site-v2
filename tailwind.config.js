/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Montserrat", "sans-serif"],
      },
      colors: {
        'github': '#818cf8',
        'linkedin': '#0e76a8',
        'twitter': '#1da1f2',
      },
      keyframes: {
        // floating: {
        //   "0%, 100%": { transform: "translate(0px,0px)" },
        //   "50%": { transform: "translate(4px,-4px)" },
        // },
        floating: {
          "0%, 100%": { transform: "translate(4px,4px)" },
          "25%": { transform: "translate(-4px, 4px)" },
          "50%": { transform: "translate(4px,-4px)" },
          "75%": { transform: "translate(-4px,-4px)" },
        },
        fadein: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        glow: {
          "40%": { "text-shadow": "0 0 8px #fff" },
        },
        blinker: {
          "100%": { opacity: 0 },
        },
        slideright: {
          "0%": { translateX: "-100%" },
          "100%": { translateX: "0%" },
        },
        rotate: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        'rotate-reverse': {
          "0%": { transform: "rotate(360deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
      },
      animation: {
        floating: "floating 6s ease-in-out infinite",
        fadein: "fadein 300ms ease-in-out",
        glow: "glow 2500ms linear infinite",
        blinker: "blinker 1s linear infinite",
        slideright: "slideright 200ms ease-in-out forwards",
        rotate: "rotate 60s linear infinite",
        'rotate-reverse': 'rotate-reverse 60s linear infinite'
      },
    },
  },
  plugins: [require("daisyui")],
}
