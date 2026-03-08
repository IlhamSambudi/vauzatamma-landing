/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#1d645b',
                secondary: '#3a9b8e',
                accent: '#69c9b3',
                sage: '#e0f2e9',
                darksage: '#0f4c47',
                gold: '#e6b422',
                'gold-hover': '#c9a01e',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                arabic: ['Amiri', 'serif'],
            },
            boxShadow: {
                'card': '0 2px 16px 0 rgba(29,100,91,0.07)',
                'card-lg': '0 8px 40px 0 rgba(29,100,91,0.13)',
                'gold': '0 4px 20px 0 rgba(230,180,34,0.25)',
            },
            backgroundImage: {
                'gradient-primary': 'linear-gradient(135deg, #1d645b 0%, #3a9b8e 100%)',
                'gradient-hero': 'linear-gradient(to bottom, rgba(255,255,255,0.82), rgba(255,255,255,0.55) 50%, rgba(29,100,91,0.22))',
                'gradient-gold': 'linear-gradient(135deg, #e6b422 0%, #f5ca4e 100%)',
            },
        },
    },
    plugins: [],
}
