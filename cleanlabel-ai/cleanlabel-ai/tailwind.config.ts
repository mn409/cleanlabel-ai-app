import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        body: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      colors: {
        pearl: '#F7F4EF',
        sage: {
          50: '#E8F5E9',
          100: '#C8E6C9',
          400: '#66BB6A',
          600: '#43A047',
        },
        crimson: {
          50: '#FFEBEE',
          100: '#FFCDD2',
          400: '#EF5350',
        },
        amber: {
          50: '#FFFDE7',
          warm: '#FFF3E0',
        },
        ink: {
          primary: '#1A1A1A',
          secondary: '#5A5A5A',
          muted: '#9A9A9A',
        },
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'glow-green': '0 0 30px rgba(104, 187, 106, 0.3)',
        'glow-red': '0 0 30px rgba(239, 83, 80, 0.3)',
        'soft': '0 4px 24px rgba(0,0,0,0.06)',
        'card': '0 2px 16px rgba(0,0,0,0.08)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
