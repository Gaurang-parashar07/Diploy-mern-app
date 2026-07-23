/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'insta-blue': '#0095f6',
        'insta-gray': '#dbdbdb',
        'insta-bg': '#fafafa',
      }
    },
  },
  plugins: [],
}

