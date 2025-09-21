import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  AlertTriangle,
  Settings,
  MoreVertical,
  WifiOff,
  Wifi,
  Loader2,
} from 'lucide-react';
import { Avatar, Badge, Button } from '../ui';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useChatStore } from '../../stores/chatStore';
import { useCharacterStore } from '../../stores/characterStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { cn } from '../../utils';

interface ChatInterfaceProps {
  characterId: string;
  className?: string;
}

const ConnectionStatus = ({ status }: { status: string }) => (
  <div className="flex items-center gap-1 text-xs text-gray-500 ml-2">
    {status === 'connecting' && <Loader2 className="animate-spin w-4 h-4" />}
    {status === 'connected' && <Wifi className="w-4 h-4 text-green-500" />}
    {status === 'disconnected' && <WifiOff className="w-4 h-4 text-red-500" />}
    <span>
      {status === 'connecting'
        ? 'Подключение...'
        : status === 'connected'
          ? 'Онлайн'
          : 'Оффлайн'}
    </span>
  </div>
);

const NsfwOverlay = ({ onEnableNSFW, onChooseCharacter }: any) => (
  <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm z-50">
    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-8 text-center max-w-xs mx-auto">
      <div className="text-xl font-bold mb-2">
        Этот персонаж содержит контент 18+
      </div>
      <div className="text-sm mb-6 text-gray-600">
        Включите NSFW в настройках, чтобы продолжить
      </div>
      <button
        className="w-full mb-2 py-2 rounded bg-purple-600 text-white font-semibold"
        onClick={onEnableNSFW}
      >
        Включить в настройках
      </button>
      <button
        className="w-full py-2 rounded bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-gray-200 font-semibold"
        onClick={onChooseCharacter}
      >
        Выбрать другого персонажа
      </button>
    </div>
  </div>
);

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  characterId,
  className,
}) => {
  const { activeChat, sendMessage, typingUsers, createChat } = useChatStore();

  const { characters, selectedCharacter, setSelectedCharacter, showNsfw } =
    useCharacterStore();

  const { nsfwEnabled, toggleNSFW } = useSettingsStore();
  const [showNsfwWarning, setShowNsfwWarning] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    'connecting' | 'connected' | 'disconnected'
  >('disconnected');
  const wsRef = useRef<WebSocket | null>(null);
  const messageInputRef = useRef<any>(null);

  // Найти персонажа
  const character =
    characters.find((c) => c.id === characterId) || selectedCharacter;

  // Проверка NSFW предупреждения
  useEffect(() => {
    if (character?.isNsfw && !showNsfw) {
      setShowNsfwWarning(true);
    } else {
      setShowNsfwWarning(false);
    }
  }, [character?.isNsfw, showNsfw]);

  // Создание чата если его нет
  useEffect(() => {
    if (character && !activeChat) {
      createChat(character.id);
    }
    if (character) {
      setSelectedCharacter(character);
    }
  }, [character, activeChat, createChat, setSelectedCharacter]);

  // WebSocket подключение
  useEffect(() => {
    if (!activeChat?.id) return;
    setConnectionStatus('connecting');
    wsRef.current = new WebSocket(`wss://yourserver/ws/chat/${activeChat.id}`);
    wsRef.current.onopen = () => setConnectionStatus('connected');
    wsRef.current.onclose = () => setConnectionStatus('disconnected');
    wsRef.current.onerror = () => setConnectionStatus('disconnected');
    wsRef.current.onmessage = (e) => {
      // TODO: обработка входящих сообщений
    };
    return () => {
      wsRef.current?.close();
    };
  }, [activeChat?.id]);

  // Горячие клавиши
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // TODO: закрыть чат (например, вызвать onClose или navigate)
      }
      if (e.ctrlKey && e.key === 'Enter') {
        if (messageInputRef.current) {
          messageInputRef.current.sendMessage();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // NSFW overlay
  const showNsfwOverlay = character?.isNsfw && !nsfwEnabled;

  if (!character) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto" />
          <p className="text-gray-600">Персонаж не найден</p>
        </div>
      </div>
    );
  }

  // NSFW Warning Modal
  if (showNsfwWarning) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 space-y-6">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Контент для взрослых (18+)
            </h3>
            <p className="text-gray-600">
              Этот персонаж содержит контент для взрослых. Убедитесь, что вам
              исполнилось 18 лет.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              variant="primary"
              className="w-full"
              onClick={() => setShowNsfwWarning(false)}
            >
              Мне есть 18 лет, продолжить
            </Button>

            <Button
              variant="secondary"
              className="w-full"
              onClick={() => window.history.back()}
            >
              Назад
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (showNsfwOverlay) {
    return (
      <NsfwOverlay
        onEnableNSFW={toggleNSFW}
        onChooseCharacter={() => window.history.back()}
      />
    );
  }

  const isCharacterTyping = typingUsers.includes(characterId);

  return (
    <div className={cn('flex flex-col h-full bg-gray-50 relative', className)}>
      {/* Character Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar
            src={character.avatar}
            fallback={character.name}
            size="md"
            showOnlineStatus={true}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h2 className="font-semibold text-gray-900 truncate">
                {character.name}
              </h2>
              {character.isNsfw && (
                <Badge variant="warning" size="sm">
                  18+
                </Badge>
              )}
            </div>

            <p className="text-sm text-gray-500 truncate">
              {character.description}
            </p>

            {isCharacterTyping && (
              <p className="text-xs text-blue-600 mt-1">Печатает...</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
            title="Настройки чата"
          >
            <Settings className="h-5 w-5" />
          </button>

          <button
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
            title="Дополнительно"
          >
            <MoreVertical className="h-5 w-5" />
          </button>

          <ConnectionStatus status={connectionStatus} />
        </div>
      </div>

      {/* Messages List */}
      <MessageList
        messages={activeChat?.messages || []}
        character={character}
        className="flex-1"
        showTyping={isCharacterTyping}
        onReaction={(messageId, reaction) => {
          console.log('Reaction:', messageId, reaction);
          // Здесь будет логика добавления реакции через chatStore
        }}
        onReply={(messageId) => {
          console.log('Reply to:', messageId);
          // Здесь будет логика ответа на сообщение
        }}
        onCopy={(content) => {
          navigator.clipboard.writeText(content);
          console.log('Copied:', content);
        }}
      />

      {/* Message Input */}
      <MessageInput
        ref={messageInputRef}
        character={character}
        onSendMessage={async (content) => {
          try {
            await sendMessage(content);
          } catch (error) {
            console.error('Failed to send message:', error);
          }
        }}
        disabled={!activeChat}
      />
    </div>
  );
};

export default ChatInterface;
