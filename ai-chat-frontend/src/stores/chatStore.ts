import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Chat, Message } from '../types/chat';

interface ChatState {
  chats: Chat[];
  activeChat: Chat | null;
  messages: Message[];
  isLoading: boolean;
  isTyping: boolean;
  typingUsers: string[];
}

interface ChatActions {
  setActiveChat: (chatId: string) => void;
  loadChats: () => Promise<void>;
  loadMessages: (chatId: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  createChat: (characterId: string) => Promise<Chat>;
  deleteChat: (chatId: string) => Promise<void>;
  startTyping: (characterName: string) => void;
  stopTyping: () => void;
  addMessage: (message: Message) => void;
}

export const useChatStore = create<ChatState & ChatActions>()(
  immer((set, get) => ({
    chats: [],
    activeChat: null,
    messages: [],
    isLoading: false,
    isTyping: false,
    typingUsers: [],

    setActiveChat: (chatId) => {
      const chat = get().chats.find((c) => c.id === chatId) || null;
      set({ activeChat: chat });
    },

    loadChats: async () => {
      set({ isLoading: true });
      try {
        // TODO: API call to load chats
        // const chats = await chatApi.getChats();
        // set({ chats });
      } catch (error) {
        console.error('Failed to load chats:', error);
      } finally {
        set({ isLoading: false });
      }
    },

    loadMessages: async (chatId: string) => {
      set({ isLoading: true });
      try {
        // TODO: API call to load messages
        // const messages = await chatApi.getMessages(chatId);
        // set({ messages });
      } catch (error) {
        console.error('Failed to load messages:', error);
      } finally {
        set({ isLoading: false });
      }
    },

    sendMessage: async (content: string) => {
      const { activeChat } = get();
      if (!activeChat) return;

      // Add user message immediately
      const userMessage: Message = {
        id: Date.now().toString(),
        chatId: activeChat.id,
        sender: 'user',
        content,
        timestamp: new Date(),
        type: 'text'
      };

      set((state) => {
        state.messages.push(userMessage);
        if (state.activeChat && state.activeChat.messages) {
          state.activeChat.messages.push(userMessage);
        }
      });

      try {
        // TODO: Send message to API
        // const response = await chatApi.sendMessage(activeChat.id, content);
        // const aiMessage = response.message;
        // set((state) => {
        //   state.messages.push(aiMessage);
        //   if (state.activeChat && state.activeChat.messages) {
        //     state.activeChat.messages.push(aiMessage);
        //   }
        // });
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    },

    createChat: async (characterId: string) => {
      set({ isLoading: true });
      try {
        // TODO: API call to create chat
        const newChat: Chat = {
          id: Date.now().toString(),
          characterId,
          userId: 'current-user-id', // TODO: Get from auth
          title: `Chat with character ${characterId}`,
          messages: [],
          lastMessageAt: new Date(),
          messageCount: 0,
          isArchived: false,
          settings: {
            autoReply: true,
            typingEnabled: true
          }
        };
        
        set((state) => {
          state.chats.push(newChat);
          state.activeChat = newChat;
        });
        
        return newChat;
      } catch (error) {
        console.error('Failed to create chat:', error);
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },

    deleteChat: async (chatId: string) => {
      try {
        // TODO: API call to delete chat
        // await chatApi.deleteChat(chatId);
        
        set((state) => {
          state.chats = state.chats.filter((chat: Chat) => chat.id !== chatId);
          if (state.activeChat && state.activeChat.id === chatId) {
            state.activeChat = null;
            state.messages = [];
          }
        });
      } catch (error) {
        console.error('Failed to delete chat:', error);
      }
    },

    startTyping: (characterName: string) => {
      set((state) => {
        if (!state.typingUsers.includes(characterName)) {
          state.typingUsers.push(characterName);
        }
        state.isTyping = true;
      });
    },

    stopTyping: () => {
      set({ isTyping: false, typingUsers: [] });
    },

    addMessage: (message: Message) => {
      set((state) => {
        state.messages.push(message);
        if (state.activeChat && state.activeChat.messages) {
          state.activeChat.messages.push(message);
        }
      });
    },
  }))
);