/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Тёмная тема по умолчанию через класс
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './public/index.html',
    './index.html',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7C3AED', // фиолетовый для AI
          dark: '#5B21B6',
        },
        accent: {
          DEFAULT: '#F59E42', // оранжевый акцент
          dark: '#B45309',
        },
        background: {
          DEFAULT: '#18181B', // фон для dark mode
          light: '#F3F4F6',
        },
        chat: {
          user: '#38BDF8', // голубой для пользователя
          ai: '#7C3AED', // фиолетовый для AI
        },
      },
      animation: {
        fade: 'fadeIn 0.5s ease-in',
        bounce: 'bounce 1s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
