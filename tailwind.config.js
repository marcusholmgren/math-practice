/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // If there's a root index.html for Vite (usually at root for Vite)
    "./public/**/*.html", // To include the original HTML files if needed for reference
    "./app/**/*.{js,jsx,ts,tsx}", // Crucial for our React components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
