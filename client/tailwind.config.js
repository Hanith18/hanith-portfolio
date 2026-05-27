/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        purple: { DEFAULT: '#7c3aed', light: '#a78bfa', dim: 'rgba(124,58,237,0.15)' },
        cyan: { DEFAULT: '#06b6d4', light: '#67e8f9', dim: 'rgba(6,182,212,0.15)' },
        amber: { DEFAULT: '#f59e0b' },
        emerald: { DEFAULT: '#10b981' },
        bg: { DEFAULT: '#030308', card: 'rgba(10,10,20,0.8)', two: '#0a0a14' },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'star-twinkle': 'twinkle 3s ease-in-out infinite',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-20px)' } },
        pulseGlow: { '0%,100%': { boxShadow: '0 0 20px rgba(124,58,237,0.4)' }, '50%': { boxShadow: '0 0 40px rgba(6,182,212,0.8), 0 0 80px rgba(6,182,212,0.4)' } },
        twinkle: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.3 } },
      },
    },
  },
  plugins: [],
}
