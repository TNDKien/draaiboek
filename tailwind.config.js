/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#f5f0e8',
        'paper-dark': '#ede8df',
        spine: '#c8b89a',
        cover: '#4a3728',
        'cover-light': '#6b5240',
        ink: '#2c1810',
        'ink-light': '#5c4033',
      },
      boxShadow: {
        page: '0 4px 20px rgba(0,0,0,0.25), inset -2px 0 8px rgba(0,0,0,0.08)',
        'page-left': '0 4px 20px rgba(0,0,0,0.25), inset 2px 0 8px rgba(0,0,0,0.08)',
        book: '0 20px 60px rgba(0,0,0,0.4), 0 8px 20px rgba(0,0,0,0.2)',
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
