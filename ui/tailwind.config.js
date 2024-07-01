/** @type {import('tailwindcss').Config} */
const { createThemes } = require('tw-colors');
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: ["selector", '[data-mode="dark"]'],
  theme: {
    fontFamily: {
      sans: ["Graphik", "sans-serif"],
      serif: ["Merriweather", "serif"],
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [
    createThemes({
      light: {
        text: '#030704',
        background: '#fcfdfd',
        primary: '#57b277',
        secondary: '#a7b7d7',
        accent: '#8981c5',
        danger: '#ff0000',
        success: '#8981c5',
      },
      dark: {
        text: '#f8fcf9',
        background: '#020303',
        primary: '#4da86d',
        secondary: '#283858',
        accent: '#423a7e',
        danger: '#ff0000',
        success: '#423a7e',
      },
    }),
  ],
};
