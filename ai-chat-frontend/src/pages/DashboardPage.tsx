import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  MessageCircle,
  Heart,
  Star,
  Settings,
  TrendingUp,
  Crown,
  ChevronLeft,
  ChevronRight,
  Users,
  Calendar,
  BarChart3,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import AuthGuard from '../components/auth/AuthGuard';
import { Button } from '../components/ui';
import { cn } from '../utils/index';
import { useSettingsStore } from '../stores/settingsStore';
import { useAuthStore } from '../stores/authStore';
import { useChatStore } from '../stores/chatStore';
import { useCharacterStore } from '../stores/characterStore';
import type { Character } from '../types';
import type { Chat } from '../types/chat';

// Компонент карточки статистики
const StatCard: React.FC<{
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  trend?: string;
}> = ({ title, value, icon, color, trend }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
    <div className="flex items-center justify-between mb-4">
      <div
        className={cn(
          'w-12 h-12 rounded-lg flex items-center justify-center',
          color
        )}
      >
        {icon}
      </div>
      {trend && (
        <div className="flex items-center text-sm text-green-600 dark:text-green-400">
          <TrendingUp className="w-4 h-4 mr-1" />
          {trend}
        </div>
      )}
    </div>
    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
      {value}
    </div>
    <div className="text-sm text-gray-600 dark:text-gray-400">{title}</div>
  </div>
);

// Упрощенный компонент недавнего чата
const RecentChatItem: React.FC<{ chat: Chat; onClick: () => void }> = ({
  chat,
  onClick,
}) => (
  <div
    onClick={onClick}
    className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
  >
    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-medium text-sm mr-3">
      {chat.title?.[0] || 'C'}
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
        {chat.title || 'Чат'}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
        {chat.messages?.[chat.messages.length - 1]?.content || 'Нет сообщений'}
      </div>
    </div>
    <div className="text-xs text-gray-400 dark:text-gray-500">
      {new Date(chat.lastMessageAt || Date.now()).toLocaleDateString()}
    </div>
  </div>
);

// Карточка персонажа для карусели
const FavoriteCharacterCard: React.FC<{
  character: Character;
  onClick: () => void;
}> = ({ character, onClick }) => (
  <div
    onClick={onClick}
    className="flex-shrink-0 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-4 cursor-pointer hover:shadow-md transition-shadow"
  >
    <div className="w-full h-32 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg mb-3 flex items-center justify-center">
      {character.avatar ? (
        <img
          src={character.avatar}
          alt={character.name}
          className="w-16 h-16 rounded-full object-cover"
        />
      ) : (
        <Users className="w-16 h-16 text-purple-400" />
      )}
    </div>
    <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate mb-1">
      {character.name}
    </h3>
    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
      {character.description}
    </p>
  </div>
);

// Быстрое действие
const QuickAction: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}> = ({ title, description, icon, color, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6 cursor-pointer hover:shadow-md transition-shadow"
  >
    <div
      className={cn(
        'w-12 h-12 rounded-lg flex items-center justify-center mb-4',
        color
      )}
    >
      {icon}
    </div>
    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
      {title}
    </h3>
    <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
  </div>
);

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [carouselIndex, setCarouselIndex] = useState(0);

  const { theme } = useSettingsStore();
  const { user, subscription } = useAuthStore();
  const { chats } = useChatStore();
  const { characters, favorites } = useCharacterStore();

  // Статистика
  const stats = {
    totalChats: chats.length,
    totalMessages: chats.reduce(
      (acc, chat) => acc + (chat.messages?.length || 0),
      0
    ),
    favorites: favorites.length,
  };

  // Недавние чаты (последние 5)
  const recentChats = chats
    .sort(
      (a, b) =>
        new Date(b.lastMessageAt || 0).getTime() -
        new Date(a.lastMessageAt || 0).getTime()
    )
    .slice(0, 5);

  // Любимые персонажи
  const favoriteCharacters = characters.filter((c) => favorites.includes(c.id));

  // Статус подписки
  const isPremium = subscription === 'premium';

  // Навигация карусели
  const handleCarouselNext = () => {
    if (carouselIndex < favoriteCharacters.length - 3) {
      setCarouselIndex(carouselIndex + 1);
    }
  };

  const handleCarouselPrev = () => {
    if (carouselIndex > 0) {
      setCarouselIndex(carouselIndex - 1);
    }
  };

  return (
    <AuthGuard requirePremium={false}>
      <div
        className={cn(
          'min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200',
          theme === 'dark' && 'dark'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Добро пожаловать, {user?.username || 'Пользователь'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Ваш персональный дашборд
            </p>
          </header>

          {/* СТАТИСТИКА */}
          <section className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Всего чатов"
              value={stats.totalChats}
              icon={<MessageCircle className="w-6 h-6 text-white" />}
              color="bg-blue-500"
              trend="+12%"
            />
            <StatCard
              title="Сообщений"
              value={stats.totalMessages}
              icon={<BarChart3 className="w-6 h-6 text-white" />}
              color="bg-green-500"
              trend="+8%"
            />
            <StatCard
              title="Избранные"
              value={stats.favorites}
              icon={<Heart className="w-6 h-6 text-white" />}
              color="bg-red-500"
            />
          </section>

          {/* ОСНОВНОЙ КОНТЕНТ - ДВУХКОЛОНОЧНАЯ СЕТКА */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* ЛЕВАЯ КОЛОНКА - RECENT CHATS */}
            <div className="lg:col-span-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Недавние чаты
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/chat')}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {recentChats.length > 0 ? (
                    recentChats.map((chat) => (
                      <RecentChatItem
                        key={chat.id}
                        chat={chat}
                        onClick={() => navigate(`/chat/${chat.id}`)}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">Нет недавних чатов</p>
                      <Button
                        size="sm"
                        onClick={() => navigate('/characters')}
                        className="mt-3"
                      >
                        Начать чат
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ПРАВАЯ КОЛОНКА */}
            <div className="lg:col-span-8 space-y-8">
              {/* FAVORITE CHARACTERS CAROUSEL */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Любимые персонажи
                  </h2>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCarouselPrev}
                      disabled={
                        carouselIndex <= 0 || favoriteCharacters.length <= 3
                      }
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCarouselNext}
                      disabled={
                        carouselIndex >=
                        Math.max(0, favoriteCharacters.length - 3)
                      }
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/characters')}
                    >
                      Все
                    </Button>
                  </div>
                </div>

                {favoriteCharacters.length > 0 ? (
                  <div className="flex space-x-4 overflow-hidden">
                    {favoriteCharacters
                      .slice(carouselIndex, carouselIndex + 3)
                      .map((character) => (
                        <FavoriteCharacterCard
                          key={character.id}
                          character={character}
                          onClick={() =>
                            navigate(`/chat/character/${character.id}`)
                          }
                        />
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <Heart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">
                      Нет избранных персонажей
                    </h3>
                    <p className="text-sm mb-4">
                      Добавьте персонажей в избранное из галереи
                    </p>
                    <Button
                      onClick={() => navigate('/characters')}
                      className="bg-gradient-to-r from-purple-500 to-pink-500"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Найти персонажей
                    </Button>
                  </div>
                )}
              </div>

              {/* SUBSCRIPTION STATUS CARD */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden">
                <div
                  className={cn(
                    'p-6',
                    isPremium
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                      : 'bg-gradient-to-r from-gray-500 to-gray-600'
                  )}
                >
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center space-x-3">
                      <Crown className="w-8 h-8" />
                      <div>
                        <h3 className="text-xl font-semibold">
                          {isPremium ? 'Premium подписка' : 'Бесплатный тариф'}
                        </h3>
                        <p className="text-white/80">
                          {isPremium
                            ? 'Безлимитные чаты и премиум функции'
                            : 'Ограниченный доступ к функциям'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        {isPremium ? '$19.99' : 'Бесплатно'}
                      </div>
                      <div className="text-white/80 text-sm">
                        {isPremium ? 'в месяц' : ''}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {isPremium
                        ? 'Управляйте своей подпиской и настройками'
                        : 'Обновитесь до Premium для полного доступа'}
                    </div>
                    <Button
                      variant={isPremium ? 'outline' : 'primary'}
                      onClick={() => navigate('/subscription')}
                    >
                      {isPremium ? 'Управлять' : 'Обновить'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <section className="mt-10">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Быстрые действия
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <QuickAction
                title="Новый чат"
                description="Начать разговор с персонажем"
                icon={<Plus className="w-6 h-6 text-white" />}
                color="bg-blue-500"
                onClick={() => navigate('/characters')}
              />
              <QuickAction
                title="Создать персонажа"
                description="Создать уникального компаньона"
                icon={<Users className="w-6 h-6 text-white" />}
                color="bg-purple-500"
                onClick={() => navigate('/characters/create')}
              />
              <QuickAction
                title="Настройки"
                description="Персонализировать опыт"
                icon={<Settings className="w-6 h-6 text-white" />}
                color="bg-green-500"
                onClick={() => navigate('/settings')}
              />
            </div>
          </section>
        </div>
      </div>
    </AuthGuard>
  );
};

export default DashboardPage;
