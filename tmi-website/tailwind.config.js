/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        viridian: {
          DEFAULT: '#358C6C',
          50: '#EFF2E4',
          100: '#BFE3D6',
          200: '#86A68B',
          300: '#5BA67E',
          400: '#358C6C',
          500: '#2A7058',
          600: '#1F5442',
        },
        onyx: {
          DEFAULT: '#343840',
          50: '#F5F5F6',
          100: '#E0E1E3',
          200: '#B5B8BC',
          300: '#8A8E94',
          400: '#6C7173',
          500: '#343840',
          600: '#22252B',
        },
        ivory: '#EFF2E4',
        cambridge: '#86A68B',
        dimgray: '#6C7173',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
