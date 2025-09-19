import React from 'react';
import { Heart, MessageCircle, Users, Crown, Settings, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useChatStore } from '../stores/chatStore';
import { useCharacterStore } from '../stores/characterStore';
import { Button, Avatar, Badge, Input } from '../components/ui';
import { CharacterCard } from '../components/character';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { user, subscription } = useAuthStore();
  const { chats } = useChatStore();
  const { characters, favorites, isFavorite } = useCharacterStore();

  // Статистика чатов
  const chatStats = {
    total: chats.length,
    messages: chats.reduce((acc, chat) => acc + (chat.messages?.length || 0), 0),
    active: chats.length,
    archived: 0,
  };

  // Любимые персонажи
  const favoriteCharacters = characters.filter(c => favorites.includes(c.id));

  // Subscription status
  const subStatus = subscription === 'premium'
    ? { label: 'Premium', color: 'bg-gradient-to-r from-purple-500 to-pink-500', price: '$19.99', icon: <Crown className="w-5 h-5" /> }
    : subscription === 'basic'
      ? { label: 'Basic', color: 'bg-gradient-to-r from-blue-500 to-purple-500', price: '$9.99', icon: <Crown className="w-5 h-5" /> }
      : { label: 'Free', color: 'bg-gray-200', price: '$0', icon: <Users className="w-5 h-5" /> };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center space-x-4">
            <Avatar src={user?.avatar} fallback={user?.username || 'Пользователь'} size="lg" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Добро пожаловать, {user?.username || 'Пользователь'}!</h1>
              <p className="text-gray-500">Ваш персональный дашборд</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="p-2">
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        {/* Статистика чатов */}
        <section className="mb-10 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <MessageCircle className="w-8 h-8 text-blue-600 mb-2" />
            <div className="text-3xl font-bold text-gray-900">{chatStats.total}</div>
            <div className="text-sm text-gray-500">Всего чатов</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <Users className="w-8 h-8 text-purple-600 mb-2" />
            <div className="text-3xl font-bold text-gray-900">{chatStats.active}</div>
            <div className="text-sm text-gray-500">Активных чатов</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <Heart className="w-8 h-8 text-red-500 mb-2" />
            <div className="text-3xl font-bold text-gray-900">{favoriteCharacters.length}</div>
            <div className="text-sm text-gray-500">Любимых персонажей</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <MessageCircle className="w-8 h-8 text-green-500 mb-2" />
            <div className="text-3xl font-bold text-gray-900">{chatStats.messages}</div>
            <div className="text-sm text-gray-500">Всего сообщений</div>
          </div>
        </section>

        {/* Любимые персонажи */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Любимые персонажи</h2>
            <Link to="/characters">
              <Button variant="ghost" size="sm">
                Все персонажи <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          {favoriteCharacters.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {favoriteCharacters.map(character => (
                <CharacterCard 
                  key={character.id} 
                  character={character} 
                  onSelect={() => {
                    window.location.href = `/chat/${character.id}`;
                  }}
                  showStats={true}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
              У вас пока нет любимых персонажей. Добавьте их из галереи!
            </div>
          )}
        </section>

        {/* Subscription status */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Статус подписки</h2>
          <div className={`flex items-center p-6 rounded-xl shadow bg-white ${subStatus.color}`}>
            {subStatus.icon}
            <div className="ml-4">
              <div className="text-lg font-bold">{subStatus.label}</div>
              <div className="text-gray-600">{subStatus.price} / месяц</div>
            </div>
            <div className="ml-auto">
              <Link to="/subscription">
                <Button variant="primary">Управлять подпиской</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Account settings */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Настройки аккаунта</h2>
          <div className="bg-white rounded-xl shadow p-6 max-w-lg">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Имя пользователя</label>
              <Input defaultValue={user?.username || ''} disabled className="w-full" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input defaultValue={user?.email || ''} disabled className="w-full" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Статус подписки</label>
              <Badge variant="success">{subStatus.label}</Badge>
            </div>
            <Button variant="secondary" className="w-full">Изменить пароль</Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
