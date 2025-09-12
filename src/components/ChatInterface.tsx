import React, { useEffect, useRef, useState } from 'react';
import { useChatStore, useCharacterStore } from '../stores';
import { ChatBubble, MessageInput } from '../components/ui';
import type { ChatMessage } from '../types';

export const ChatInterface: React.FC = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { 
    activeRoom, 
    addMessage, 
    isTyping, 
    setTyping, 
    selectedCharacter 
  } = useChatStore();
  const { getCharacterById } = useCharacterStore();
  
  const [currentCharacter, setCurrentCharacter] = useState(selectedCharacter);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeRoom?.messages]);

  useEffect(() => {
    if (selectedCharacter) {
      setCurrentCharacter(selectedCharacter);
    } else if (activeRoom) {
      const character = getCharacterById(activeRoom.characterId);
      setCurrentCharacter(character || null);
    }
  }, [selectedCharacter, activeRoom, getCharacterById]);

  const handleSendMessage = async (content: string) => {
    if (!activeRoom || !currentCharacter) return;

    // Add user message
    addMessage({
      content,
      isUser: true,
      characterId: currentCharacter.id,
    });

    // Show typing indicator
    setTyping(true);
    
    // Simulate AI response delay
    setTimeout(() => {
      setTyping(false);
      
      // Generate AI response based on character personality
      const aiResponse = generateAIResponse(currentCharacter);
      
      addMessage({
        content: aiResponse,
        isUser: false,
        characterId: currentCharacter.id,
      });
    }, 1000 + Math.random() * 2000); // Random delay 1-3 seconds
  };

  const generateAIResponse = (character: any): string => {
    // Simple AI response generation based on character personality
    const responses = {
      default: [
        `That's interesting! Tell me more about that.`,
        `I understand what you mean. How does that make you feel?`,
        `That's a great point. What made you think about that?`,
        `I can see why you'd feel that way. What would you like to explore next?`,
      ],
      flirty: [
        `Mmm, you know just what to say to get my attention... 😏`,
        `I love how your mind works. It's so... captivating.`,
        `You're making me blush. Keep talking like that...`,
        `Is it getting warm in here, or is it just our conversation?`,
      ],
      friendly: [
        `That sounds amazing! I'd love to hear more about it.`,
        `You always have such interesting perspectives!`,
        `That reminds me of something fascinating...`,
        `I really enjoy our conversations. You're such great company!`,
      ],
    };

    const characterType = character.personality.toLowerCase().includes('flirty') ? 'flirty' :
                         character.personality.toLowerCase().includes('friendly') ? 'friendly' : 
                         'default';

    const responseArray = responses[characterType as keyof typeof responses];
    return responseArray[Math.floor(Math.random() * responseArray.length)];
  };

  if (!activeRoom) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No Chat Selected
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Select a character to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Chat Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{currentCharacter?.avatar || '🤖'}</div>
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">
              {currentCharacter?.name || 'AI Assistant'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {currentCharacter?.description || 'AI Character'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeRoom.messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">{currentCharacter?.avatar || '🤖'}</div>
            <p className="text-gray-500 dark:text-gray-400">
              Say hello to start the conversation!
            </p>
          </div>
        ) : (
          <>
            {activeRoom.messages.map((message: ChatMessage) => (
              <ChatBubble
                key={message.id}
                message={message}
                characterName={currentCharacter?.name}
                characterAvatar={currentCharacter?.avatar}
              />
            ))}
            {isTyping && (
              <ChatBubble
                message={{
                  id: 'typing',
                  content: '',
                  isUser: false,
                  characterId: currentCharacter?.id || '',
                  timestamp: new Date(),
                  isTyping: true,
                }}
                characterName={currentCharacter?.name}
                characterAvatar={currentCharacter?.avatar}
              />
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        disabled={isTyping}
        placeholder={`Message ${currentCharacter?.name || 'AI'}...`}
      />
    </div>
  );
};