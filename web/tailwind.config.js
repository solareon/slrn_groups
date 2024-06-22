/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    darkMode: ['selector', '[data-mode="dark"]'],
    theme: {
        extend: {
            colors: {
                'background-primary-light': '#f5f5f5',
                'background-highlight-light': 'rgb(220, 220, 220)',
                'text-primary-light': '#000000',
                'text-secondary-light': '#8e8e93',

                // Dark theme colors
                'background-primary-dark': '#000000',
                'background-highlight-dark': 'rgb(20, 20, 20)',
                'text-primary-dark': '#f2f2f7',
                'text-secondary-dark': '#6f6f6f',
            },
            fontFamily: {
                poppins: ["Poppins", "sans-serif"],
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
