/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: ["selector", '[data-mode="dark"]'],
  theme: {
    fontFamily: {
      sans: ["Graphik", "sans-serif"],
      serif: ["Merriweather", "serif"],
    },
    extend: {
      colors: {
        // Light theme colors
        "background-primary-light": "#f0f4f8", // Soft light blue
        "background-secondary-light": "#ffffff", // Pure white
        "background-highlight-light": "#dbe9f1", // Light blue highlight
        "background-hover-light": "#e0e6ed", // Slightly darker light blue
        "border-primary-light": "#cbd5e0", // Light gray-blue for borders
        "text-primary-light": "#1a202c", // Dark gray for text
        "text-secondary-light": "#4a5568", // Medium gray for secondary text
        "text-highlight-light": "#718096", // Light gray for highlights
        "text-danger-light": "#e53e3e", // Red for danger text
        "button-primary-light": "#4299e1", // Blue for primary buttons
        "button-hover-light": "#2b6cb0", // Darker blue for button hover
        "button-success-light": "#48bb78", // Green for success buttons
        "button-danger-light": "#e53e3e", // Red for danger buttons

        // Dark theme colors
        "background-primary-dark": "#1a202c", // Dark blue
        "background-secondary-dark": "#2d3748", // Slightly lighter dark blue
        "background-highlight-dark": "#4a5568", // Medium dark blue highlight
        "background-hover-dark": "#2c5282", // Hover state blue
        "border-primary-dark": "#718096", // Light gray-blue for borders
        "text-primary-dark": "#edf2f7", // Light gray for text
        "text-secondary-dark": "#a0aec0", // Medium gray for secondary text
        "text-highlight-dark": "#cbd5e0", // Light gray for highlights
        "text-danger-dark": "#e53e3e", // Red for danger text
        "button-primary-dark": "#3182ce", // Blue for primary buttons
        "button-hover-dark": "#2b6cb0", // Darker blue for button hover
        "button-success-dark": "#38a169", // Green for success buttons
        "button-danger-dark": "#e53e3e", // Red for danger buttons
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};