import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CharacterGallery } from '../components/character';
import { ProtectedRoute } from '../components/auth';
import { Character } from '../types';

const GalleryPage: React.FC = () => {
  const navigate = useNavigate();

  const handleCharacterSelect = (character: Character) => {
    // Навигация к чату с выбранным персонажем
    navigate(`/chat?character=${character.id}`);
  };

  return (
    <ProtectedRoute>
      <div className="h-screen bg-gray-50">
        <CharacterGallery 
          onCharacterSelect={handleCharacterSelect}
          className="h-full"
        />
      </div>
    </ProtectedRoute>
  );
};

export default GalleryPage;
