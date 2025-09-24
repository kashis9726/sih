/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Plus Jakarta Sans',
          'Inter',
          'Manrope',
          'ui-sans-serif',
          'system-ui',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif',
        ],
      },
      fontFamily: {
        sans: ['Manrope', 'Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'],
      },
      colors: {
        // Primary now uses a teal scale
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        // Accent palette includes orange for gradients and highlights
        accent: {
          pink: '#ec4899',
          teal: '#14b8a6',
          orange: '#f59e0b',
          blue: '#3b82f6',
          purple: '#8b5cf6',
        },
      },
      boxShadow: {
        'elev-1': '0 6px 16px -6px rgba(0,0,0,0.12), 0 8px 24px -4px rgba(0,0,0,0.10)',
        'elev-2': '0 12px 32px -12px rgba(0,0,0,0.18), 0 20px 40px -12px rgba(0,0,0,0.16)',
      },
      backgroundImage: {
        // Professional purple/white with soft indigo/violet glows
        'app-gradient': 'radial-gradient(1100px 520px at -10% -20%, rgba(168,85,247,0.22), transparent 60%), radial-gradient(900px 420px at 120% 0%, rgba(99,102,241,0.20), transparent 60%), radial-gradient(800px 380px at 50% 120%, rgba(236,72,153,0.16), transparent 60%), linear-gradient(to bottom right, #faf7ff, #f8fafc)',
        // Button gradient sweeping purple family
        'btn-gradient': 'linear-gradient(135deg, #a855f7 0%, #7c3aed 40%, #6366f1 100%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '50%': { transform: 'translateY(-12px) translateX(6px)' },
        },
        drift: {
          '0%, 100%': { transform: 'translateY(0) translateX(0) scale(1)' },
          '50%': { transform: 'translateY(10px) translateX(-8px) scale(1.05)' },
        },
      },
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        'drift-slower': 'drift 16s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
