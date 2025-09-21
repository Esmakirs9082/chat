import React, { useState } from 'react';
import { CharacterCreator } from '../components/character';
import Button from '../components/ui/Button';
import { Character } from '../types';

const CharacterCreatorDemo: React.FC = () => {
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [createdCharacters, setCreatedCharacters] = useState<Character[]>([]);

  const handleCharacterCreated = (character: Character) => {
    setCreatedCharacters((prev) => [...prev, character]);
    console.log('Новый персонаж создан:', character);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Демо CharacterCreator
          </h1>
          <p className="text-gray-600">
            Тест многошагового мастера создания персонажей
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-8 text-center">
          <Button
            onClick={() => setIsCreatorOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Создать персонажа
          </Button>

          {createdCharacters.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">
                Созданные персонажи:
              </h2>
              <div className="grid gap-4">
                {createdCharacters.map((character) => (
                  <div
                    key={character.id}
                    className="bg-gray-50 p-4 rounded-lg text-left"
                  >
                    <h3 className="font-semibold text-lg">{character.name}</h3>
                    <p className="text-gray-600 mt-1">
                      {character.description}
                    </p>
                    {character.tags && character.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {character.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {character.isNsfw && (
                      <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full">
                        18+
                      </span>
                    )}
                    <div className="mt-2 text-xs text-gray-500">
                      Создан: {character.createdAt.toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <CharacterCreator
        isOpen={isCreatorOpen}
        onClose={() => setIsCreatorOpen(false)}
        onSuccess={handleCharacterCreated}
      />
    </div>
  );
};

export default CharacterCreatorDemo;
