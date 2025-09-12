import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useCharacterStore, useChatStore, usePreferencesStore } from '../stores';
import { Button } from '../components/ui';
import type { Character } from '../types';

interface CharacterSelectorProps {
  onCreateCharacter?: () => void;
}

export const CharacterSelector: React.FC<CharacterSelectorProps> = ({
  onCreateCharacter,
}) => {
  const { characters, selectCharacter } = useCharacterStore();
  const { createRoom } = useChatStore();
  const { preferences } = usePreferencesStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredCharacters = characters.filter((character: Character) => 
    preferences.nsfwEnabled || !character.isNSFW
  );

  const handleCharacterSelect = (character: Character) => {
    setSelectedId(character.id);
    selectCharacter(character);
    
    // Create or switch to a room for this character
    createRoom(character.id);
    
    // The createRoom function already sets the active room,
    // so we don't need to call setActiveRoom again
  };

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Characters
          </h2>
          <Button
            onClick={onCreateCharacter}
            variant="outline"
            size="sm"
            className="p-2"
          >
            <Plus size={16} />
          </Button>
        </div>
        
        {!preferences.nsfwEnabled && (
          <div className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded">
            NSFW content is disabled. Enable it in settings to see all characters.
          </div>
        )}
      </div>

      {/* Character List */}
      <div className="flex-1 overflow-y-auto">
        {filteredCharacters.length === 0 ? (
          <div className="p-4 text-center">
            <div className="text-4xl mb-2">🤖</div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              No characters available
            </p>
            <Button onClick={onCreateCharacter} size="sm">
              Create Your First Character
            </Button>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {filteredCharacters.map((character: Character) => (
              <div
                key={character.id}
                onClick={() => handleCharacterSelect(character)}
                className={[
                  'p-3 rounded-lg cursor-pointer transition-colors border',
                  selectedId === character.id
                    ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700 border-transparent',
                ].join(' ')}
              >
                <div className="flex items-start space-x-3">
                  <div className="text-2xl flex-shrink-0">
                    {character.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                        {character.name}
                      </h3>
                      {character.isNSFW && (
                        <span className="text-xs px-1.5 py-0.5 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded">
                          NSFW
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                      {character.description}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 line-clamp-1">
                      {character.personality}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          {filteredCharacters.length} character{filteredCharacters.length !== 1 ? 's' : ''} available
        </div>
      </div>
    </div>
  );
};