/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        void: 'var(--bg-void)',
        panel: 'var(--bg-panel)',
        stroke: 'var(--stroke)',
        accent: 'var(--accent)',
        'accent-warm': 'var(--accent-warm)',
        'text-hi': 'var(--text-hi)',
        'text-lo': 'var(--text-lo)',
      },
      borderRadius: {
        token: 'var(--radius)',
      },
      boxShadow: {
        lift: 'var(--shadow-lift)',
        glow: 'var(--glow-accent)',
      },
      fontFamily: {
        display: ['"Clash Display"', '"General Sans"', 'Satoshi', 'system-ui', 'sans-serif'],
        sans: ['"General Sans"', 'Satoshi', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        intent: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scroll-left': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'scroll-right': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        confetti: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(-120px) rotate(320deg)', opacity: '0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.8s cubic-bezier(0.16,1,0.3,1) both',
        'scroll-left': 'scroll-left var(--ticker-duration, 40s) linear infinite',
        'scroll-right': 'scroll-right var(--ticker-duration, 40s) linear infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
