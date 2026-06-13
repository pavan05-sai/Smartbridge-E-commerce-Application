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
          primary: '#0a0a0f', // deep black
          secondary: '#0d1117', // card/section bg
        },
        accent: {
          blue: '#2563eb', // primary CTA
          bright: '#3b82f6', // hover, links
          electric: '#60a5fa', // glow, badges
        },
        surface: '#111827', // navbar, modals
        borderBlue: '#1e3a5f', // subtle blue-tinted borders
        text: {
          primary: '#f1f5f9', // main text
          secondary: '#94a3b8', // muted text
        },
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
      },
      fontFamily: {
        heading: ['"Space Grotesk"', '"Syne"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        accent: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(37,99,235,0.3)',
        'glow-electric': '0 0 25px rgba(96,165,250,0.4)',
      },
    },
  },
  plugins: [],
}
