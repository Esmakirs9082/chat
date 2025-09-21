import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Play,
  Star,
  Clock,
  MessageCircle,
  Zap,
  Users,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Crown,
  Heart,
  Moon,
  Sun,
  Menu,
  X,
  Quote,
} from 'lucide-react';
import Button from '../components/ui/Button';
import { CharacterGallery } from '../components/character';
import { useCharacterStore } from '../stores/characterStore';
import { useAuthStore } from '../stores/authStore';
import { useSettingsStore } from '../stores/settingsStore';
import LoginModal from '../components/auth/LoginModal';
import RegisterModal from '../components/auth/RegisterModal';

const HomePage: React.FC = () => {
  const { characters } = useCharacterStore();
  const { isAuthenticated } = useAuthStore();
  const { theme, setTheme } = useSettingsStore();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const openAuthModal = (type: 'login' | 'register') => {
    if (type === 'login') {
      setShowLoginModal(true);
      setShowRegisterModal(false);
    } else {
      setShowRegisterModal(true);
      setShowLoginModal(false);
    }
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      // Перенаправляем в галерею если уже авторизован
      window.location.href = '/gallery';
    } else {
      openAuthModal('register');
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}
    >
      {/* Header */}
      <header
        className={`sticky top-0 z-50 backdrop-blur-lg border-b transition-colors ${
          theme === 'dark'
            ? 'bg-gray-900/95 border-gray-800'
            : 'bg-white/95 border-gray-200'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <span
                className={`font-bold text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
              >
                AI Chat
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/gallery"
                className={`transition-colors ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Персонажи
              </Link>
              <Link
                to="/pricing"
                className={`transition-colors ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Цены
              </Link>
              <Link
                to="/about"
                className={`transition-colors ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                О нас
              </Link>
            </nav>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              {/* Auth Buttons */}
              {!isAuthenticated ? (
                <div className="hidden md:flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    onClick={() => openAuthModal('login')}
                    className={
                      theme === 'dark' ? 'text-gray-300 hover:text-white' : ''
                    }
                  >
                    Войти
                  </Button>
                  <Button
                    onClick={() => openAuthModal('register')}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  >
                    Регистрация
                  </Button>
                </div>
              ) : (
                <Link
                  to="/dashboard"
                  className="hidden md:inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all"
                >
                  Панель
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`md:hidden p-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div
              className={`md:hidden py-4 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}
            >
              <nav className="flex flex-col space-y-4">
                <Link
                  to="/gallery"
                  className={`transition-colors ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Персонажи
                </Link>
                <Link
                  to="/pricing"
                  className={`transition-colors ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Цены
                </Link>
                <Link
                  to="/about"
                  className={`transition-colors ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  О нас
                </Link>
                {!isAuthenticated ? (
                  <div className="flex flex-col space-y-2 pt-4">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        openAuthModal('login');
                        setMobileMenuOpen(false);
                      }}
                      className={`justify-start ${theme === 'dark' ? 'text-gray-300 hover:text-white' : ''}`}
                    >
                      Войти
                    </Button>
                    <Button
                      onClick={() => {
                        openAuthModal('register');
                        setMobileMenuOpen(false);
                      }}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 justify-start"
                    >
                      Регистрация
                    </Button>
                  </div>
                ) : (
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Панель
                  </Link>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10">
        {/* Background Effects */}
        <div
          className={`absolute inset-0 ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20'
              : 'bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5'
          }`}
        />
        <div
          className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl animate-pulse ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-blue-500/10 to-purple-500/10'
              : 'bg-gradient-to-br from-blue-400/20 to-purple-400/20'
          }`}
        />
        <div
          className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl animate-pulse ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-purple-500/10 to-pink-500/10'
              : 'bg-gradient-to-br from-purple-400/20 to-pink-400/20'
          }`}
          style={{ animationDelay: '1s' }}
        />

        <div className="relative container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Badge */}
            <div
              className={`inline-flex items-center px-4 py-2 rounded-full font-medium text-sm mb-8 animate-bounce ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-900/50 to-purple-900/50 text-blue-300'
                  : 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800'
              }`}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Новая эра AI-общения
            </div>

            {/* Main Heading */}
            <h1
              className={`text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              Общайтесь с
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent block">
                AI-персонажами
              </span>
              будущего
            </h1>

            {/* Subtitle */}
            <p
              className={`text-xl md:text-2xl mb-10 leading-relaxed max-w-3xl mx-auto ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Погрузитесь в увлекательные диалоги с уникальными AI-персонажами.
              Каждый разговор — это новое приключение и эмоциональный опыт.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              <div
                className={`flex items-center space-x-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
              >
                <Users className="w-5 h-5 text-blue-500" />
                <span className="font-semibold">10,000+</span>
                <span>пользователей</span>
              </div>
              <div
                className={`flex items-center space-x-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
              >
                <MessageCircle className="w-5 h-5 text-purple-500" />
                <span className="font-semibold">50,000+</span>
                <span>диалогов</span>
              </div>
              <div
                className={`flex items-center space-x-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
              >
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold">4.9</span>
                <span>рейтинг</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                onClick={handleGetStarted}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Начать общение
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <Link
                to="/gallery"
                className={`inline-flex items-center justify-center px-8 py-4 border rounded-md font-medium transition-all duration-300 ${
                  theme === 'dark'
                    ? 'border-gray-600 text-gray-300 bg-transparent hover:bg-gray-800'
                    : 'border-gray-300 text-gray-700 bg-transparent hover:bg-gray-50 active:bg-gray-100'
                }`}
              >
                Смотреть персонажей
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Characters Section */}
      <section
        className={`py-20 backdrop-blur-sm ${
          theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2
              className={`text-4xl md:text-5xl font-bold mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              Популярные персонажи
            </h2>
            <p
              className={`text-xl max-w-2xl mx-auto ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Познакомьтесь с самыми интересными AI-персонажами, которые уже
              завоевали сердца тысяч пользователей
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <CharacterGallery
              filters={{
                sortBy: 'popular',
                categories: ['featured', 'popular'],
              }}
              onCharacterSelect={(character) => {
                if (isAuthenticated) {
                  window.location.href = `/chat/${character.id}`;
                } else {
                  openAuthModal('login');
                }
              }}
              className="h-auto"
            />
          </div>

          <div className="text-center mt-12">
            <Link
              to="/gallery"
              className={`inline-flex items-center justify-center px-8 py-4 border rounded-md font-medium transition-all duration-300 ${
                theme === 'dark'
                  ? 'border-blue-500 text-blue-400 bg-transparent hover:bg-blue-500/10'
                  : 'border-blue-300 text-blue-600 bg-transparent hover:bg-blue-50'
              }`}
            >
              Посмотреть всех персонажей
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className={`py-20 ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-gray-800 to-gray-900'
            : 'bg-gradient-to-br from-gray-50 to-blue-50'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2
              className={`text-4xl md:text-5xl font-bold mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              Почему выбирают нас?
            </h2>
            <p
              className={`text-xl max-w-2xl mx-auto ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Уникальные возможности для незабываемого общения с AI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div
              className={`rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-white'
              }`}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3
                className={`text-2xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}
              >
                Реалистичные диалоги
              </h3>
              <p
                className={`leading-relaxed ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                Продвинутые AI-модели создают естественные и увлекательные
                разговоры, адаптируясь под ваш стиль общения.
              </p>
            </div>

            <div
              className={`rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-white'
              }`}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3
                className={`text-2xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}
              >
                Эмоциональная связь
              </h3>
              <p
                className={`leading-relaxed ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                Персонажи помнят ваши разговоры и развиваются вместе с вами,
                создавая глубокие эмоциональные связи.
              </p>
            </div>

            <div
              className={`rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-white'
              }`}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3
                className={`text-2xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}
              >
                Безграничная фантазия
              </h3>
              <p
                className={`leading-relaxed ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                От романтических историй до захватывающих приключений —
                исследуйте любые сценарии и темы.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        className={`py-20 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2
              className={`text-4xl md:text-5xl font-bold mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              Что говорят наши пользователи
            </h2>
            <p
              className={`text-xl max-w-2xl mx-auto ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Более 10,000 довольных пользователей уже оценили качество нашего
              сервиса
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Анна К.',
                role: 'Студентка',
                text: 'Невероятно реалистичные персонажи! Чувствую себя как в настоящем разговоре с живым человеком. Особенно впечатляет как AI запоминает детали наших предыдущих бесед.',
                rating: 5,
                avatar: '👩‍💼',
              },
              {
                name: 'Михаил П.',
                role: 'Разработчик',
                text: 'Как технический специалист, могу сказать - уровень ИИ здесь просто потрясающий. Персонажи адаптируются под мой стиль общения и даже шутят!',
                rating: 5,
                avatar: '👨‍💻',
              },
              {
                name: 'Елена В.',
                role: 'Писательница',
                text: 'Отличный источник вдохновения для моих историй. AI-персонажи помогают мне развивать сюжеты и создавать диалоги. Премиум подписка окупила себя за первый месяц!',
                rating: 5,
                avatar: '✍️',
              },
              {
                name: 'Дмитрий С.',
                role: 'Маркетолог',
                text: 'Пользуюсь уже полгода. Качество диалогов постоянно улучшается. Особенно нравятся персонажи для изучения языков - очень помогает в практике.',
                rating: 5,
                avatar: '🎯',
              },
              {
                name: 'Ольга Н.',
                role: 'Психолог',
                text: 'Удивительно, как AI может поддержать разговор на глубокие темы. Некоторые персонажи даже помогают мне лучше понять эмоциональные аспекты в работе.',
                rating: 5,
                avatar: '🧠',
              },
              {
                name: 'Александр Р.',
                role: 'Геймер',
                text: 'Фантастические RPG персонажи! Каждый со своей уникальной историей и характером. Провожу здесь больше времени, чем в обычных играх.',
                rating: 5,
                avatar: '🎮',
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className={`rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                  theme === 'dark'
                    ? 'bg-gray-700 border border-gray-600'
                    : 'bg-gray-50 border border-gray-200'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Quote Icon */}
                <div className="mb-4">
                  <Quote
                    className={`w-8 h-8 ${
                      theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
                    }`}
                  />
                </div>

                {/* Stars Rating */}
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-500 fill-current"
                    />
                  ))}
                </div>

                {/* Text */}
                <p
                  className={`mb-6 leading-relaxed ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  "{testimonial.text}"
                </p>

                {/* Author */}
                <div className="flex items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mr-4 ${
                      theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                    }`}
                  >
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div
                      className={`font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {testimonial.name}
                    </div>
                    <div
                      className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Выберите свой план
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Начните бесплатно или выберите премиум для полного доступа
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="bg-gray-50 rounded-2xl p-8 relative">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Бесплатный
                </h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold text-gray-900">$0</span>
                  <span className="text-gray-600 ml-2">/месяц</span>
                </div>
                <p className="text-gray-600">Попробуйте основные возможности</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  </div>
                  <span className="text-gray-700">10 сообщений в день</span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  </div>
                  <span className="text-gray-700">
                    Доступ к базовым персонажам
                  </span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  </div>
                  <span className="text-gray-700">Стандартные ответы</span>
                </li>
              </ul>

              <Button
                variant="outline"
                className="w-full"
                onClick={handleGetStarted}
              >
                Начать бесплатно
              </Button>
            </div>

            {/* Premium Plan */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 relative text-white">
              {/* Popular Badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-bold flex items-center">
                  <Crown className="w-4 h-4 mr-1" />
                  Популярный
                </div>
              </div>

              <div className="mb-8 mt-4">
                <h3 className="text-2xl font-bold mb-2">Премиум</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold">$9.99</span>
                  <span className="opacity-80 ml-2">/месяц</span>
                </div>
                <p className="opacity-90">Полный доступ ко всем функциям</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <span>Неограниченные сообщения</span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <span>Доступ ко всем персонажам</span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <span>NSFW контент</span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <span>Создание собственных персонажей</span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <span>Приоритетная поддержка</span>
                </li>
              </ul>

              <Button
                className="w-full bg-white text-blue-600 hover:bg-gray-100 transition-colors duration-300"
                onClick={() => openAuthModal('register')}
              >
                <Zap className="w-4 h-4 mr-2" />
                Получить Премиум
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Готовы начать новое приключение?
            </h2>
            <p className="text-xl mb-10 opacity-90 leading-relaxed">
              Присоединяйтесь к тысячам пользователей, которые уже открыли для
              себя удивительный мир AI-общения. Ваш идеальный собеседник ждет
              вас!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                onClick={handleGetStarted}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Начать сейчас
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <Link
                to="/gallery"
                className="inline-flex items-center justify-center px-8 py-4 border border-white/30 text-white bg-transparent hover:bg-white/10 backdrop-blur-sm rounded-md font-medium transition-all duration-300"
              >
                Изучить персонажей
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`py-16 border-t ${
          theme === 'dark'
            ? 'bg-gray-900 border-gray-800'
            : 'bg-gray-50 border-gray-200'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <span
                  className={`font-bold text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                >
                  AI Chat
                </span>
              </div>
              <p
                className={`mb-6 leading-relaxed max-w-md ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Революционная платформа для общения с AI-персонажами. Создавайте
                уникальные диалоги и исследуйте безграничные возможности
                искусственного интеллекта.
              </p>

              {/* Social Links */}
              <div className="flex space-x-4">
                {[
                  { name: 'Twitter', icon: '🐦', url: '#' },
                  { name: 'Discord', icon: '💬', url: '#' },
                  { name: 'Reddit', icon: '📱', url: '#' },
                  { name: 'GitHub', icon: '💻', url: '#' },
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                      theme === 'dark'
                        ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-900'
                    }`}
                    title={social.name}
                  >
                    <span className="text-lg">{social.icon}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation Links */}
            <div>
              <h3
                className={`font-semibold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}
              >
                Навигация
              </h3>
              <ul className="space-y-3">
                {[
                  { name: 'Главная', url: '/' },
                  { name: 'Персонажи', url: '/gallery' },
                  { name: 'Цены', url: '/pricing' },
                  { name: 'О нас', url: '/about' },
                  { name: 'Блог', url: '/blog' },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.url}
                      className={`transition-colors ${
                        theme === 'dark'
                          ? 'text-gray-400 hover:text-white'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support & Legal */}
            <div>
              <h3
                className={`font-semibold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}
              >
                Поддержка
              </h3>
              <ul className="space-y-3">
                {[
                  { name: 'Центр помощи', url: '/help' },
                  { name: 'Связаться с нами', url: '/contact' },
                  { name: 'Политика конфиденциальности', url: '/privacy' },
                  { name: 'Условия использования', url: '/terms' },
                  { name: 'API документация', url: '/api-docs' },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.url}
                      className={`transition-colors ${
                        theme === 'dark'
                          ? 'text-gray-400 hover:text-white'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div
            className={`pt-8 border-t flex flex-col md:flex-row items-center justify-between ${
              theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
            }`}
          >
            <div
              className={`text-sm mb-4 md:mb-0 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              © 2024 AI Chat. Все права защищены.
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <Link
                to="/terms"
                className={`transition-colors ${
                  theme === 'dark'
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Условия
              </Link>
              <Link
                to="/privacy"
                className={`transition-colors ${
                  theme === 'dark'
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Конфиденциальность
              </Link>
              <Link
                to="/cookies"
                className={`transition-colors ${
                  theme === 'dark'
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => openAuthModal('register')}
        onForgotPassword={() => {
          /* TODO: Implement forgot password */
        }}
      />

      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={() => openAuthModal('login')}
      />
    </div>
  );
};

export default HomePage;
