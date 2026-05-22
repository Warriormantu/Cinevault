/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#e50914',
          dark:    '#b20710',
          glow:    'rgba(229, 9, 20, 0.4)',
        },
        surface: {
          1: '#0a0a0a',
          2: '#141414',
          3: '#1f1f1f',
          4: '#2a2a2a',
        },
      },
      animation: {
        'fade-in':   'fadeIn 0.4s ease-out both',
        'slide-up':  'slideUp 0.35s ease-out both',
        'slide-down':'slideDown 0.2s ease-out both',
        'scale-in':  'scaleIn 0.2s ease-out both',
        'shimmer':   'shimmer 1.6s linear infinite',
        'spin-slow': 'spin 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%':   { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.94)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
