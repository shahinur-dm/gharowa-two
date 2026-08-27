import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        traditional: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
          950: '#450A0A',
        },
        gold: {
          50: '#FFFDF5',
          100: '#FEF7D8',
          200: '#FDEEAA',
          300: '#FCE071',
          400: '#FBCF3E',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
          950: '#451A03',
        },
        warm: {
          50: '#FAF7F2',
          100: '#F5EFEB',
          200: '#EAE1D9',
          300: '#D6C7BC',
          400: '#B8A495',
          500: '#9C8574',
          600: '#7F695A',
          700: '#645144',
          800: '#4E3E33',
          900: '#3D3027',
          950: '#231B15',
        },
      },
      fontFamily: {
        bengali: ['var(--font-hind-siliguri)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
      },
      boxShadow: {
        card: '0 4px 20px -2px rgba(0, 0, 0, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 12px 30px -4px rgba(185, 28, 28, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.05)',
        red: '0 4px 20px -2px rgba(185, 28, 28, 0.3)',
        'red-lg': '0 8px 30px -4px rgba(185, 28, 28, 0.4)',
        gold: '0 4px 20px -2px rgba(217, 119, 6, 0.25)',
      },
    },
  },
  plugins: [],
};

export default config;
