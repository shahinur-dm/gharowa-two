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
        obsidian: {
          DEFAULT: '#0A0A0C',
          50: '#26262B',
          100: '#1E1E22',
          200: '#18181C',
          300: '#131316',
          400: '#0E0E10',
          500: '#0A0A0C',
          600: '#08080A',
          700: '#060607',
          800: '#040405',
          900: '#020203',
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
        brand: {
          bg: '#0A0A0C',
          card: '#121216',
          cardHover: '#181820',
          surface: '#1A1A22',
          border: 'rgba(245, 158, 11, 0.15)',
          borderHover: 'rgba(245, 158, 11, 0.4)',
          accent: '#F59E0B',
          accentGlow: 'rgba(245, 158, 11, 0.3)',
          text: '#F3F4F6',
          muted: '#9CA3AF',
        },
      },
      fontFamily: {
        bengali: ['var(--font-hind-siliguri)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
      },
      boxShadow: {
        gold: '0 0 25px -5px rgba(245, 158, 11, 0.25)',
        'gold-lg': '0 0 50px -10px rgba(245, 158, 11, 0.35)',
        'inner-gold': 'inset 0 0 15px 0 rgba(245, 158, 11, 0.15)',
        dark: '0 20px 40px -15px rgba(0, 0, 0, 0.8)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #92400E 100%)',
        'gold-glow-radial': 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, rgba(10,10,12,0) 70%)',
        'dark-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
