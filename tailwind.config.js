/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#070D1D',
          900: '#0B132B',
          800: '#1C2541',
          700: '#2A365C',
        },
        aqua: {
          400: '#00B4D8',
          500: '#0096C7',
          600: '#0077B6',
        },
        emerald: {
          500: '#10B981',
          600: '#059669',
          800: '#2D6A4F',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Montserrat', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      }
    },
  },
  plugins: [],
}
