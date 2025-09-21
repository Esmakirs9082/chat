import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Star,
  Users,
  Share,
  MoreHorizontal,
  Flag,
  Calendar,
  Tag,
  TrendingUp,
  Clock,
  X,
} from 'lucide-react';
import { Character } from '../../types';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

interface CharacterProfileProps {
  character: Character;
  isOpen: boolean;
  onClose: () => void;
  onStartChat: () => void;
}

type TabType = 'about' | 'personality' | 'reviews' | 'chats';

const CharacterProfile: React.FC<CharacterProfileProps> = ({
  character,
  isOpen,
  onClose,
  onStartChat,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('about');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // Mock data for demo
  const stats = {
    totalChats: 1247,
    favorites: 892,
    rating: 4.8,
    reviews: 156,
  };

  const personalityTraits = [
    { name: 'Открытость', value: 85, color: 'bg-blue-500' },
    { name: 'Добросовестность', value: 72, color: 'bg-green-500' },
    { name: 'Экстраверсия', value: 91, color: 'bg-yellow-500' },
    { name: 'Доброжелательность', value: 88, color: 'bg-purple-500' },
    { name: 'Эмоциональная стабильность', value: 76, color: 'bg-red-500' },
  ];

  const mockReviews = [
    {
      id: 1,
      user: 'Alex_92',
      rating: 5,
      comment:
        'Отличный персонаж! Очень интересные диалоги и глубокая проработка.',
      date: '2025-09-15',
    },
    {
      id: 2,
      user: 'Maria_K',
      rating: 4,
      comment: 'Хороший собеседник, но иногда слишком серьезный.',
      date: '2025-09-10',
    },
    {
      id: 3,
      user: 'DarkLord99',
      rating: 5,
      comment: 'Лучший AI-персонаж, с которым я общался!',
      date: '2025-09-08',
    },
  ];

  const mockChats = [
    {
      id: 1,
      preview: 'Привет! Как дела? Я сегодня изучал квантовую физику...',
      date: '2025-09-18',
      duration: '45 мин',
    },
    {
      id: 2,
      preview: 'Расскажи мне о своих увлечениях...',
      date: '2025-09-17',
      duration: '1 ч 20 мин',
    },
    {
      id: 3,
      preview: 'Что думаешь о последних новостях в области ИИ?',
      date: '2025-09-16',
      duration: '32 мин',
    },
  ];

  const tabs = [
    { id: 'about', label: 'О персонаже' },
    { id: 'personality', label: 'Личность' },
    { id: 'reviews', label: `Отзывы (${stats.reviews})` },
    { id: 'chats', label: 'Чаты' },
  ];

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const renderPersonalityChart = () => (
    <div className="space-y-4">
      {personalityTraits.map((trait, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {trait.name}
            </span>
            <span className="text-sm text-gray-500">{trait.value}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className={`${trait.color} h-3 rounded-full transition-all duration-500`}
              style={{ width: `${trait.value}%` }}
            />
          </div>
        </div>
      ))}

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
          Анализ личности
        </h4>
        <p className="text-sm text-blue-800 dark:text-blue-200">
          Высокие показатели экстраверсии и открытости делают этого персонажа
          отличным собеседником для живых и познавательных бесед.
        </p>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'about':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Описание</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {character.description}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Теги</h3>
              <div className="flex flex-wrap gap-2">
                {character.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center text-gray-500 dark:text-gray-400 mb-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">Создан</span>
                </div>
                <p className="font-semibold">15 сентября 2025</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center text-gray-500 dark:text-gray-400 mb-1">
                  <Users className="w-4 h-4 mr-2" />
                  <span className="text-sm">Категория</span>
                </div>
                <p className="font-semibold">Компаньон</p>
              </div>
            </div>
          </div>
        );

      case 'personality':
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Черты личности</h3>
            {renderPersonalityChart()}
          </div>
        );

      case 'reviews':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Отзывы пользователей</h3>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="font-semibold">{stats.rating}</span>
                <span className="text-gray-500">({stats.reviews} отзывов)</span>
              </div>
            </div>

            <div className="space-y-4">
              {mockReviews.map((review) => (
                <div
                  key={review.id}
                  className="border-b border-gray-200 dark:border-gray-700 pb-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{review.user}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'chats':
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Последние чаты</h3>
            <div className="space-y-3">
              {mockChats.map((chat) => (
                <div
                  key={chat.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{chat.date}</span>
                      <span>•</span>
                      <span>{chat.duration}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                    {chat.preview}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-600 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start space-x-4">
            <img
              src={character.avatar}
              alt={character.name}
              className="w-24 h-24 rounded-full border-4 border-white/20"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">{character.name}</h2>
              <p className="text-white/80 mb-4">
                от {character.createdBy || 'AI Studio'}
              </p>

              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{stats.totalChats.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="w-4 h-4" />
                  <span>{stats.favorites.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{stats.rating}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-3">
              <Button
                onClick={onStartChat}
                className="bg-white text-purple-600 hover:bg-gray-100"
              >
                Начать чат
              </Button>

              <button
                onClick={handleFavorite}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <Heart
                  className={`w-5 h-5 ${isFavorite ? 'fill-current text-red-300' : ''}`}
                />
              </button>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>

              {showMoreMenu && (
                <div className="absolute right-0 top-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 w-48 z-10">
                  <button className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2">
                    <Share className="w-4 h-4" />
                    <span>Поделиться</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 text-red-600">
                    <Flag className="w-4 h-4" />
                    <span>Пожаловаться</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-96 overflow-y-auto">{renderTabContent()}</div>
      </div>
    </Modal>
  );
};

export default CharacterProfile;
