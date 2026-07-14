/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
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
