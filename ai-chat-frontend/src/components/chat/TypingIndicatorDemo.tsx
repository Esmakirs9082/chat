import React, { useState } from 'react';
import TypingIndicator, {
  MultipleTypingIndicator,
  useTypingIndicator,
} from './TypingIndicator';
import { Button } from '../ui';
import { Character } from '../../types';

// Демо персонаж для тестирования
const demoCharacter: Character = {
  id: 'demo-character-1',
  name: 'Алиса',
  avatar: undefined,
  personality: [
    { trait: 'дружелюбный', value: 5 },
    { trait: 'умный', value: 4 },
    { trait: 'веселый', value: 3 },
  ],
  description: 'Умная и дружелюбная помощница',
  isNsfw: false,
  isPublic: true,
  createdBy: 'demo-user',
  tags: ['помощник', 'дружелюбный'],
  messageCount: 0,
  favoriteCount: 0,
  createdAt: new Date(),
};

const demoCharacters: Character[] = [
  demoCharacter,
  {
    id: 'demo-character-2',
    name: 'Макс',
    avatar: undefined,
    personality: [{ trait: 'романтичный', value: 4 }],
    description: 'Романтичный собеседник',
    isNsfw: true,
    isPublic: false,
    createdBy: 'demo-user',
    tags: ['романтика'],
    messageCount: 0,
    favoriteCount: 0,
    createdAt: new Date(),
  },
  {
    id: 'demo-character-3',
    name: 'Софи',
    avatar: undefined,
    personality: [{ trait: 'креативный', value: 5 }],
    description: 'Творческая личность',
    isNsfw: false,
    isPublic: true,
    createdBy: 'demo-user',
    tags: ['творчество'],
    messageCount: 0,
    favoriteCount: 0,
    createdAt: new Date(),
  },
];

const TypingIndicatorDemo: React.FC = () => {
  const [showBubble, setShowBubble] = useState(false);
  const [showInline, setShowInline] = useState(false);
  const [showMinimal, setShowMinimal] = useState(false);
  const [showMultiple, setShowMultiple] = useState(false);

  // Демонстрация хука
  const { isTyping, showTyping, hideTyping, toggleTyping } =
    useTypingIndicator(3000);

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          TypingIndicator Demo
        </h1>
        <p className="text-gray-600">
          Демонстрация различных вариантов индикатора печатания
        </p>
      </div>

      {/* Bubble Variant */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Bubble Variant</h2>
          <Button
            onClick={() => setShowBubble(!showBubble)}
            variant={showBubble ? 'secondary' : 'primary'}
          >
            {showBubble ? 'Скрыть' : 'Показать'}
          </Button>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg min-h-[100px]">
          <TypingIndicator
            characterName={demoCharacter.name}
            isTyping={showBubble}
            avatar={demoCharacter.avatar}
            personality="friendly"
          />
        </div>
      </div>

      {/* Inline Variant */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Inline Variant</h2>
          <Button
            onClick={() => setShowInline(!showInline)}
            variant={showInline ? 'secondary' : 'primary'}
          >
            {showInline ? 'Скрыть' : 'Показать'}
          </Button>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <TypingIndicator
            characterName={demoCharacter.name}
            isTyping={showInline}
            avatar={demoCharacter.avatar}
            personality="mysterious"
          />
        </div>
      </div>

      {/* Minimal Variant */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Minimal Variant</h2>
          <Button
            onClick={() => setShowMinimal(!showMinimal)}
            variant={showMinimal ? 'secondary' : 'primary'}
          >
            {showMinimal ? 'Скрыть' : 'Показать'}
          </Button>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <TypingIndicator
            characterName={demoCharacter.name}
            isTyping={showMinimal}
            personality="professional"
          />
        </div>
      </div>

      {/* Multiple Characters */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Multiple Characters</h2>
          <Button
            onClick={() => setShowMultiple(!showMultiple)}
            variant={showMultiple ? 'secondary' : 'primary'}
          >
            {showMultiple ? 'Скрыть' : 'Показать'}
          </Button>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <MultipleTypingIndicator
            typingUsers={demoCharacters.map((char) => ({
              id: char.id,
              name: char.name,
              avatar: char.avatar,
            }))}
            maxVisible={2}
            className={showMultiple ? '' : 'hidden'}
          />
        </div>
      </div>

      {/* Hook Demo */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">useTypingIndicator Hook</h2>
          <div className="space-x-2">
            <Button onClick={showTyping} size="sm">
              Показать
            </Button>
            <Button onClick={hideTyping} size="sm" variant="secondary">
              Скрыть
            </Button>
            <Button onClick={toggleTyping} size="sm" variant="ghost">
              Toggle
            </Button>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          {isTyping && (
            <TypingIndicator
              characterName={demoCharacter.name}
              isTyping={isTyping}
              avatar={demoCharacter.avatar}
              personality="playful"
            />
          )}
          {!isTyping && (
            <p className="text-gray-500 text-center italic">
              Используйте кнопки выше для управления состоянием
            </p>
          )}
        </div>
      </div>

      {/* Code Examples */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Примеры использования</h2>
        <div className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto">
          <pre className="text-sm">
            {`// Базовое использование
<TypingIndicator
  character={character}
  isVisible={isTyping}
  variant="bubble"
  timeout={5000}
  onTimeout={() => setIsTyping(false)}
/>

// С хуком
const { isTyping, showTyping, hideTyping } = useTypingIndicator(3000);

// Множественные персонажи
<MultipleTypingIndicator
  characters={typingCharacters}
  isVisible={hasTyping}
  maxVisible={3}
/>`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicatorDemo;
