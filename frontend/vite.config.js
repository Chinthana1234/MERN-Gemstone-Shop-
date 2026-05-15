import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

//** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gemDark: '#0a0a0a',   // Deep black background
        gemCard: '#171717',   // Slightly lighter for cards
        gemPurple: '#9333ea', // Royal purple
        gemGold: '#fbbf24',   // Luxury gold
      }
    },
  },
  plugins: [],
}