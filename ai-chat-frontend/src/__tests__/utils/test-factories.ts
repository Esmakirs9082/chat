/**
 * Test Data Factories
 * Фабрики для создания тестовых данных с реалистичными значениями
 */

import {
  SUBSCRIPTION_PLANS,
  CHARACTER_CATEGORIES,
  PERSONALITY_TRAITS,
} from '../../constants';

// Типы (создаем локально для избежания зависимостей)
export interface TestUser {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  isEmailVerified: boolean;
  subscription: {
    plan: string;
    status: 'active' | 'canceled' | 'expired';
    expiresAt?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TestCharacter {
  id: string;
  name: string;
  displayName: string;
  description: string;
  avatar: string;
  category: string;
  personalityTraits: string[];
  isNSFW: boolean;
  isCustom: boolean;
  createdBy?: string;
  stats: {
    likes: number;
    chats: number;
    rating: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TestMessage {
  id: string;
  conversationId: string;
  content: string;
  type: 'user' | 'character' | 'system';
  timestamp: string;
  isRead: boolean;
  metadata?: {
    characterId?: string;
    userId?: string;
    emotions?: string[];
  };
}

export interface TestConversation {
  id: string;
  userId: string;
  characterId: string;
  title: string;
  messages: TestMessage[];
  isActive: boolean;
  lastMessageAt: string;
  createdAt: string;
}

export interface TestSubscription {
  id: string;
  userId: string;
  plan: string;
  status: 'active' | 'canceled' | 'expired' | 'pending';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  stripePriceId?: string;
  stripeSubscriptionId?: string;
  createdAt: string;
  updatedAt: string;
}

// ===========================================
// Utility Functions
// ===========================================

/**
 * Генерация случайного ID
 */
function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Генерация случайной даты
 */
function randomDate(start?: Date, end?: Date): string {
  const startDate = start || new Date(2023, 0, 1);
  const endDate = end || new Date();
  const randomTime =
    startDate.getTime() +
    Math.random() * (endDate.getTime() - startDate.getTime());
  return new Date(randomTime).toISOString();
}

/**
 * Случайный выбор из массива
 */
function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Случайный выбор нескольких элементов
 */
function randomChoices<T>(array: T[], count: number = 1): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, array.length));
}

// ===========================================
// User Factory
// ===========================================

export const createUser = (overrides: Partial<TestUser> = {}): TestUser => {
  const usernames = [
    'alice_wonder',
    'bob_builder',
    'charlie_coder',
    'diana_designer',
    'eve_engineer',
    'frank_frontend',
    'grace_graphics',
    'henry_hacker',
  ];
  const domains = [
    'gmail.com',
    'yahoo.com',
    'outlook.com',
    'proton.me',
    'icloud.com',
  ];

  const username = randomChoice(usernames);
  const domain = randomChoice(domains);
  const planKeys = Object.keys(SUBSCRIPTION_PLANS);

  const baseUser: TestUser = {
    id: generateId(),
    email: `${username}@${domain}`,
    username,
    displayName: username
      .replace('_', ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase()),
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    isEmailVerified: Math.random() > 0.3,
    subscription: {
      plan: randomChoice(planKeys),
      status: randomChoice(['active', 'canceled', 'expired'] as const),
      expiresAt: randomDate(
        new Date(),
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      ),
    },
    createdAt: randomDate(new Date(2023, 0, 1), new Date()),
    updatedAt: randomDate(new Date(), new Date()),
  };

  return { ...baseUser, ...overrides };
};

/**
 * Создание массива пользователей
 */
export const createUsers = (
  count: number,
  overrides: Partial<TestUser> = {}
): TestUser[] => {
  return Array.from({ length: count }, () => createUser(overrides));
};

// ===========================================
// Character Factory
// ===========================================

export const createCharacter = (
  overrides: Partial<TestCharacter> = {}
): TestCharacter => {
  const names = [
    'Aria',
    'Luna',
    'Zara',
    'Nova',
    'Vera',
    'Maya',
    'Iris',
    'Sage',
    'Alex',
    'Jordan',
    'River',
    'Sky',
    'Phoenix',
    'Sage',
    'Blake',
    'Drew',
  ];

  const descriptions = [
    'Загадочный персонаж с богатым внутренним миром',
    'Веселый и энергичный компаньон для интересных бесед',
    'Мудрый наставник с большим жизненным опытом',
    'Креативная личность с необычным взглядом на мир',
    'Романтичная натура, ценящая красоту и искусство',
    'Амбициозный и целеустремленный характер',
    'Добрый и отзывчивый друг, готовый всегда помочь',
    'Интеллектуал с широким кругозором и глубокими знаниями',
  ];

  const categoryKeys = Object.keys(CHARACTER_CATEGORIES);
  const traitKeys = Object.keys(PERSONALITY_TRAITS);
  const selectedCategory = randomChoice(categoryKeys);
  const category =
    CHARACTER_CATEGORIES[selectedCategory as keyof typeof CHARACTER_CATEGORIES];

  const name = randomChoice(names);
  const baseCharacter: TestCharacter = {
    id: generateId(),
    name: name.toLowerCase(),
    displayName: name,
    description: randomChoice(descriptions),
    avatar: `https://api.dicebear.com/7.x/personas/svg?seed=${name}`,
    category: selectedCategory,
    personalityTraits: randomChoices(
      traitKeys,
      Math.floor(Math.random() * 4) + 2
    ),
    isNSFW: category?.nsfw || false,
    isCustom: Math.random() > 0.7,
    createdBy: Math.random() > 0.5 ? generateId() : undefined,
    stats: {
      likes: Math.floor(Math.random() * 10000),
      chats: Math.floor(Math.random() * 5000),
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0 - 5.0
    },
    createdAt: randomDate(new Date(2023, 0, 1), new Date()),
    updatedAt: randomDate(new Date(), new Date()),
  };

  return { ...baseCharacter, ...overrides };
};

/**
 * Создание массива персонажей
 */
export const createCharacters = (
  count: number,
  overrides: Partial<TestCharacter> = {}
): TestCharacter[] => {
  return Array.from({ length: count }, () => createCharacter(overrides));
};

// ===========================================
// Message Factory
// ===========================================

export const createMessage = (
  overrides: Partial<TestMessage> = {}
): TestMessage => {
  const userMessages = [
    'Привет! Как дела?',
    'Расскажи что-то интересное',
    'Что думаешь о современных технологиях?',
    'Какой у тебя любимый фильм?',
    'Поговорим о путешествиях?',
    'Что можешь посоветовать для саморазвития?',
    'Как провести выходные интересно?',
    'Расскажи анекдот!',
  ];

  const characterMessages = [
    'Привет! Всегда рад пообщаться с тобой ✨',
    'О, это очень интересная тема! Давай обсудим подробнее',
    'Знаешь, у меня есть несколько идей по этому поводу...',
    'Мне кажется, ты задаешь очень правильные вопросы!',
    'Хочешь, поделюсь своими мыслями об этом?',
    'Это напоминает мне одну историю...',
    'Интересный подход! А ты как думаешь?',
    'Согласен, это действительно важно обсуждать 🤔',
  ];

  const systemMessages = [
    'Пользователь присоединился к беседе',
    'Сообщение было удалено',
    'Беседа была создана',
    'Настройки конфиденциальности обновлены',
  ];

  const messageType = randomChoice(['user', 'character', 'system'] as const);
  let content: string;

  switch (messageType) {
    case 'user':
      content = randomChoice(userMessages);
      break;
    case 'character':
      content = randomChoice(characterMessages);
      break;
    case 'system':
      content = randomChoice(systemMessages);
      break;
  }

  const baseMessage: TestMessage = {
    id: generateId(),
    conversationId: generateId(),
    content,
    type: messageType,
    timestamp: randomDate(
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      new Date()
    ),
    isRead: Math.random() > 0.3,
    metadata: {
      characterId: messageType === 'character' ? generateId() : undefined,
      userId: messageType === 'user' ? generateId() : undefined,
      emotions:
        messageType === 'character'
          ? randomChoices(['happy', 'curious', 'thoughtful', 'excited'], 2)
          : undefined,
    },
  };

  return { ...baseMessage, ...overrides };
};

/**
 * Создание массива сообщений
 */
export const createMessages = (
  count: number,
  overrides: Partial<TestMessage> = {}
): TestMessage[] => {
  return Array.from({ length: count }, () => createMessage(overrides));
};

// ===========================================
// Conversation Factory
// ===========================================

export const createConversation = (
  overrides: Partial<TestConversation> = {}
): TestConversation => {
  const titles = [
    'Интересный разговор',
    'Философские размышления',
    'Обсуждение фильмов',
    'Планы на выходные',
    'Разговор о путешествиях',
    'Технические вопросы',
    'Творческие идеи',
    'Дружеская беседа',
  ];

  const conversationId = generateId();
  const messageCount = Math.floor(Math.random() * 20) + 5; // 5-25 сообщений

  const messages = Array.from({ length: messageCount }, (_, index) => {
    return createMessage({
      conversationId,
      type: index % 2 === 0 ? 'user' : 'character',
      timestamp: new Date(
        Date.now() - (messageCount - index) * 60 * 1000
      ).toISOString(),
    });
  });

  const baseConversation: TestConversation = {
    id: conversationId,
    userId: generateId(),
    characterId: generateId(),
    title: randomChoice(titles),
    messages,
    isActive: Math.random() > 0.3,
    lastMessageAt:
      messages[messages.length - 1]?.timestamp || new Date().toISOString(),
    createdAt: randomDate(
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      new Date()
    ),
  };

  return { ...baseConversation, ...overrides };
};

/**
 * Создание массива бесед
 */
export const createConversations = (
  count: number,
  overrides: Partial<TestConversation> = {}
): TestConversation[] => {
  return Array.from({ length: count }, () => createConversation(overrides));
};

// ===========================================
// Subscription Factory
// ===========================================

export const createSubscription = (
  overrides: Partial<TestSubscription> = {}
): TestSubscription => {
  const planKeys = Object.keys(SUBSCRIPTION_PLANS);
  const plan = randomChoice(planKeys);
  const status = randomChoice([
    'active',
    'canceled',
    'expired',
    'pending',
  ] as const);

  const now = new Date();
  const periodStart = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000); // 15 дней назад
  const periodEnd = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000); // через 15 дней

  const baseSubscription: TestSubscription = {
    id: generateId(),
    userId: generateId(),
    plan,
    status,
    currentPeriodStart: periodStart.toISOString(),
    currentPeriodEnd: periodEnd.toISOString(),
    cancelAtPeriodEnd: status === 'canceled' ? Math.random() > 0.5 : false,
    stripePriceId: `price_${generateId()}`,
    stripeSubscriptionId: `sub_${generateId()}`,
    createdAt: randomDate(new Date(2023, 0, 1), periodStart),
    updatedAt: randomDate(periodStart, new Date()),
  };

  return { ...baseSubscription, ...overrides };
};

/**
 * Создание массива подписок
 */
export const createSubscriptions = (
  count: number,
  overrides: Partial<TestSubscription> = {}
): TestSubscription[] => {
  return Array.from({ length: count }, () => createSubscription(overrides));
};

// ===========================================
// Composite Factories
// ===========================================

/**
 * Создание полного пользователя с персонажами и беседами
 */
export const createFullUser = (
  overrides: {
    user?: Partial<TestUser>;
    characterCount?: number;
    conversationCount?: number;
  } = {}
) => {
  const user = createUser(overrides.user);
  const characters = createCharacters(overrides.characterCount || 3, {
    createdBy: user.id,
  });
  const conversations = createConversations(overrides.conversationCount || 5, {
    userId: user.id,
  });
  const subscription = createSubscription({
    userId: user.id,
    plan: user.subscription.plan,
  });

  return {
    user,
    characters,
    conversations,
    subscription,
  };
};

/**
 * Создание тестового датасета для приложения
 */
export const createTestDataset = (
  options: {
    userCount?: number;
    characterCount?: number;
    conversationCount?: number;
    messageCount?: number;
  } = {}
) => {
  const {
    userCount = 10,
    characterCount = 50,
    conversationCount = 100,
    messageCount = 500,
  } = options;

  const users = createUsers(userCount);
  const characters = createCharacters(characterCount);
  const conversations = createConversations(conversationCount);
  const messages = createMessages(messageCount);
  const subscriptions = users.map((user) =>
    createSubscription({ userId: user.id })
  );

  return {
    users,
    characters,
    conversations,
    messages,
    subscriptions,
  };
};
