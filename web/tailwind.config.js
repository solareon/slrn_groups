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
        background: '#e6ebed',
        primary: '#fff',
        secondary: '#a7b7d7',
        accent: '#8981c5',
        danger: '#ff0000',
        success: '#8981c5',
      },
      dark: {
        text: '#e5e7eb',
        background: '#0d1016',
        primary: '#191c21',
        secondary: '#283858',
        accent: '#423a7e',
        danger: '#ff0000',
        success: '#423a7e',
      },
    }),
  ],
};
