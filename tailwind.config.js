/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Colori per Light Mode (Panna/Grigio Chiaro)
        light: {
          bg: '#FDFCF0',
          panel: '#F5F3E7',
          text: '#2D2D2D',
          accent: '#7D8C7A',
        },
        // Colori per Dark Mode (Blu Notte/Antracite)
        dark: {
          bg: '#1A1C2C',
          panel: '#24273D',
          text: '#E0E0E0',
          accent: '#5D6B8F',
        }
      }
    },
  },
  plugins: [],
}
