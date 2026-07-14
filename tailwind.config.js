/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgDark: '#0D0B2B',
        bgDarker: '#1A0A4B',
        bgPurple: '#120838',
        accentGold: '#F5C518',
        accentPurple: '#7C3AED',
        primary: {
          DEFAULT: '#1565C0',
          dark: '#0A47A0',
        },
        accent: {
          DEFAULT: '#F57C00',
        }
      },
      fontFamily: {
        sans: ['Tajawal', 'sans-serif'], // Popular Arabic font
      }
    },
  },
  plugins: [],
}
