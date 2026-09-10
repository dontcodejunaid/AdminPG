/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Authentic Kerala Palm Deep Forest Green
        brand: {
          50: '#f0f7f4',
          100: '#d9ede5',
          200: '#b5dcd0',
          300: '#87c3b3',
          400: '#489884',
          500: '#237a67',
          600: '#1b5e50', // Logo primary deep green
          700: '#154b40',
          800: '#123e35',
          900: '#0f342d',
          950: '#071d19',
        },
        // Kerala Heritage Terracotta & Warm Ochre Gold
        amber: {
          50: '#fff9ed',
          100: '#ffefd4',
          200: '#fedaa9',
          300: '#fdbf72',
          400: '#fb9b38',
          500: '#e67e22', // Logo roof terracotta & pin gradient
          600: '#d96b14',
          700: '#b45012',
          800: '#8f3e16',
          900: '#753515',
          950: '#3f1908',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
