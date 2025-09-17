import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Play, Star, Clock, MessageCircle, Zap, Users, TrendingUp, ArrowRight, Sparkles, Crown, Heart } from 'lucide-react';
import Button from '../components/ui/Button';
import { CharacterCard } from '../components/character';
import { useCharacterStore } from '../stores/characterStore';
import { useAuthStore } from '../stores/authStore';
import LoginModal from '../components/auth/LoginModal';
import RegisterModal from '../components/auth/RegisterModal';

const HomePage: React.FC = () => {
  const { characters } = useCharacterStore();
  const { isAuthenticated } = useAuthStore();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  
  const openAuthModal = (type: 'login' | 'register') => {
    if (type === 'login') {
      setShowLoginModal(true);
      setShowRegisterModal(false);
    } else {
      setShowRegisterModal(true);
      setShowLoginModal(false);
    }
  };
  
  // Получаем топ персонажей для показа
  const featuredCharacters = characters
    .filter(char => char.tags.includes('popular') || char.tags.includes('featured'))
    .slice(0, 6);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      // Перенаправляем в галерею если уже авторизован
      window.location.href = '/gallery';
    } else {
      openAuthModal('register');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 font-medium text-sm mb-8 animate-bounce">
              <Sparkles className="w-4 h-4 mr-2" />
              Новая эра AI-общения
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Общайтесь с
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent block">
                AI-персонажами
              </span>
              будущего
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
              Погрузитесь в увлекательные диалоги с уникальными AI-персонажами. 
              Каждый разговор — это новое приключение и эмоциональный опыт.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              <div className="flex items-center space-x-2 text-gray-600">
                <Users className="w-5 h-5 text-blue-500" />
                <span className="font-semibold">10,000+</span>
                <span>пользователей</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <MessageCircle className="w-5 h-5 text-purple-500" />
                <span className="font-semibold">50,000+</span>
                <span>диалогов</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
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
                className="inline-flex items-center justify-center px-8 py-4 border border-gray-300 text-gray-700 bg-transparent hover:bg-gray-50 active:bg-gray-100 rounded-md font-medium transition-all duration-300"
              >
                Смотреть персонажей
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Characters Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Популярные персонажи
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Познакомьтесь с самыми интересными AI-персонажами, 
              которые уже завоевали сердца тысяч пользователей
            </p>
          </div>

          {featuredCharacters.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredCharacters.map((character, index) => (
                <div
                  key={character.id}
                  className="transform transition-all duration-300 hover:-translate-y-2"
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <CharacterCard 
                    character={character}
                    onClick={() => {
                      if (isAuthenticated) {
                        window.location.href = `/chat/${character.id}`;
                      } else {
                        openAuthModal('login');
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <Users className="w-16 h-16 text-blue-500" />
              </div>
              <p className="text-gray-600 text-lg mb-6">
                Скоро здесь появятся удивительные персонажи!
              </p>
            </div>
          )}

          <div className="text-center">
            <Link 
              to="/gallery"
              className="inline-flex items-center justify-center px-8 py-4 border border-blue-300 text-blue-600 bg-transparent hover:bg-blue-50 rounded-md font-medium transition-all duration-300"
            >
              Посмотреть всех персонажей
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Почему выбирают нас?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Уникальные возможности для незабываемого общения с AI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Реалистичные диалоги
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Продвинутые AI-модели создают естественные и увлекательные разговоры, 
                адаптируясь под ваш стиль общения.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Эмоциональная связь
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Персонажи помнят ваши разговоры и развиваются вместе с вами, 
                создавая глубокие эмоциональные связи.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Безграничная фантазия
              </h3>
              <p className="text-gray-600 leading-relaxed">
                От романтических историй до захватывающих приключений — 
                исследуйте любые сценарии и темы.
              </p>
            </div>
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
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Бесплатный</h3>
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
                  <span className="text-gray-700">Доступ к базовым персонажам</span>
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
              Присоединяйтесь к тысячам пользователей, которые уже открыли для себя 
              удивительный мир AI-общения. Ваш идеальный собеседник ждет вас!
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

      {/* Auth Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => openAuthModal('register')}
        onForgotPassword={() => {/* TODO: Implement forgot password */}}
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