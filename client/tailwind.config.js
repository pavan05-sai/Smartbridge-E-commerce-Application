/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#ffffff', // plain white background
          secondary: #333333;  /* classic dark grey */
        },
        accent: {
          blue: '#2563eb', // primary blue color
          bright: '#1d4ed8', // slightly darker blue for hover
          electric: '#2563eb', // badge / electric accent
        },
        surface: '#ffffff', // navbar, modals
        borderBlue: '#e2e8f0', // subtle light gray borders
        text: {
          primary: '#111827', // main dark text
          secondary: '#4b5563', // muted gray text
        },
        success: '#16a34a',
        error: '#dc2626',
        warning: '#d97706',
      },
      fontFamily: {
        heading: ['"Inter"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        accent: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        glow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'glow-electric': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
}
