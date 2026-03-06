/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'brand': {
                    yellow: '#FFD700',
                    orange: '#FFA500',
                    pink: '#FF69B4',
                    red: '#FF4500',
                    dark: '#333333',
                }
            },
            fontFamily: {
                'sans': ['Inter', 'sans-serif'],
                'display': ['Outfit', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
