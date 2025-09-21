import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CharacterGallery, CharacterProfile } from '../components/character';
import { ProtectedRoute } from '../components/auth';
import { Character } from '../types';
import { useCharacterStore } from '../stores/characterStore';
import CharacterCreator from '../components/character/CharacterCreator';
import Button from '../components/ui/Button';

const GalleryPage: React.FC = () => {
  const navigate = useNavigate();
  const [showCreator, setShowCreator] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );
  const [showProfile, setShowProfile] = useState(false);

  const handleCharacterSelect = (character: Character) => {
    // Навигация к чату с выбранным персонажем
    navigate(`/chat?character=${character.id}`);
  };

  const handleViewProfile = (character: Character) => {
    setSelectedCharacter(character);
    setShowProfile(true);
  };

  const handleStartChat = () => {
    if (selectedCharacter) {
      setShowProfile(false);
      handleCharacterSelect(selectedCharacter);
    }
  };

  const addCreatedCharacter = useCharacterStore((state) => state.characters);
  const setCharacters = useCharacterStore.setState;

  return (
    <ProtectedRoute>
      <div className="h-screen bg-gray-50 flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b bg-white">
          <h1 className="text-lg font-semibold">Галерея персонажей</h1>
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              onClick={() => setShowCreator(true)}
              className="flex items-center gap-2"
            >
              <span className="hidden sm:inline">Создать персонажа</span>
              <span className="sm:hidden">Новый</span>
            </Button>
          </div>
        </div>
        <div className="flex-1 min-h-0">
          <CharacterGallery
            onCharacterSelect={handleCharacterSelect}
            onViewProfile={handleViewProfile}
            className="h-full"
          />
        </div>
        {showCreator && (
          <CharacterCreator
            isOpen={showCreator}
            onClose={() => setShowCreator(false)}
            onSuccess={(created) => {
              // Добавляем в store
              setCharacters((prev: any) => ({
                characters: [...prev.characters, created],
              }));
              setShowCreator(false);
            }}
          />
        )}
        {selectedCharacter && (
          <CharacterProfile
            character={selectedCharacter}
            isOpen={showProfile}
            onClose={() => setShowProfile(false)}
            onStartChat={handleStartChat}
          />
        )}
      </div>
    </ProtectedRoute>
  );
};

export default GalleryPage;
