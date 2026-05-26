import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#040714', // Ultra deep sleek gaming background
        header: '#ff2c55', // Vibrant gaming pink-red
        secondary: '#00f0ff', // Glowing cyber cyan
        accent: '#9d4edd', // Cyberpunk purple
        primary: '#3b82f6', // Neon blue
        cardColor: 'rgba(8, 12, 33, 0.6)', // Glassmorphic translucent navy
        type: {
          fairy: '#CB10CB',
          fire: '#ff5a00',
          normal: '#9fa39d',
          fighting: '#ff1a53',
          flying: '#3C92FF',
          poison: '#d340ff',
          ground: '#e07a34',
          rock: '#8e793e',
          bug: '#65A703',
          ghost: '#4b52d6',
          steel: '#4b637a',
          water: '#00b0ff',
          grass: '#10b981',
          electric: '#ffea00',
          psychic: '#ff4081',
          ice: '#00e5ff',
          dragon: '#3d34ff',
          dark: '#1e1b4b',
        }
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'sans-serif'],
        mono: ['var(--font-roboto)', 'monospace'],
        noto: ['var(--font-noto)', 'serif'],
      },
      boxShadow: {
        'glow-fire': '0 0 25px rgba(255, 90, 0, 0.45)',
        'glow-grass': '0 0 25px rgba(16, 185, 129, 0.45)',
        'glow-water': '0 0 25px rgba(0, 176, 255, 0.45)',
        'glow-electric': '0 0 25px rgba(255, 234, 0, 0.45)',
        'glow-cyan': '0 0 25px rgba(0, 240, 255, 0.45)',
        'glow-pink': '0 0 25px rgba(255, 44, 85, 0.45)',
        'glow-default': '0 0 25px rgba(255, 255, 255, 0.08)',
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'bounce-slow': 'bounce 4s infinite',
        'float': 'float 3.5s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'shimmer': 'shimmer 6s ease infinite',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.25', transform: 'scale(1)' },
          '50%': { opacity: '0.55', transform: 'scale(1.2)' },
        },
        shimmer: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        }
      }
    },
  },
  plugins: [],
}

export default config
