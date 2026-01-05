/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8f4e6',
          100: '#f0e6d2',
          200: '#e6d4b5',
          300: '#d4b587',
          400: '#c2a064',
          500: '#b08941',
          600: '#947036',
          700: '#785a2b',
          800: '#634a20',
          900: '#4a3a18',
        },
        gold: {
          DEFAULT: '#D4AF37',
          50: '#fdf8e9',
          100: '#faf1d3',
          200: '#f5e4b8',
          300: '#f0d79d',
          400: '#ebc982',
          500: '#D4AF37',
          600: '#c2982b',
          700: '#a88424',
          800: '#8b6f1d',
          900: '#6e5a16',
        },
        amber: {
          DEFAULT: '#F59E0B',
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#F59E0B',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        }
      },
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-gold': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '-200% 0%' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(212, 175, 55, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.8)' },
          '100%': { boxShadow: '0 0 5px rgba(212, 175, 55, 0.5)' },
        },
      },
    },
  },
  plugins: [],
}
