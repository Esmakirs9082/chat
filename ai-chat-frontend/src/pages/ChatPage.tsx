import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  MessageCircle, 
  Users, 
  Settings, 
  Menu, 
  X, 
  Search,
  Plus,
  MoreHorizontal,
  ArrowLeft,
  Star,
  Archive
} from 'lucide-react';
import { ChatInterface } from '../components/chat';
import { ProtectedRoute } from '../components/auth';
import { Avatar, Button, Input } from '../components/ui';
import { useCharacterStore } from '../stores/characterStore';
import { useChatStore } from '../stores/chatStore';
import { cn } from '../utils';

interface ChatSidebarItem {
  id: string;
  characterId: string;
  characterName: string;
  characterAvatar?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isPinned: boolean;
}

const ChatPage: React.FC = () => {
  const { characterId } = useParams<{ characterId?: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const { characters } = useCharacterStore();
  const { chats, activeChat, createChat, setActiveChat } = useChatStore();

  // Мок данные для чатов
  const mockChats: ChatSidebarItem[] = [
    {
      id: 'chat-1',
      characterId: '1',
      characterName: 'Алиса',
      characterAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=100',
      lastMessage: 'Привет! Как дела?',
      timestamp: '2 мин',
      unreadCount: 2,
      isPinned: true
    },
    {
      id: 'chat-2', 
      characterId: '2',
      characterName: 'Макс',
      characterAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      lastMessage: 'Увидимся завтра!',
      timestamp: '1 ч',
      unreadCount: 0,
      isPinned: false
    },
    {
      id: 'chat-3',
      characterId: '3', 
      characterName: 'София',
      characterAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      lastMessage: 'Что думаешь об этом?',
      timestamp: '3 ч',
      unreadCount: 1,
      isPinned: false
    }
  ];

  const filteredChats = mockChats.filter(chat =>
    chat.characterName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedChats = filteredChats.filter(chat => chat.isPinned);
  const regularChats = filteredChats.filter(chat => !chat.isPinned);

  const currentCharacterId = characterId || selectedChatId || mockChats[0]?.characterId || 'demo-character-1';

  useEffect(() => {
    if (characterId) {
      setSelectedChatId(characterId);
    }
  }, [characterId]);

  const handleChatSelect = (chatId: string, charId: string) => {
    setSelectedChatId(charId);
    setSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ProtectedRoute>
      <div className="h-screen flex bg-gray-50 overflow-hidden">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={cn(
          "flex flex-col bg-white border-r border-gray-200 z-50 transition-all duration-300",
          "lg:relative lg:translate-x-0",
          sidebarOpen 
            ? "fixed inset-y-0 left-0 w-80 translate-x-0" 
            : "fixed inset-y-0 left-0 w-80 -translate-x-full lg:w-80 lg:translate-x-0"
        )}>
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <MessageCircle className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Чаты</h1>
            </div>
            
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="p-2"
                title="Новый чат"
              >
                <Plus className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="p-2 lg:hidden"
                onClick={() => setSidebarOpen(false)}
                title="Закрыть"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Поиск чатов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full"
              />
            </div>
          </div>

          {/* Chat Tabs */}
          <div className="flex border-b border-gray-100">
            <button className="flex-1 px-4 py-3 text-sm font-medium text-blue-600 border-b-2 border-blue-600 bg-blue-50">
              Активные
            </button>
            <button className="flex-1 px-4 py-3 text-sm font-medium text-gray-500 hover:text-gray-700">
              <Archive className="w-4 h-4 inline mr-1" />
              Архив
            </button>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {/* Pinned Chats */}
            {pinnedChats.length > 0 && (
              <div>
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
                  Закрепленные
                </div>
                <div className="space-y-1 p-2">
                  {pinnedChats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => handleChatSelect(chat.id, chat.characterId)}
                      className={cn(
                        "flex items-center p-3 rounded-lg cursor-pointer transition-colors group",
                        selectedChatId === chat.characterId
                          ? "bg-blue-100 border border-blue-200"
                          : "hover:bg-gray-50"
                      )}
                    >
                      <div className="relative flex-shrink-0">
                        <Avatar
                          src={chat.characterAvatar}
                          fallback={chat.characterName}
                          size="md"
                          className="ring-2 ring-white"
                        />
                        <div className="absolute -top-1 -right-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0 ml-3">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {chat.characterName}
                          </p>
                          <p className="text-xs text-gray-500">{chat.timestamp}</p>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                      </div>

                      {chat.unreadCount > 0 && (
                        <div className="ml-2 bg-blue-600 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                          {chat.unreadCount}
                        </div>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Regular Chats */}
            {regularChats.length > 0 && (
              <div>
                {pinnedChats.length > 0 && (
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
                    Все чаты
                  </div>
                )}
                <div className="space-y-1 p-2">
                  {regularChats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => handleChatSelect(chat.id, chat.characterId)}
                      className={cn(
                        "flex items-center p-3 rounded-lg cursor-pointer transition-colors group",
                        selectedChatId === chat.characterId
                          ? "bg-blue-100 border border-blue-200"
                          : "hover:bg-gray-50"
                      )}
                    >
                      <Avatar
                        src={chat.characterAvatar}
                        fallback={chat.characterName}
                        size="md"
                        className="flex-shrink-0"
                      />

                      <div className="flex-1 min-w-0 ml-3">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {chat.characterName}
                          </p>
                          <p className="text-xs text-gray-500">{chat.timestamp}</p>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                      </div>

                      {chat.unreadCount > 0 && (
                        <div className="ml-2 bg-blue-600 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                          {chat.unreadCount}
                        </div>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {filteredChats.length === 0 && (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery ? 'Чаты не найдены' : 'Нет активных чатов'}
                </h3>
                <p className="text-gray-500 mb-4 max-w-sm">
                  {searchQuery 
                    ? 'Попробуйте изменить поисковый запрос'
                    : 'Начните новый разговор с персонажем из галереи'
                  }
                </p>
                <Button 
                  className="mt-2"
                  onClick={() => window.location.href = '/gallery'}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Выбрать персонажа
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar Footer */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <Avatar
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40"
                fallback="Пользователь"
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Пользователь</p>
                <p className="text-xs text-gray-500">Премиум аккаунт</p>
              </div>
              <Button variant="ghost" size="sm" className="p-2">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="p-2"
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center space-x-3">
              {characters.find(c => c.id === currentCharacterId) && (
                <>
                  <Avatar
                    src={characters.find(c => c.id === currentCharacterId)?.avatar}
                    fallback={characters.find(c => c.id === currentCharacterId)?.name}
                    size="sm"
                  />
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900">
                      {characters.find(c => c.id === currentCharacterId)?.name}
                    </h2>
                  </div>
                </>
              )}
            </div>

            <Button variant="ghost" size="sm" className="p-2">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </div>

          {/* Chat Interface */}
          <div className="flex-1 min-h-0">
            <ChatInterface 
              characterId={currentCharacterId}
              className="h-full"
            />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ChatPage;
