/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          950: '#06153b',
          900: '#081c44',
          800: '#0f2d5a',
          700: '#153f78',
          200: '#a4d8f0',
        },
      },
      boxShadow: {
        panel: '0 30px 60px rgba(2, 15, 44, 0.12)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-grid': 'radial-gradient(circle at top left, rgba(30,194,185,0.16), transparent 32%), radial-gradient(circle at bottom right, rgba(59,130,246,0.18), transparent 28%)',
      },
    },
  },
  plugins: [],
}

