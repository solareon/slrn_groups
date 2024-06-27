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
        text: '#10120c',
        background: '#fafbf9',
        primary: '#94a276',
        secondary: '#a3c1c2',
        accent: '#8b9eb1',
        danger: '#ff0000',
        success: '#00ff00',
      },
      dark: {
        text: '#f1f3ed',
        background: '#050604',
        primary: '#7b895d',
        secondary: '#3d5b5c',
        accent: '#4e6174',
        danger: '#ff0000',
        success: '#00ff00',
      },
    }),
  ],
};
