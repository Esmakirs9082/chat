import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from './Button';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = 'Type a message...',
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled) {
      onSendMessage(trimmedMessage);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  return (
    <div className="flex items-end space-x-2 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex-1">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className={[
            'w-full px-3 py-2 border rounded-lg resize-none',
            'bg-gray-50 dark:bg-gray-700',
            'border-gray-300 dark:border-gray-600',
            'text-gray-900 dark:text-gray-100',
            'placeholder-gray-500 dark:placeholder-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            'scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600',
            disabled ? 'opacity-50 cursor-not-allowed' : '',
          ].filter(Boolean).join(' ')}
          style={{ minHeight: '40px', maxHeight: '120px' }}
        />
      </div>
      <Button
        onClick={handleSend}
        disabled={disabled || !message.trim()}
        variant="primary"
        size="md"
        className="h-10 w-10 p-0 flex-shrink-0"
      >
        <Send size={18} />
      </Button>
    </div>
  );
};