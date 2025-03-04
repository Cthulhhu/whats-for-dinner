// tailwind.config.js - With aspect ratio plugin
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4ade80', // Light green for accents
          DEFAULT: '#16a34a', // Main green color from your logo
          dark: '#15803d',
        },
        secondary: {
          light: '#f9fafb',
          DEFAULT: '#f3f4f6',
          dark: '#e5e7eb',
        },
        accent: {
          red: '#ef4444',    // For the heart/favorite icon
          yellow: '#eab308', // For highlighting
          blue: '#3b82f6',   // For tags
        }
      },
      borderRadius: {
        'card': '1rem',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      screens: {
        'xs': '375px',  // Extra small screens (small phones)
        'sm': '640px',  // Small screens (large phones, small tablets)
        'md': '768px',  // Medium screens (tablets)
        'lg': '1024px', // Large screens (laptops)
        'xl': '1280px', // Extra large screens (desktops)
        '2xl': '1536px' // Extra extra large screens (large desktops)
      },
      spacing: {
        '72': '18rem',
        '80': '20rem',
        '88': '22rem',
        '96': '24rem',
      }
    },
  },
  plugins: [
    // Add the official Tailwind aspect ratio plugin
    require('@tailwindcss/aspect-ratio'),
    // Add line clamp for truncating text
    require('@tailwindcss/line-clamp'),
  ],
}