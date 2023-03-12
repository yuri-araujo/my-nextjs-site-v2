/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    {
      pattern: /(border|text)-(red|green|blue|sky|purple|teal|indigo|rose|pink|violet|cyan|gray)-(400|500|600|700)/,
      variants: ['dark','group-hover','hover'],
    }
  ],
  theme: {
    screens: {
      '2xl': {'max': '1535px'},
      // => @media (max-width: 1535px) { ... }

      'xl': {'max': '1279px'},
      // => @media (max-width: 1279px) { ... }

      'lg': {'max': '1023px'},
      // => @media (max-width: 1023px) { ... }

      'md': {'max': '767px'},
      // => @media (max-width: 767px) { ... }

      'sm': {'max': '639px'},
      // => @media (max-width: 639px) { ... }
    },
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
        wave: {
          "0%": { transform: "translateY(0rem)" },
          "50%": { transform: "translateY(-0.5rem)" },
          "100%": { transform: "translateY(0rem)" },
        }
      },
      animation: {
        floating: "floating 18s ease-in-out infinite",
        fadein: "fadein 300ms ease-in-out",
        glow: "glow 2500ms linear infinite",
        blinker: "blinker 1s linear infinite",
        slideright: "slideright 200ms ease-in-out forwards",
        rotate: "rotate 60s linear infinite",
        'rotate-reverse': 'rotate-reverse 60s linear infinite',
        wave: "wave 1s ease-in-out infinite"
      },
    },
  },
  plugins: [require("daisyui")],
}
