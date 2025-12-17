/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primaryRed: '#CC3333',
        lightGrey: '#f0f0f0',
        stoneBrown: '#8B4513',
        stoneGrey: '#696969',
        warmWhite: '#FAFAFA',
      },
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        body: ['Roboto', 'sans-serif'],
      },
      backgroundImage: {
        'stone-texture': "url('/images/stone-texture.jpg')",
        'hero-pattern': "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5))",
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
