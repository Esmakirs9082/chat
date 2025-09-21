import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from 'react';
import {
  Search,
  Plus,
  X,
  MoreHorizontal,
  Archive,
  Trash2,
  Edit2,
} from 'lucide-react';
import { Sparkles } from 'lucide-react';
import { cn } from '../../utils';
import Button from '../ui/Button';
import Input from '../ui/Input';

// Типы данных
interface Chat {
  id: string;
  title: string;
  characterId: string;
  characterName: string;
  characterAvatar?: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  isArchived: boolean;
}

interface ChatSidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  onSelectChat: (chatId: string) => void;
  activeChatId?: string;
  className?: string;
  onOpenCharacterCreator?: () => void;
}

// Группировка чатов по дате
const groupChatsByDate = (chats: Chat[]) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  return chats.reduce((groups: Record<string, Chat[]>, chat) => {
    const chatDate = new Date(chat.timestamp);

    let group: string;
    if (chatDate >= today) {
      group = 'Сегодня';
    } else if (chatDate >= yesterday) {
      group = 'Вчера';
    } else if (chatDate >= weekAgo) {
      group = 'Эта неделя';
    } else {
      group = 'Ранее';
    }

    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(chat);
    return groups;
  }, {});
};

// Компонент элемента чата
interface ChatItemProps {
  chat: Chat;
  isActive: boolean;
  onSelect: (chatId: string) => void;
  onArchive: (chatId: string) => void;
  onDelete: (chatId: string) => void;
  onRename: (chatId: string) => void;
}

const ChatItem: React.FC<ChatItemProps> = ({
  chat,
  isActive,
  onSelect,
  onArchive,
  onDelete,
  onRename,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const itemRef = useRef<HTMLDivElement>(null);

  // Форматирование времени
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 24 * 60 * 60 * 1000) {
      return date.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (diff < 7 * 24 * 60 * 60 * 1000) {
      return date.toLocaleDateString('ru-RU', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
      });
    }
  };

  // Swipe to delete для mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const currentX = e.touches[0].clientX;
    const diff = startX.current - currentX;

    if (diff > 0 && diff < 100) {
      setSwipeOffset(diff);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);

    if (swipeOffset > 60) {
      onDelete(chat.id);
    }

    setSwipeOffset(0);
  };

  return (
    <div
      ref={itemRef}
      className={cn(
        'relative overflow-hidden transition-all duration-200',
        'hover:bg-gray-50 cursor-pointer group',
        isActive && 'bg-blue-50 border-r-2 border-blue-500'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ transform: `translateX(-${swipeOffset}px)` }}
    >
      <div
        className="flex items-center space-x-3 p-3 min-h-[70px]"
        onClick={() => onSelect(chat.id)}
      >
        {/* Character Avatar */}
        <div className="flex-shrink-0">
          {chat.characterAvatar ? (
            <img
              src={chat.characterAvatar}
              alt={chat.characterName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {chat.characterName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {/* Unread indicator */}
          {chat.unreadCount > 0 && (
            <div className="absolute -mt-2 -mr-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
              </span>
            </div>
          )}
        </div>

        {/* Chat Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3
              className={cn(
                'font-medium text-sm truncate',
                isActive ? 'text-blue-900' : 'text-gray-900'
              )}
            >
              {chat.title}
            </h3>
            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
              {formatTime(chat.timestamp)}
            </span>
          </div>

          <p className="text-xs text-gray-500 truncate mt-1">
            {chat.lastMessage}
          </p>
        </div>

        {/* Context Menu Trigger */}
        {isHovered && (
          <div className="flex-shrink-0">
            <button
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
            >
              <MoreHorizontal className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        )}
      </div>

      {/* Context Menu */}
      {showMenu && (
        <div className="absolute right-2 top-12 z-10 bg-white rounded-lg shadow-lg border py-1 min-w-[120px]">
          <button
            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
            onClick={(e) => {
              e.stopPropagation();
              onRename(chat.id);
              setShowMenu(false);
            }}
          >
            <Edit2 className="w-3 h-3" />
            <span>Переименовать</span>
          </button>

          <button
            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
            onClick={(e) => {
              e.stopPropagation();
              onArchive(chat.id);
              setShowMenu(false);
            }}
          >
            <Archive className="w-3 h-3" />
            <span>Архивировать</span>
          </button>

          <button
            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-red-600 flex items-center space-x-2"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(chat.id);
              setShowMenu(false);
            }}
          >
            <Trash2 className="w-3 h-3" />
            <span>Удалить</span>
          </button>
        </div>
      )}

      {/* Swipe Delete Button */}
      {swipeOffset > 0 && (
        <div
          className="absolute right-0 top-0 h-full bg-red-500 flex items-center justify-center px-4"
          style={{ width: `${swipeOffset}px` }}
        >
          <Trash2 className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
};

// Главный компонент ChatSidebar
const ChatSidebar: React.FC<ChatSidebarProps> = ({
  isOpen,
  onClose,
  onSelectChat,
  activeChatId,
  className,
  onOpenCharacterCreator,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Загрузка чатов (mock данные)
  useEffect(() => {
    // TODO: Заменить на реальный API вызов
    const mockChats: Chat[] = Array.from({ length: 20 }, (_, i) => ({
      id: `chat-${i}`,
      title: `Чат с персонажем ${i + 1}`,
      characterId: `char-${i}`,
      characterName: `Персонаж ${i + 1}`,
      characterAvatar:
        i % 3 === 0
          ? undefined
          : `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
      lastMessage: `Последнее сообщение в чате ${i + 1}...`,
      timestamp: new Date(Date.now() - i * 60 * 60 * 1000),
      unreadCount: i % 4 === 0 ? Math.floor(Math.random() * 5) : 0,
      isArchived: false,
    }));

    setChats(mockChats);
  }, []);

  // Фильтрация чатов по поиску
  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return chats.filter((chat) => !chat.isArchived);

    return chats.filter(
      (chat) =>
        !chat.isArchived &&
        (chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          chat.characterName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [chats, searchQuery]);

  // Группировка отфильтрованных чатов
  const groupedChats = useMemo(() => {
    return groupChatsByDate(filteredChats);
  }, [filteredChats]);

  // Infinite scroll
  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

    if (
      scrollTop + clientHeight >= scrollHeight - 100 &&
      hasMore &&
      !isLoading
    ) {
      setIsLoading(true);
      // TODO: Загрузить больше чатов
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, [hasMore, isLoading]);

  // Обработчики действий
  const handleNewChat = () => {
    // TODO: Открыть модал создания нового чата
    console.log('Создать новый чат');
  };

  const handleArchive = (chatId: string) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId ? { ...chat, isArchived: true } : chat
      )
    );
  };

  const handleDelete = (chatId: string) => {
    setChats((prev) => prev.filter((chat) => chat.id !== chatId));
  };

  const handleRename = (chatId: string) => {
    // TODO: Открыть модал переименования
    console.log('Переименовать чат:', chatId);
  };

  // Закрытие по клику на backdrop (mobile)
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={handleBackdropClick}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-50 transition-transform duration-300 ease-in-out',
          'w-80 lg:w-72',
          'lg:relative lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Чаты</h2>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNewChat}
              className="p-2"
              title="Новый чат"
            >
              <Plus className="w-4 h-4" />
            </Button>
            {onOpenCharacterCreator && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenCharacterCreator()}
                className="p-2"
                title="Создать персонажа"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
              </Button>
            )}

            {/* Close button (mobile only) */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2 lg:hidden"
              title="Закрыть"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Поиск чатов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Chat List */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto"
          onScroll={handleScroll}
        >
          {Object.entries(groupedChats).map(([group, groupChats]) => (
            <div key={group}>
              {/* Group Header */}
              <div className="sticky top-0 bg-gray-50 px-4 py-2 border-b border-gray-100">
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {group}
                </h3>
              </div>

              {/* Chats in Group */}
              {groupChats.map((chat) => (
                <ChatItem
                  key={chat.id}
                  chat={chat}
                  isActive={chat.id === activeChatId}
                  onSelect={onSelectChat}
                  onArchive={handleArchive}
                  onDelete={handleDelete}
                  onRename={handleRename}
                />
              ))}
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="p-4 text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Empty state */}
          {filteredChats.length === 0 && !isLoading && (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-2">
                <Search className="w-12 h-12 mx-auto" />
              </div>
              <p className="text-gray-500 text-sm">
                {searchQuery ? 'Чаты не найдены' : 'У вас пока нет чатов'}
              </p>
              {!searchQuery && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleNewChat}
                  className="mt-4"
                >
                  Создать первый чат
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatSidebar;
