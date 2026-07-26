/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgDark: 'rgb(var(--color-bg-dark) / <alpha-value>)',
        bgDarker: 'rgb(var(--color-bg-darker) / <alpha-value>)',
        bgPurple: 'rgb(var(--color-bg-purple) / <alpha-value>)',
        accentGold: 'rgb(var(--color-accent-gold) / <alpha-value>)',
        accentPurple: 'rgb(var(--color-accent-purple) / <alpha-value>)',
        primary: {
          DEFAULT: '#1565C0',
          dark: '#0A47A0',
        },
        accent: {
          DEFAULT: '#F57C00',
        }
      },
      fontFamily: {
        sans: ['Cairo', 'sans-serif'], // Popular Arabic font
      }
    },
  },
  plugins: [],
}
