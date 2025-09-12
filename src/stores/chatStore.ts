import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatState, ChatRoom, ChatMessage, Character } from '../types';

interface ChatStore extends ChatState {
  setActiveRoom: (room: ChatRoom) => void;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setTyping: (isTyping: boolean) => void;
  selectCharacter: (character: Character) => void;
  createRoom: (characterId: string) => string;
  clearChat: () => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      activeRoom: null,
      rooms: [],
      isTyping: false,
      selectedCharacter: null,
      
      setActiveRoom: (room: ChatRoom) => {
        set({ activeRoom: room });
      },
      
      addMessage: (messageData) => {
        const currentRoom = get().activeRoom;
        if (!currentRoom) return;
        
        const newMessage: ChatMessage = {
          ...messageData,
          id: Date.now().toString(),
          timestamp: new Date(),
        };
        
        const updatedRoom = {
          ...currentRoom,
          messages: [...currentRoom.messages, newMessage],
          lastActivity: new Date(),
        };
        
        const updatedRooms = get().rooms.map(room => 
          room.id === currentRoom.id ? updatedRoom : room
        );
        
        set({
          activeRoom: updatedRoom,
          rooms: updatedRooms,
        });
      },
      
      setTyping: (isTyping: boolean) => {
        set({ isTyping });
      },
      
      selectCharacter: (character: Character) => {
        set({ selectedCharacter: character });
      },
      
      createRoom: (characterId: string) => {
        const roomId = `room-${Date.now()}`;
        const newRoom: ChatRoom = {
          id: roomId,
          characterId,
          messages: [],
          createdAt: new Date(),
          lastActivity: new Date(),
        };
        
        set({
          rooms: [...get().rooms, newRoom],
          activeRoom: newRoom,
        });
        
        return roomId;
      },
      
      clearChat: () => {
        const currentRoom = get().activeRoom;
        if (!currentRoom) return;
        
        const clearedRoom = {
          ...currentRoom,
          messages: [],
          lastActivity: new Date(),
        };
        
        const updatedRooms = get().rooms.map(room => 
          room.id === currentRoom.id ? clearedRoom : room
        );
        
        set({
          activeRoom: clearedRoom,
          rooms: updatedRooms,
        });
      },
    }),
    {
      name: 'chat-storage',
    }
  )
);