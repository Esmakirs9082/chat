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
        primary: '#7F5AF0', // основной фиолетовый
        secondary: '#E0E7FF', // светло-фиолетовый
        danger: '#F43F5E', // красный для ошибок
        nsfw: '#EF4444', // красный для NSFW контента
        premium: {
          100: 'linear-gradient(to right, #7928CA, #FF0080)', // градиент для премиума
          DEFAULT: '#7928CA', // базовый премиум цвет
          pink: '#FF0080', // розовый для градиента
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
          ai: '#7F5AF0', // обновленный фиолетовый для AI
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Inter как основной шрифт
      },
      animation: {
        fade: 'fadeIn 0.5s ease-in',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        bounce: 'bounce 1s infinite',
        spin: 'spin 1s linear infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      backgroundImage: {
        'premium-gradient': 'linear-gradient(to right, #7928CA, #FF0080)',
        'hero-gradient': 'linear-gradient(135deg, #7F5AF0 0%, #2563EB 100%)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
