/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: ['class'],
  safelist: ['ProseMirror'],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{html,js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    colors: {
      neutral: { 100: '#f5f5f5', 200: '#e5e5e5', 300: '#d5d5d5', 400: '#a3a3a3', 500: '#737373', 600: '#525252', 700: '#404040', 800: '#262626', 900: '#171717', },
      'transparent':'transparent',
      'lbtn':'#d2d4d7',
      'lcard':'#f2f2f2',
      'lfont':'#737982',


      'dbtn':'#384046',
      'dcard':'#2b3139',
      'dfont':'#191e24',
      'dlfont':'#ffffff',
      'gray-dark': '#273444',
      'gray': '#8492a6',
      'blue': '#1fb6ff',
      'darkblue': '#333CFF',
      'purple': '#7e5bef',
      'pink': '#ff49db',
      'orange': '#ff7849',
      'red':'#FF3349',
      'darkgreen': '#13ce66',
      'green':'#198124',
      'lightgreen':'#9AFCCC',
      'lightred':'#F9BEBE ',
      'redorange': '#FF4C33',
      'yellow': '#ffc82c',
      'gray-light': '#d3dce6',
      'white':'#ffffff',
      'black':'#1d232a',
      "bg":"#e5eaea"
    },
    fontFamily: {
      Rubik: ['Rubik', 'serif'],
      blanka: ['Blanka', 'sans-serif'],
      sans: ['Inter', ...defaultTheme.fontFamily.sans],
     },
    extend: {
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation:{
        blob:'blob 7s infinite',
        wiggle: 'wiggle 1s ease-in-out infinite',
      },
      keyframes:{
        blob:{
         "0%":{
          transform:"translate(0px,0px) scale(1)",
         },
         "33%":{
          transform:"translate(30px,-50px) scale(1.1)",
         },
         "66%":{
          transform:"translate(-20px,20px) scale(0.9)",
         },
         "100%":{
          transform:"translate(0px,0px) scale(1)",
         },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-10deg)' },
          '50%': { transform: 'rotate(10deg)' },
        }
      }
    }
  },
  plugins: [
    // require('tailwindcss-animate'), require('@tailwindcss/typography')
  ],
}
