/** @type {import('tailwindcss').Config} */
module.exports = {

  darkMode: 'selector',

  content: [
    "./src/routes/*.jsx",
    "./src/routes/shared/*.js"
  ],
  // content: [],

  theme: {
    extend: {},
  },
  plugins: [],
}

