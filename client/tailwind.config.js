/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enables dark mode toggling via a CSS class
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6', // Primary Blue
          600: '#2563eb', // Hover Blue
          700: '#1d4ed8',
          900: '#1e3a8a', // Dark Indigo/Blue for sidebar
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Professional sans-serif font
      }
    },
  },
  plugins: [],
}