/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./layouts/**/*.{js,jsx,ts,tsx}"

  ],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        'white': '#ffffff',
        'black': '#000000',
        'primary': {
          50: '#E9E8EE',
          300: '#6A668B',
          500: '#211A52'
        },
        'secondary': {
          100: '#ffed4a',
        },
        'tertiary': {
          500: '#54616E',
        },
        'bg': {
          50: '#FDFDFE',
          100: '#FAFAFB',
        },
      },
      keyframes: {
        'pulse-wave': {
          '0%, 100%': {
            transform: 'scale(1)',
            opacity: '1',
          },
          '50%': {
            transform: 'scale(1.5)',
            opacity: '0.7',
          },
        },
      },
      animation: {
        'pulse-wave': 'pulse-wave 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};



