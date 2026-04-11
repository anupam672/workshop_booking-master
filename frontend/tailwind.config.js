/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F4C81',
          light: '#1a6bb5',
          dark: '#0a3560',
        },
        accent: {
          DEFAULT: '#F97316',
          light: '#fb923c',
          dark: '#ea6c0a',
        },
        success: {
          DEFAULT: '#16A34A',
        },
        warning: {
          DEFAULT: '#CA8A04',
        },
        danger: {
          DEFAULT: '#DC2626',
        },
      },
      fontFamily: {
        heading: ['Sora', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 8px 0 rgba(15,76,129,0.08)',
        'card-hover': '0 8px 24px 0 rgba(15,76,129,0.16)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
