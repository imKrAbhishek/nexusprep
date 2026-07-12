/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#e0eaff',
          200: '#c7d7ff',
          300: '#a5baff',
          400: '#8194ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        gold: { 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706' },
        surface: {
          50: '#f8f9fc', 100: '#f1f3f8', 200: '#e5e8f0',
          800: '#1e2235', 900: '#13172a', 950: '#0c0f1d',
        }
      },
      boxShadow: {
        'card': '0 2px 20px rgba(99,102,241,0.08)',
        'card-hover': '0 8px 40px rgba(99,102,241,0.18)',
        'glow': '0 0 30px rgba(99,102,241,0.35)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.5s ease forwards',
      },
      keyframes: {
        fadeUp: { '0%': { opacity: 0, transform: 'translateY(24px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
      }
    },
  },
  plugins: [],
};

