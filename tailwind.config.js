
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#0b0f14',
          card: 'rgba(255,255,255,0.06)',
          accent: '#6EE7F9'
        }
      },
      boxShadow: {
        glass: '0 2px 20px rgba(0,0,0,0.3)'
      }
    },
  },
  plugins: [],
}
