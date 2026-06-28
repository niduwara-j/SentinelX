/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-purple': '#7C3AED',
        'primary-blue': '#2563EB',
        'dark-bg': '#0F172A',
        'dark-sidebar': '#111827',
        'dark-card': '#1E293B',
        'dark-border': '#334155',
        'text-primary': '#FFFFFF',
        'text-secondary': '#94A3B8',
      }
    },
  },
  plugins: [],
}