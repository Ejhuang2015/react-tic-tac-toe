/** @type {import('tailwindcss').Config} */ 
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
      "./index.html",
      "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Gochi Hand", ...defaultTheme.fontFamily.sans]
      }
    },
  },
  plugins: [],
}