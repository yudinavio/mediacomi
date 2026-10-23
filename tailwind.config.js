/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        leaf: '#287A50',
        cream: '#F7F3E8',
        sun: '#F4C95D',
        terra: '#D98262',
        ink: '#24382C',
      },
      fontFamily: {
        display: ['Georgia', 'Times New Roman', 'serif'],
      },
      boxShadow: {
        card: '0 2px 10px rgba(36, 56, 44, 0.08), 0 12px 30px rgba(36, 56, 44, 0.07)',
      },
    },
  },
  plugins: [],
};
