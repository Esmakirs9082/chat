// Типы для CharacterCreator

export type ConversationStyle =
  | 'friendly'
  | 'sarcastic'
  | 'romantic'
  | 'mysterious'
  | 'formal';

export interface CharacterFormData {
  name: string;
  description: string;
  tags: string[];
  category: string;
  isNsfw: boolean;
  personality: {
    trait: string;
    value: number;
  }[];
  // Personality step additions
  traits: string[]; // free-form short descriptors
  greeting: string; // first message template
  conversationStyle: ConversationStyle;
  // Avatar step additions
  avatarUrl?: string; // external URL
  avatarFileName?: string; // uploaded file name placeholder (not storing blob yet)
  // Publish metadata
  published?: boolean;
}

export interface StepErrors {
  [key: string]: string;
}
