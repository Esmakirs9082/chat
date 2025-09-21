/**
 * Application Constants
 * Централизованное хранение всех констант приложения
 * @fileoverview Содержит все константы, типы и конфигурации для AI-чат приложения
 */

// ===========================================
// TypeScript Types & Interfaces
// ===========================================

/**
 * Интерфейс плана подписки
 * @interface SubscriptionPlan
 */
export interface SubscriptionPlan {
  /** Уникальный идентификатор плана */
  id: string;
  /** Внутреннее имя плана */
  name: string;
  /** Отображаемое имя плана */
  displayName: string;
  /** Цена в долларах США */
  price: number;
  /** Валюта */
  currency: string;
  /** Список возможностей плана */
  features: string[];
  /** Лимиты плана */
  limits: {
    /** Сообщений в день (-1 = безлимитно) */
    messagesPerDay: number;
    /** Символов в сообщении */
    charactersPerMessage: number;
    /** Пользовательских персонажей */
    customCharacters: number;
    /** Загрузка файлов */
    fileUploads: boolean;
    /** Приоритетная поддержка */
    prioritySupport: boolean;
  };
  /** Популярный план (для выделения в UI) */
  popular?: boolean;
}

/**
 * Интерфейс категории персонажа
 * @interface CharacterCategory
 */
export interface CharacterCategory {
  /** Уникальный идентификатор категории */
  id: string;
  /** Внутреннее имя категории */
  name: string;
  /** Отображаемое имя категории */
  displayName: string;
  /** Описание категории */
  description: string;
  /** Эмодзи иконка */
  icon: string;
  /** Содержит NSFW контент */
  nsfw: boolean;
}

/**
 * Интерфейс черты личности персонажа
 * @interface PersonalityTrait
 */
export interface PersonalityTrait {
  /** Уникальный идентификатор черты */
  id: string;
  /** Внутреннее имя черты */
  name: string;
  /** Отображаемое имя черты */
  displayName: string;
  /** Описание черты */
  description: string;
  /** Противоположная черта */
  opposite?: string;
}

/**
 * Интерфейс поддерживаемого языка
 * @interface Language
 */
export interface Language {
  /** Код языка (ISO 639-1) */
  code: string;
  /** Английское название */
  name: string;
  /** Локализованное название */
  displayName: string;
  /** Флаг эмодзи */
  flag?: string;
}

/**
 * Интерфейс конфигурации загрузки файлов
 * @interface FileUploadConfig
 */
export interface FileUploadConfig {
  /** Максимальный размер в байтах */
  maxSize: number;
  /** Разрешенные MIME типы */
  allowedTypes: string[];
  /** Разрешенные расширения */
  extensions: string[];
}

/**
 * Интерфейс паттерна валидации
 * @interface ValidationPattern
 */
export interface ValidationPattern {
  /** Регулярное выражение */
  pattern: RegExp;
  /** Сообщение об ошибке */
  message: string;
  /** Пример правильного значения */
  example?: string;
}

// ===========================================
// Subscription Plans
// ===========================================

export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  FREE: {
    id: 'free',
    name: 'free',
    displayName: 'Бесплатный',
    price: 0,
    currency: 'USD',
    features: ['Базовый чат с AI', '5 персонажей', 'Стандартная поддержка'],
    limits: {
      messagesPerDay: 10,
      charactersPerMessage: 500,
      customCharacters: 1,
      fileUploads: false,
      prioritySupport: false,
    },
  },
  BASIC: {
    id: 'basic',
    name: 'basic',
    displayName: 'Базовый',
    price: 9.99,
    currency: 'USD',
    features: [
      'Расширенный чат с AI',
      '50+ персонажей',
      'Создание персонажей',
      'Загрузка изображений',
      'Email поддержка',
    ],
    limits: {
      messagesPerDay: 100,
      charactersPerMessage: 1000,
      customCharacters: 5,
      fileUploads: true,
      prioritySupport: false,
    },
    popular: true,
  },
  PREMIUM: {
    id: 'premium',
    name: 'premium',
    displayName: 'Премиум',
    price: 19.99,
    currency: 'USD',
    features: [
      'Безлимитный чат с AI',
      'Все персонажи',
      'Неограниченное создание персонажей',
      'Голосовые сообщения',
      'Приоритетная поддержка',
      'Ранний доступ к новым функциям',
    ],
    limits: {
      messagesPerDay: -1, // unlimited
      charactersPerMessage: 2000,
      customCharacters: -1, // unlimited
      fileUploads: true,
      prioritySupport: true,
    },
  },
} as const;

// ===========================================
// Character Categories
// ===========================================

export const CHARACTER_CATEGORIES: Record<string, CharacterCategory> = {
  ROMANCE: {
    id: 'romance',
    name: 'romance',
    displayName: 'Романтика',
    description: 'Романтические персонажи для флирта и отношений',
    icon: '💕',
    nsfw: true,
  },
  FANTASY: {
    id: 'fantasy',
    name: 'fantasy',
    displayName: 'Фэнтези',
    description: 'Магические существа, эльфы, драконы',
    icon: '🔮',
    nsfw: false,
  },
  ANIME: {
    id: 'anime',
    name: 'anime',
    displayName: 'Аниме',
    description: 'Персонажи в стиле аниме и манги',
    icon: '🎌',
    nsfw: false,
  },
  HISTORICAL: {
    id: 'historical',
    name: 'historical',
    displayName: 'Исторические',
    description: 'Персонажи из разных эпох и культур',
    icon: '🏛️',
    nsfw: false,
  },
  HORROR: {
    id: 'horror',
    name: 'horror',
    displayName: 'Ужасы',
    description: 'Мистические и пугающие персонажи',
    icon: '👻',
    nsfw: false,
  },
  COMEDY: {
    id: 'comedy',
    name: 'comedy',
    displayName: 'Комедия',
    description: 'Веселые и забавные персонажи',
    icon: '😂',
    nsfw: false,
  },
  BUSINESS: {
    id: 'business',
    name: 'business',
    displayName: 'Бизнес',
    description: 'Профессиональные персонажи и наставники',
    icon: '💼',
    nsfw: false,
  },
  EDUCATIONAL: {
    id: 'educational',
    name: 'educational',
    displayName: 'Образование',
    description: 'Учителя и эксперты в разных областях',
    icon: '📚',
    nsfw: false,
  },
  GAMING: {
    id: 'gaming',
    name: 'gaming',
    displayName: 'Геймеры',
    description: 'Персонажи из видеоигр и гейминга',
    icon: '🎮',
    nsfw: false,
  },
  CELEBRITIES: {
    id: 'celebrities',
    name: 'celebrities',
    displayName: 'Знаменитости',
    description: 'Вдохновлено известными личностями',
    icon: '⭐',
    nsfw: false,
  },
} as const;

// ===========================================
// Message Limits
// ===========================================

export const MESSAGE_LIMITS = {
  FREE: {
    messagesPerDay: 10,
    charactersPerMessage: 500,
    resetHour: 0, // UTC midnight
  },
  BASIC: {
    messagesPerDay: 100,
    charactersPerMessage: 1000,
    resetHour: 0,
  },
  PREMIUM: {
    messagesPerDay: -1, // unlimited
    charactersPerMessage: 2000,
    resetHour: 0,
  },
  // Global limits
  MIN_MESSAGE_LENGTH: 1,
  MAX_MESSAGE_LENGTH: 2000,
  TYPING_TIMEOUT: 30000, // 30 seconds
} as const;

// ===========================================
// API Endpoints
// ===========================================

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY_EMAIL: '/auth/verify-email',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD: '/auth/change-password',
  },

  // User Management
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    DELETE_ACCOUNT: '/user/delete',
    PREFERENCES: '/user/preferences',
    STATISTICS: '/user/statistics',
  },

  // Characters
  CHARACTERS: {
    LIST: '/characters',
    GET: '/characters/:id',
    CREATE: '/characters',
    UPDATE: '/characters/:id',
    DELETE: '/characters/:id',
    CATEGORIES: '/characters/categories',
    SEARCH: '/characters/search',
    FEATURED: '/characters/featured',
  },

  // Chat
  CHAT: {
    CONVERSATIONS: '/chat/conversations',
    MESSAGES: '/chat/conversations/:id/messages',
    SEND_MESSAGE: '/chat/conversations/:id/messages',
    DELETE_CONVERSATION: '/chat/conversations/:id',
    TYPING: '/chat/conversations/:id/typing',
  },

  // Subscriptions
  SUBSCRIPTIONS: {
    PLANS: '/subscriptions/plans',
    CURRENT: '/subscriptions/current',
    SUBSCRIBE: '/subscriptions/subscribe',
    CANCEL: '/subscriptions/cancel',
    UPGRADE: '/subscriptions/upgrade',
    BILLING_HISTORY: '/subscriptions/billing',
  },

  // File Upload
  UPLOAD: {
    AVATAR: '/upload/avatar',
    CHARACTER_IMAGE: '/upload/character',
    DOCUMENT: '/upload/document',
    VOICE: '/upload/voice',
  },

  // Admin (if needed)
  ADMIN: {
    USERS: '/admin/users',
    CHARACTERS: '/admin/characters',
    ANALYTICS: '/admin/analytics',
  },
} as const;

// Placeholder for additional constants sections
// These will be implemented in subsequent tasks

// ===========================================
// Personality Traits
// ===========================================

export const PERSONALITY_TRAITS: Record<string, PersonalityTrait> = {
  FRIENDLY: {
    id: 'friendly',
    name: 'friendly',
    displayName: 'Дружелюбный',
    description: 'Открытый, приветливый и легкий в общении',
    opposite: 'cold',
  },
  MYSTERIOUS: {
    id: 'mysterious',
    name: 'mysterious',
    displayName: 'Загадочный',
    description: 'Таинственный, интригующий, скрывает секреты',
    opposite: 'transparent',
  },
  FLIRTY: {
    id: 'flirty',
    name: 'flirty',
    displayName: 'Флиртующий',
    description: 'Кокетливый, обаятельный, любит флиртовать',
    opposite: 'reserved',
  },
  WISE: {
    id: 'wise',
    name: 'wise',
    displayName: 'Мудрый',
    description: 'Умный, опытный, дает ценные советы',
    opposite: 'naive',
  },
  PLAYFUL: {
    id: 'playful',
    name: 'playful',
    displayName: 'Игривый',
    description: 'Веселый, шаловливый, любит развлечения',
    opposite: 'serious',
  },
  SERIOUS: {
    id: 'serious',
    name: 'serious',
    displayName: 'Серьезный',
    description: 'Сосредоточенный, ответственный, деловой',
    opposite: 'playful',
  },
  CONFIDENT: {
    id: 'confident',
    name: 'confident',
    displayName: 'Уверенный',
    description: 'Самоуверенный, решительный, лидер по натуре',
    opposite: 'insecure',
  },
  SHY: {
    id: 'shy',
    name: 'shy',
    displayName: 'Застенчивый',
    description: 'Скромный, тихий, стесняется в общении',
    opposite: 'confident',
  },
  ROMANTIC: {
    id: 'romantic',
    name: 'romantic',
    displayName: 'Романтичный',
    description: 'Нежный, страстный, верит в настоящую любовь',
    opposite: 'cynical',
  },
  SARCASTIC: {
    id: 'sarcastic',
    name: 'sarcastic',
    displayName: 'Саркастичный',
    description: 'Ироничный, остроумный, любит подколки',
    opposite: 'sincere',
  },
  CARING: {
    id: 'caring',
    name: 'caring',
    displayName: 'Заботливый',
    description: 'Внимательный, добрый, всегда готов помочь',
    opposite: 'indifferent',
  },
  REBELLIOUS: {
    id: 'rebellious',
    name: 'rebellious',
    displayName: 'Бунтарский',
    description: 'Независимый, свободолюбивый, против правил',
    opposite: 'obedient',
  },
  INTELLECTUAL: {
    id: 'intellectual',
    name: 'intellectual',
    displayName: 'Интеллектуал',
    description: 'Умный, образованный, любит философствовать',
    opposite: 'simple',
  },
  ADVENTUROUS: {
    id: 'adventurous',
    name: 'adventurous',
    displayName: 'Авантюрный',
    description: 'Смелый, любит приключения и риск',
    opposite: 'cautious',
  },
  CALM: {
    id: 'calm',
    name: 'calm',
    displayName: 'Спокойный',
    description: 'Уравновешенный, терпеливый, не теряет самообладания',
    opposite: 'energetic',
  },
  ENERGETIC: {
    id: 'energetic',
    name: 'energetic',
    displayName: 'Энергичный',
    description: 'Активный, полный энтузиазма и жизненных сил',
    opposite: 'calm',
  },
} as const;

// ===========================================
// Supported Languages
// ===========================================

export const SUPPORTED_LANGUAGES: Record<string, Language> = {
  RU: {
    code: 'ru',
    name: 'Russian',
    displayName: 'Русский',
    flag: '🇷🇺',
  },
  EN: {
    code: 'en',
    name: 'English',
    displayName: 'English',
    flag: '🇺🇸',
  },
  ES: {
    code: 'es',
    name: 'Spanish',
    displayName: 'Español',
    flag: '🇪🇸',
  },
  FR: {
    code: 'fr',
    name: 'French',
    displayName: 'Français',
    flag: '🇫🇷',
  },
  DE: {
    code: 'de',
    name: 'German',
    displayName: 'Deutsch',
    flag: '🇩🇪',
  },
  IT: {
    code: 'it',
    name: 'Italian',
    displayName: 'Italiano',
    flag: '🇮🇹',
  },
  PT: {
    code: 'pt',
    name: 'Portuguese',
    displayName: 'Português',
    flag: '🇵🇹',
  },
  JA: {
    code: 'ja',
    name: 'Japanese',
    displayName: '日本語',
    flag: '🇯🇵',
  },
  KO: {
    code: 'ko',
    name: 'Korean',
    displayName: '한국어',
    flag: '🇰🇷',
  },
  ZH: {
    code: 'zh',
    name: 'Chinese',
    displayName: '中文',
    flag: '🇨🇳',
  },
} as const;

// ===========================================
// File Upload Limits
// ===========================================

export const FILE_UPLOAD_LIMITS: Record<string, FileUploadConfig> = {
  AVATAR: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    extensions: ['.jpg', '.jpeg', '.png', '.webp'],
  },
  CHARACTER_IMAGE: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
    ],
    extensions: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
  },
  DOCUMENT: {
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: [
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    extensions: ['.pdf', '.txt', '.doc', '.docx'],
  },
  VOICE: {
    maxSize: 25 * 1024 * 1024, // 25MB
    allowedTypes: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm'],
    extensions: ['.mp3', '.wav', '.ogg', '.webm'],
  },
} as const;

// Upload limits by subscription tier
export const UPLOAD_LIMITS_BY_TIER = {
  FREE: {
    avatar: true,
    characterImage: false,
    document: false,
    voice: false,
    maxFilesPerDay: 3,
  },
  BASIC: {
    avatar: true,
    characterImage: true,
    document: true,
    voice: false,
    maxFilesPerDay: 20,
  },
  PREMIUM: {
    avatar: true,
    characterImage: true,
    document: true,
    voice: true,
    maxFilesPerDay: -1, // unlimited
  },
} as const;

// ===========================================
// Validation Patterns
// ===========================================

export const REGEX_PATTERNS: Record<string, ValidationPattern> = {
  EMAIL: {
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: 'Введите корректный email адрес',
    example: 'user@example.com',
  },
  PASSWORD: {
    pattern:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    message:
      'Пароль должен содержать минимум 8 символов, включая заглавные и строчные буквы, цифры и спецсимволы',
    example: 'MyPass123!',
  },
  USERNAME: {
    pattern: /^[a-zA-Z0-9_]{3,20}$/,
    message:
      'Имя пользователя должно содержать только буквы, цифры и подчеркивания (3-20 символов)',
    example: 'username123',
  },
  PHONE: {
    pattern: /^\+?[1-9]\d{1,14}$/,
    message: 'Введите корректный номер телефона',
    example: '+1234567890',
  },
  URL: {
    pattern: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
    message: 'Введите корректный URL',
    example: 'https://example.com',
  },
  CHARACTER_NAME: {
    pattern: /^[a-zA-ZА-Яа-я0-9\s]{2,30}$/,
    message:
      'Имя персонажа должно содержать только буквы, цифры и пробелы (2-30 символов)',
    example: 'Анна Смит',
  },
  DISPLAY_NAME: {
    pattern: /^[a-zA-ZА-Яа-я0-9\s]{2,50}$/,
    message:
      'Отображаемое имя должно содержать только буквы, цифры и пробелы (2-50 символов)',
    example: 'Мой Профиль',
  },
  SLUG: {
    pattern: /^[a-z0-9-]+$/,
    message: 'Slug должен содержать только строчные буквы, цифры и дефисы',
    example: 'my-character-name',
  },
  HEX_COLOR: {
    pattern: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    message: 'Введите корректный HEX цвет',
    example: '#FF5733',
  },
  TAG: {
    pattern: /^[a-zA-ZА-Яа-я0-9]{2,20}$/,
    message: 'Тег должен содержать только буквы и цифры (2-20 символов)',
    example: 'романтика',
  },
} as const;

// ===========================================
// Additional Types & Utility Constants
// ===========================================

// Subscription Plan Keys
export type SubscriptionPlanId = keyof typeof SUBSCRIPTION_PLANS;
export type CharacterCategoryId = keyof typeof CHARACTER_CATEGORIES;
export type PersonalityTraitId = keyof typeof PERSONALITY_TRAITS;
export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES;
export type FileUploadType = keyof typeof FILE_UPLOAD_LIMITS;
export type ValidationPatternType = keyof typeof REGEX_PATTERNS;

// Application Status Constants
export const APP_STATUS = {
  LOADING: 'loading',
  READY: 'ready',
  ERROR: 'error',
  MAINTENANCE: 'maintenance',
} as const;

// Theme Constants
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto',
} as const;

// Chat Message Types
export const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  VOICE: 'voice',
  SYSTEM: 'system',
} as const;

// Animation Durations (ms)
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  EXTRA_SLOW: 1000,
} as const;

// Breakpoints (matches Tailwind CSS)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// Z-Index Layers
export const Z_INDEX = {
  DROPDOWN: 10,
  STICKY: 20,
  FIXED: 30,
  MODAL_BACKDROP: 40,
  MODAL: 50,
  POPOVER: 60,
  TOOLTIP: 70,
  TOAST: 80,
} as const;

// Default Values
export const DEFAULTS = {
  AVATAR_SIZE: 40,
  CHARACTER_IMAGE_ASPECT_RATIO: '3/4',
  MESSAGES_PER_PAGE: 50,
  CHARACTERS_PER_PAGE: 24,
  SEARCH_DEBOUNCE_MS: 300,
  TYPING_INDICATOR_TIMEOUT: 30000,
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  MAX_CONVERSATION_TITLE_LENGTH: 50,
} as const;

// Error Codes
export const ERROR_CODES = {
  // Authentication
  UNAUTHORIZED: 'UNAUTHORIZED',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',

  // Subscription
  SUBSCRIPTION_REQUIRED: 'SUBSCRIPTION_REQUIRED',
  SUBSCRIPTION_EXPIRED: 'SUBSCRIPTION_EXPIRED',
  UPGRADE_REQUIRED: 'UPGRADE_REQUIRED',

  // Limits
  MESSAGE_LIMIT_EXCEEDED: 'MESSAGE_LIMIT_EXCEEDED',
  CHARACTER_LIMIT_EXCEEDED: 'CHARACTER_LIMIT_EXCEEDED',
  FILE_SIZE_EXCEEDED: 'FILE_SIZE_EXCEEDED',
  FILE_TYPE_NOT_ALLOWED: 'FILE_TYPE_NOT_ALLOWED',

  // General
  SERVER_ERROR: 'SERVER_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  RATE_LIMITED: 'RATE_LIMITED',
} as const;

// Success Messages (Russian)
export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: 'Профиль успешно обновлен',
  CHARACTER_CREATED: 'Персонаж успешно создан',
  CHARACTER_UPDATED: 'Персонаж успешно обновлен',
  CHARACTER_DELETED: 'Персонаж удален',
  SUBSCRIPTION_UPDATED: 'Подписка обновлена',
  FILE_UPLOADED: 'Файл успешно загружен',
  PASSWORD_CHANGED: 'Пароль изменен',
  EMAIL_VERIFIED: 'Email подтвержден',
  SETTINGS_SAVED: 'Настройки сохранены',
} as const;

// Error Messages (Russian)
export const ERROR_MESSAGES = {
  GENERIC_ERROR: 'Произошла ошибка. Попробуйте еще раз.',
  NETWORK_ERROR: 'Ошибка сети. Проверьте подключение к интернету.',
  SERVER_ERROR: 'Ошибка сервера. Попробуйте позже.',
  UNAUTHORIZED: 'Необходима авторизация',
  SESSION_EXPIRED: 'Сессия истекла. Войдите заново.',
  VALIDATION_ERROR: 'Проверьте правильность введенных данных',
  MESSAGE_LIMIT_EXCEEDED: 'Достигнут лимит сообщений. Обновите подписку.',
  FILE_TOO_LARGE: 'Файл слишком большой',
  INVALID_FILE_TYPE: 'Неподдерживаемый тип файла',
  CHARACTER_LIMIT_EXCEEDED: 'Достигнут лимит персонажей',
  SUBSCRIPTION_REQUIRED: 'Требуется подписка для этой функции',
  RATE_LIMITED: 'Слишком много запросов. Попробуйте позже.',
} as const;

// ===========================================
// Grouped Exports (Barrel Pattern)
// ===========================================

/**
 * @namespace Subscription - Константы подписок и тарифов
 */
export const Subscription = {
  PLANS: SUBSCRIPTION_PLANS,
  MESSAGE_LIMITS,
  UPLOAD_LIMITS_BY_TIER,
} as const;

/**
 * @namespace Characters - Константы персонажей
 */
export const Characters = {
  CATEGORIES: CHARACTER_CATEGORIES,
  PERSONALITY_TRAITS,
} as const;

/**
 * @namespace Validation - Константы валидации
 */
export const Validation = {
  PATTERNS: REGEX_PATTERNS,
  FILE_UPLOAD_LIMITS,
} as const;

/**
 * @namespace Localization - Константы локализации
 */
export const Localization = {
  LANGUAGES: SUPPORTED_LANGUAGES,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
} as const;

/**
 * @namespace API - Константы API
 */
export const API = {
  ENDPOINTS: API_ENDPOINTS,
  ERROR_CODES,
} as const;

/**
 * @namespace UI - Константы интерфейса
 */
export const UI = {
  THEMES,
  ANIMATION_DURATION,
  BREAKPOINTS,
  Z_INDEX,
  DEFAULTS,
} as const;

/**
 * @namespace App - Общие константы приложения
 */
export const App = {
  STATUS: APP_STATUS,
  MESSAGE_TYPES,
} as const;

// ===========================================
// Utility Functions
// ===========================================

/**
 * Получить план подписки по ID
 * @param planId - ID плана подписки
 * @returns План подписки или undefined
 */
export function getSubscriptionPlan(
  planId: SubscriptionPlanId
): SubscriptionPlan | undefined {
  return SUBSCRIPTION_PLANS[planId];
}

/**
 * Получить категорию персонажа по ID
 * @param categoryId - ID категории
 * @returns Категория персонажа или undefined
 */
export function getCharacterCategory(
  categoryId: CharacterCategoryId
): CharacterCategory | undefined {
  return CHARACTER_CATEGORIES[categoryId];
}

/**
 * Получить черту личности по ID
 * @param traitId - ID черты личности
 * @returns Черта личности или undefined
 */
export function getPersonalityTrait(
  traitId: PersonalityTraitId
): PersonalityTrait | undefined {
  return PERSONALITY_TRAITS[traitId];
}

/**
 * Проверить валидность значения по паттерну
 * @param value - Проверяемое значение
 * @param patternType - Тип паттерна валидации
 * @returns true если значение валидно
 */
export function validateValue(
  value: string,
  patternType: ValidationPatternType
): boolean {
  const pattern = REGEX_PATTERNS[patternType];
  return pattern ? pattern.pattern.test(value) : false;
}

/**
 * Получить лимиты файлов для типа загрузки
 * @param uploadType - Тип загружаемого файла
 * @returns Конфигурация лимитов файла
 */
export function getFileUploadLimits(
  uploadType: FileUploadType
): FileUploadConfig | undefined {
  return FILE_UPLOAD_LIMITS[uploadType];
}

/**
 * Проверить, поддерживается ли тип файла
 * @param fileType - MIME тип файла
 * @param uploadType - Тип загрузки
 * @returns true если тип поддерживается
 */
export function isFileTypeSupported(
  fileType: string,
  uploadType: FileUploadType
): boolean {
  const limits = getFileUploadLimits(uploadType);
  return limits ? limits.allowedTypes.includes(fileType) : false;
}

/**
 * Форматировать размер файла в человекочитаемый вид
 * @param bytes - Размер в байтах
 * @returns Отформатированная строка
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Б';

  const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i]}`;
}

// ===========================================
// Type Guards
// ===========================================

/**
 * Проверить, является ли значение валидным ID плана подписки
 * @param value - Проверяемое значение
 * @returns true если значение является SubscriptionPlanId
 */
export function isSubscriptionPlanId(
  value: string
): value is SubscriptionPlanId {
  return value in SUBSCRIPTION_PLANS;
}

/**
 * Проверить, является ли значение валидным ID категории персонажа
 * @param value - Проверяемое значение
 * @returns true если значение является CharacterCategoryId
 */
export function isCharacterCategoryId(
  value: string
): value is CharacterCategoryId {
  return value in CHARACTER_CATEGORIES;
}

/**
 * Проверить, является ли значение валидным кодом языка
 * @param value - Проверяемое значение
 * @returns true если значение является LanguageCode
 */
export function isLanguageCode(value: string): value is LanguageCode {
  return value in SUPPORTED_LANGUAGES;
}
