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
        brand: {
          red: '#900C19',
          darkRed: '#700913',
          lightRed: '#B91C1C',
          accentRed: '#DC2626',
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
        charcoal: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'Inter', 'Hind Siliguri', 'system-ui', 'sans-serif'],
        bengali: ['var(--font-bengali)', 'Hind Siliguri', 'Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        card: '0 4px 20px -2px rgba(0, 0, 0, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 16px 32px -6px rgba(144, 12, 25, 0.14), 0 4px 12px -2px rgba(0, 0, 0, 0.05)',
        red: '0 4px 20px -2px rgba(144, 12, 25, 0.35)',
        'red-lg': '0 8px 30px -4px rgba(144, 12, 25, 0.45)',
        gold: '0 4px 20px -2px rgba(217, 119, 6, 0.25)',
      },
      animation: {
        'float-slow': 'floatSlow 4s ease-in-out infinite',
        'steam': 'steamRise 3s ease-in-out infinite',
        'pour': 'pourFlow 2.5s ease-out forwards',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        steamRise: {
          '0%': { opacity: '0.2', transform: 'translateY(0) scale(0.95)' },
          '50%': { opacity: '0.6', transform: 'translateY(-12px) scale(1.05)' },
          '100%': { opacity: '0.2', transform: 'translateY(-24px) scale(1.15)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
