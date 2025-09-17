import React, { useEffect, useRef, useCallback, useState, memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { Avatar } from '../ui';
import TypingIndicator from './TypingIndicator';
import { Message, Character } from '../../types';
import { cn } from '../../utils';

interface MessageListProps {
  messages: Message[];
  character: Character;
  className?: string;
  showTyping?: boolean;
  onReaction?: (messageId: string, reaction: string) => void;
  onReply?: (messageId: string) => void;
  onCopy?: (content: string) => void;
  isLoading?: boolean;
  onLoadMore?: () => void;
}

const NewMessagesDivider = () => (
  <div className="flex items-center my-4">
    <div className="flex-1 h-px bg-gray-300" />
    <span className="mx-2 text-xs text-gray-500 bg-white px-2 rounded">Новые сообщения</span>
    <div className="flex-1 h-px bg-gray-300" />
  </div>
);

const MemoizedMessageBubble = memo<{
  message: Message;
  character: Character;
  onReaction?: (messageId: string, reaction: string) => void;
  onReply?: (messageId: string) => void;
  onCopy?: (content: string) => void;
}>(({ message, character, onReaction, onReply, onCopy }) => {
  // ...реализация MessageBubble ниже...
  return (
    <MessageBubble
      message={message}
      character={character}
      onReaction={onReaction}
      onReply={onReply}
      onCopy={onCopy}
    />
  );
});

interface MessageBubbleProps {
  message: Message;
  character: Character;
  onReaction?: (messageId: string, reaction: string) => void;
  onReply?: (messageId: string) => void;
  onCopy?: (content: string) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  character,
  onReaction,
  onReply,
  onCopy,
}) => {
  // ...реализация bubble: markdown, timestamp, edited, error, loading, реакции, context menu...
  return (
    <div>
      {/* Ваш UI для сообщения */}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
      >
        {message.content}
      </ReactMarkdown>
    </div>
  );
};

const MessageList: React.FC<MessageListProps> = ({
  messages,
  character,
  className,
  showTyping = false,
  onReaction,
  onReply,
  onCopy,
  isLoading = false,
  onLoadMore,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [dividerIndex, setDividerIndex] = useState<number | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleScroll = useCallback(() => {
    if (containerRef.current && onLoadMore) {
      if (containerRef.current.scrollTop === 0) {
        onLoadMore();
      }
    }
  }, [onLoadMore]);

  useEffect(() => {
    const idx = messages.findIndex((msg) => (msg as any).isNew);
    setDividerIndex(idx > -1 ? idx : null);
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className={cn('flex-1 flex items-center justify-center', className)}>
        <div className="text-center space-y-4 p-8">
          <Avatar
            src={character.avatar}
            fallback={character.name}
            size="lg"
            className="mx-auto"
          />
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">
              Начните беседу с {character.name}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {character.description}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative flex-1', className)}>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
      >
        {messages.map((message, index) => (
          <React.Fragment key={message.id}>
            {dividerIndex === index && <NewMessagesDivider />}
            <MemoizedMessageBubble
              message={message}
              character={character}
              onReaction={onReaction}
              onReply={onReply}
              onCopy={onCopy}
            />
          </React.Fragment>
        ))}
        {showTyping && (
          <TypingIndicator
            character={character}
            isVisible={showTyping}
            variant="bubble"
            timeout={8000}
            onTimeout={() => {}}
          />
        )}
        <div ref={messagesEndRef} />
      </div>
      {isLoading && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white/60 z-10">
          <span className="text-gray-500">Загрузка...</span>
        </div>
      )}
    </div>
  );
};

export default MessageList;