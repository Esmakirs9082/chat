import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Character } from '../types';

interface CharacterStore {
  characters: Character[];
  selectedCharacter: Character | null;
  addCharacter: (character: Omit<Character, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCharacter: (id: string, updates: Partial<Character>) => void;
  deleteCharacter: (id: string) => void;
  selectCharacter: (character: Character) => void;
  getCharacterById: (id: string) => Character | undefined;
}

// Default characters for demo
const defaultCharacters: Character[] = [
  {
    id: 'char-1',
    name: 'Sophia',
    description: 'Friendly AI assistant who loves deep conversations',
    avatar: '👩‍💼',
    personality: 'Intelligent, empathetic, and curious about human nature',
    isNSFW: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'char-2',
    name: 'Alex',
    description: 'Charming companion for intimate conversations',
    avatar: '😏',
    personality: 'Flirty, confident, and adventurous',
    isNSFW: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const useCharacterStore = create<CharacterStore>()(
  persist(
    (set, get) => ({
      characters: defaultCharacters,
      selectedCharacter: null,
      
      addCharacter: (characterData) => {
        const newCharacter: Character = {
          ...characterData,
          id: `char-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set({
          characters: [...get().characters, newCharacter],
        });
      },
      
      updateCharacter: (id: string, updates: Partial<Character>) => {
        const updatedCharacters = get().characters.map(char =>
          char.id === id 
            ? { ...char, ...updates, updatedAt: new Date() }
            : char
        );
        
        set({ characters: updatedCharacters });
      },
      
      deleteCharacter: (id: string) => {
        const filteredCharacters = get().characters.filter(char => char.id !== id);
        set({ characters: filteredCharacters });
      },
      
      selectCharacter: (character: Character) => {
        set({ selectedCharacter: character });
      },
      
      getCharacterById: (id: string) => {
        return get().characters.find(char => char.id === id);
      },
    }),
    {
      name: 'character-storage',
    }
  )
);