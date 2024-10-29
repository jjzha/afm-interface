/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",

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
    },
  },
  plugins: [],
};



