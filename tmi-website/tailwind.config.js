/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        tmi: {
          green: '#358C6C',
          'green-dark': '#246B54',
          'green-light': '#BFE3D6',
          'green-mist': '#E7F4EF',
          charcoal: '#111827',
        }
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
