import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Menu,
  X,
  MessageSquare,
  Users,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { cn } from '../utils';
import { useSettingsStore } from '../stores/settingsStore';
import { useChatStore } from '../stores/chatStore';
import { useCharacterStore } from '../stores/characterStore';
import { ChatInterface } from '../components/chat';
import ChatSidebar from '../components/chat/ChatSidebar';
import AuthGuard from '../components/auth/AuthGuard';

// Компонент заглушки для пустого состояния
const EmptyState: React.FC<{ onNavigateToCharacters: () => void }> = ({
  onNavigateToCharacters,
}) => {
  const { theme } = useSettingsStore();

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center mb-6">
          <MessageSquare className="w-12 h-12 text-purple-500 dark:text-purple-400" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Выберите персонажа для чата
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Создайте новый чат с любым персонажем или выберите из существующих
          диалогов
        </p>

        <div className="space-y-3">
          <Link
            to="/characters"
            className="block w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity"
          >
            <Users className="inline w-5 h-5 mr-2" />
            Выбрать персонажа
          </Link>

          <Link
            to="/characters/create"
            className="block w-full border border-purple-200 dark:border-purple-700 text-purple-600 dark:text-purple-400 font-semibold py-3 px-6 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
          >
            <Sparkles className="inline w-5 h-5 mr-2" />
            Создать персонажа
          </Link>
        </div>
      </div>
    </div>
  );
};

const ChatPage: React.FC = () => {
  const { chatId } = useParams<{ chatId?: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { theme } = useSettingsStore();
  const { activeChat, setActiveChat, chats } = useChatStore();
  const { characters } = useCharacterStore();

  useEffect(() => {
    if (chatId && chatId !== activeChat?.id) {
      setActiveChat(chatId);
    }
  }, [chatId, activeChat, setActiveChat]);

  const activeCharacterId = activeChat?.characterId;
  const activeCharacter = activeCharacterId
    ? characters.find((c) => c.id === activeCharacterId)
    : null;

  const handleSelectChat = (selectedChatId: string) => {
    setActiveChat(selectedChatId);
    window.history.pushState(null, '', `/chat/${selectedChatId}`);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <AuthGuard requirePremium={false}>
      <div
        className={cn(
          'min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-200',
          theme === 'dark' && 'dark'
        )}
      >
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              )}
            </button>

            {activeCharacter && (
              <div className="flex items-center space-x-3">
                {activeCharacter.avatar && (
                  <img
                    src={activeCharacter.avatar}
                    alt={activeCharacter.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <span className="font-medium text-gray-900 dark:text-white truncate max-w-32">
                  {activeCharacter.name}
                </span>
              </div>
            )}

            <Link
              to="/"
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </Link>
          </div>
        </div>

        <div
          className={cn(
            'fixed lg:static inset-y-0 left-0 z-40 transition-transform duration-300 ease-in-out',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full',
            'lg:translate-x-0'
          )}
        >
          <ChatSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onSelectChat={handleSelectChat}
            activeChatId={activeChat?.id}
            className="h-full w-80 lg:w-96"
          />
        </div>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="flex-1 flex flex-col lg:ml-0">
          <div className="lg:hidden h-16" />

          {activeCharacter && activeChat ? (
            <ChatInterface
              characterId={activeCharacter.id}
              className="flex-1"
            />
          ) : (
            <EmptyState
              onNavigateToCharacters={() =>
                (window.location.href = '/characters')
              }
            />
          )}
        </div>
      </div>
    </AuthGuard>
  );
};

export default ChatPage;
