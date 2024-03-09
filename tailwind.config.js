// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {colors: {
      primary: '#1E40AF',
      grayCustom: '#8C8C8C',
      blackCustom: '#1F1F1F',
    }},
  },
  darkMode: "class",
  plugins: [],
};