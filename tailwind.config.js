/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ember: {
          50: '#fff4ed',
          100: '#ffe4d1',
          200: '#ffc59f',
          300: '#ff9d5c',
          400: '#ff7a2e',
          500: '#ff5a1a',
          600: '#f23f0d',
          700: '#c92e0c',
          800: '#a02611',
          900: '#832211',
        },
        char: {
          950: '#0a0908',
          900: '#121110',
          800: '#1b1917',
          700: '#262320',
          600: '#332e29',
        },
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(255, 90, 26, 0.55)',
      },
      fontFamily: {
        sans: ['"Manrope"', '"Segoe UI"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
