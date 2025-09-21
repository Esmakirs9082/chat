/**
 * Environment Configuration
 * Централизованная конфигурация переменных окружения с типизацией и валидацией
 */

// Типы для environment переменных
export interface EnvironmentConfig {
  // API Configuration
  API_URL: string;
  WS_URL: string;
  API_TIMEOUT: number;
  API_RETRY_ATTEMPTS: number;

  // Authentication & Security
  TOKEN_EXPIRY: number;
  REFRESH_TOKEN_EXPIRY: number;
  SECURE_COOKIES: boolean;
  STORAGE_PREFIX: string;

  // External Services
  STRIPE_PUBLISHABLE_KEY: string;
  GOOGLE_CLIENT_ID: string;
  DISCORD_CLIENT_ID: string;
  SENTRY_DSN: string;
  SENTRY_ENVIRONMENT: string;
  GA_TRACKING_ID: string;
  GTM_ID: string;
  POSTHOG_KEY: string;
  POSTHOG_HOST: string;

  // App Configuration
  APP_ENV: 'development' | 'staging' | 'production';
  APP_VERSION: string;
  NODE_ENV: 'development' | 'production' | 'test';
  DEFAULT_THEME: 'light' | 'dark' | 'system';
  DEFAULT_LANGUAGE: string;
  MAX_FILE_SIZE: number;
  SUPPORTED_FILE_TYPES: string[];

  // Rate Limiting & Performance
  RATE_LIMIT_RPM: number;
  MESSAGE_RATE_LIMIT: number;
  CONNECTION_TIMEOUT: number;
  WS_HEARTBEAT_INTERVAL: number;

  // Content & Moderation
  CONTENT_FILTER_LEVEL: 'strict' | 'moderate' | 'permissive';
  MAX_MESSAGE_LENGTH: number;
  MAX_MESSAGES_PER_CHAT: number;

  // URLs & Links
  TERMS_URL: string;
  PRIVACY_URL: string;
  SUPPORT_EMAIL: string;
  TWITTER_URL: string;
  DISCORD_URL: string;

  // Feature Flags
  FEATURES: FeatureFlags;
}

export interface FeatureFlags {
  ENABLE_ANALYTICS: boolean;
  ENABLE_SENTRY: boolean;
  ENABLE_SUBSCRIPTIONS: boolean;
  ENABLE_NSFW_CONTENT: boolean;
  ENABLE_CHARACTER_CREATION: boolean;
  ENABLE_REALTIME_CHAT: boolean;
  ENABLE_BETA_FEATURES: boolean;
  ENABLE_DEBUG_MODE: boolean;
  ENABLE_DEV_TOOLS: boolean;
  ENABLE_MODERATION: boolean;
  USE_MOCK_API: boolean;
  SHOW_PERFORMANCE: boolean;
  ENABLE_SW: boolean;
  ENABLE_PWA: boolean;
  HMR: boolean;
}

// Default значения для development
const DEFAULT_VALUES = {
  // API Configuration
  API_URL: 'http://localhost:3001/api',
  WS_URL: 'ws://localhost:3001',
  API_TIMEOUT: 30000,
  API_RETRY_ATTEMPTS: 3,

  // Authentication & Security
  TOKEN_EXPIRY: 86400,
  REFRESH_TOKEN_EXPIRY: 604800,
  SECURE_COOKIES: false,
  STORAGE_PREFIX: 'aichat_',

  // External Services
  STRIPE_PUBLISHABLE_KEY: '',
  GOOGLE_CLIENT_ID: '',
  DISCORD_CLIENT_ID: '',
  SENTRY_DSN: '',
  SENTRY_ENVIRONMENT: 'development',
  GA_TRACKING_ID: '',
  GTM_ID: '',
  POSTHOG_KEY: '',
  POSTHOG_HOST: '',

  // App Configuration
  APP_ENV: 'development' as const,
  APP_VERSION: '1.0.0',
  DEFAULT_THEME: 'dark' as const,
  DEFAULT_LANGUAGE: 'en',
  MAX_FILE_SIZE: 10485760,
  SUPPORTED_FILE_TYPES: ['jpg', 'jpeg', 'png', 'gif', 'webp'] as string[],

  // Rate Limiting & Performance
  RATE_LIMIT_RPM: 60,
  MESSAGE_RATE_LIMIT: 20,
  CONNECTION_TIMEOUT: 10000,
  WS_HEARTBEAT_INTERVAL: 30000,

  // Content & Moderation
  CONTENT_FILTER_LEVEL: 'moderate' as const,
  MAX_MESSAGE_LENGTH: 2000,
  MAX_MESSAGES_PER_CHAT: 1000,

  // URLs & Links
  TERMS_URL: '/terms',
  PRIVACY_URL: '/privacy',
  SUPPORT_EMAIL: 'support@aichat.com',
  TWITTER_URL: 'https://twitter.com/aichat',
  DISCORD_URL: 'https://discord.gg/aichat',
} as const;

// Default feature flags
const DEFAULT_FEATURES: FeatureFlags = {
  ENABLE_ANALYTICS: false,
  ENABLE_SENTRY: false,
  ENABLE_SUBSCRIPTIONS: true,
  ENABLE_NSFW_CONTENT: true,
  ENABLE_CHARACTER_CREATION: true,
  ENABLE_REALTIME_CHAT: true,
  ENABLE_BETA_FEATURES: true,
  ENABLE_DEBUG_MODE: true,
  ENABLE_DEV_TOOLS: true,
  ENABLE_MODERATION: true,
  USE_MOCK_API: false,
  SHOW_PERFORMANCE: false,
  ENABLE_SW: false,
  ENABLE_PWA: false,
  HMR: true,
};

/**
 * Получение переменной окружения с fallback
 */
function getEnvVar(key: string, defaultValue?: string): string {
  const value = import.meta.env[key];
  if (value !== undefined) {
    return value;
  }
  if (defaultValue !== undefined) {
    return defaultValue;
  }
  throw new Error(`Environment variable ${key} is required but not set`);
}

/**
 * Получение булевой переменной окружения
 */
function getBooleanEnvVar(key: string, defaultValue: boolean): boolean {
  const value = import.meta.env[key];
  if (value === undefined) {
    return defaultValue;
  }
  return value === 'true' || value === '1';
}

/**
 * Парсинг feature flags из environment переменных
 */
function parseFeatureFlags(): FeatureFlags {
  const isProduction = import.meta.env.NODE_ENV === 'production';
  const baseFeatures = isProduction ? PRODUCTION_FEATURES : DEFAULT_FEATURES;

  return {
    ENABLE_ANALYTICS: getBooleanEnvVar(
      'VITE_ENABLE_ANALYTICS',
      baseFeatures.ENABLE_ANALYTICS
    ),
    ENABLE_SENTRY: getBooleanEnvVar(
      'VITE_ENABLE_SENTRY',
      baseFeatures.ENABLE_SENTRY
    ),
    ENABLE_SUBSCRIPTIONS: getBooleanEnvVar(
      'VITE_ENABLE_SUBSCRIPTIONS',
      baseFeatures.ENABLE_SUBSCRIPTIONS
    ),
    ENABLE_NSFW_CONTENT: getBooleanEnvVar(
      'VITE_ENABLE_NSFW',
      baseFeatures.ENABLE_NSFW_CONTENT
    ),
    ENABLE_CHARACTER_CREATION: getBooleanEnvVar(
      'VITE_ENABLE_CHARACTER_CREATION',
      baseFeatures.ENABLE_CHARACTER_CREATION
    ),
    ENABLE_REALTIME_CHAT: getBooleanEnvVar(
      'VITE_ENABLE_REALTIME_CHAT',
      baseFeatures.ENABLE_REALTIME_CHAT
    ),
    ENABLE_BETA_FEATURES: getBooleanEnvVar(
      'VITE_ENABLE_BETA_FEATURES',
      baseFeatures.ENABLE_BETA_FEATURES
    ),
    ENABLE_DEBUG_MODE: getBooleanEnvVar(
      'VITE_DEBUG_MODE',
      baseFeatures.ENABLE_DEBUG_MODE
    ),
    ENABLE_DEV_TOOLS: getBooleanEnvVar(
      'VITE_ENABLE_DEV_TOOLS',
      baseFeatures.ENABLE_DEV_TOOLS
    ),
    ENABLE_MODERATION: getBooleanEnvVar(
      'VITE_ENABLE_MODERATION',
      baseFeatures.ENABLE_MODERATION
    ),
    USE_MOCK_API: getBooleanEnvVar(
      'VITE_USE_MOCK_API',
      baseFeatures.USE_MOCK_API
    ),
    SHOW_PERFORMANCE: getBooleanEnvVar(
      'VITE_SHOW_PERFORMANCE',
      baseFeatures.SHOW_PERFORMANCE
    ),
    ENABLE_SW: getBooleanEnvVar('VITE_ENABLE_SW', baseFeatures.ENABLE_SW),
    ENABLE_PWA: getBooleanEnvVar('VITE_ENABLE_PWA', baseFeatures.ENABLE_PWA),
    HMR: getBooleanEnvVar('VITE_HMR', baseFeatures.HMR),
  };
}

/**
 * Утилита для парсинга числовых значений
 */
function getNumericEnvVar(key: string, defaultValue: number): number {
  const value = import.meta.env[key];
  if (value === undefined) {
    return defaultValue;
  }
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Утилита для парсинга массивов
 */
function getArrayEnvVar(key: string, defaultValue: string[]): string[] {
  const value = import.meta.env[key];
  if (value === undefined) {
    return defaultValue;
  }
  return value
    .split(',')
    .map((item: string) => item.trim())
    .filter(Boolean);
}

// Production feature flags
const PRODUCTION_FEATURES: FeatureFlags = {
  ENABLE_ANALYTICS: true,
  ENABLE_SENTRY: true,
  ENABLE_SUBSCRIPTIONS: true,
  ENABLE_NSFW_CONTENT: false,
  ENABLE_CHARACTER_CREATION: true,
  ENABLE_REALTIME_CHAT: true,
  ENABLE_BETA_FEATURES: false,
  ENABLE_DEBUG_MODE: false,
  ENABLE_DEV_TOOLS: false,
  ENABLE_MODERATION: true,
  USE_MOCK_API: false,
  SHOW_PERFORMANCE: false,
  ENABLE_SW: true,
  ENABLE_PWA: true,
  HMR: false,
};

/**
 * Валидация обязательных переменных для production
 */
function validateProductionEnvironment(config: EnvironmentConfig): void {
  if (config.APP_ENV !== 'production') {
    return;
  }

  const requiredForProduction = [
    { key: 'API_URL', value: config.API_URL },
    { key: 'WS_URL', value: config.WS_URL },
  ];

  const missing = requiredForProduction.filter(({ value }) => !value);

  if (missing.length > 0) {
    const missingKeys = missing.map(({ key }) => key).join(', ');
    throw new Error(
      `Missing required environment variables for production: ${missingKeys}`
    );
  }

  // Предупреждения для рекомендуемых переменных
  if (!config.STRIPE_PUBLISHABLE_KEY) {
    console.warn(
      'VITE_STRIPE_PUBLISHABLE_KEY not set - payments will be disabled'
    );
  }

  if (!config.SENTRY_DSN) {
    console.warn('VITE_SENTRY_DSN not set - error tracking will be disabled');
  }
}

/**
 * Создание конфигурации окружения
 */
function createEnvironmentConfig(): EnvironmentConfig {
  const nodeEnv =
    (import.meta.env.NODE_ENV as EnvironmentConfig['NODE_ENV']) ||
    'development';
  const appEnv =
    (import.meta.env.VITE_APP_ENV as EnvironmentConfig['APP_ENV']) ||
    'development';

  const config: EnvironmentConfig = {
    // API Configuration
    API_URL: getEnvVar('VITE_API_URL', DEFAULT_VALUES.API_URL),
    WS_URL: getEnvVar('VITE_WS_URL', DEFAULT_VALUES.WS_URL),
    API_TIMEOUT: getNumericEnvVar(
      'VITE_API_TIMEOUT',
      DEFAULT_VALUES.API_TIMEOUT
    ),
    API_RETRY_ATTEMPTS: getNumericEnvVar(
      'VITE_API_RETRY_ATTEMPTS',
      DEFAULT_VALUES.API_RETRY_ATTEMPTS
    ),

    // Authentication & Security
    TOKEN_EXPIRY: getNumericEnvVar(
      'VITE_TOKEN_EXPIRY',
      DEFAULT_VALUES.TOKEN_EXPIRY
    ),
    REFRESH_TOKEN_EXPIRY: getNumericEnvVar(
      'VITE_REFRESH_TOKEN_EXPIRY',
      DEFAULT_VALUES.REFRESH_TOKEN_EXPIRY
    ),
    SECURE_COOKIES: getBooleanEnvVar(
      'VITE_SECURE_COOKIES',
      DEFAULT_VALUES.SECURE_COOKIES
    ),
    STORAGE_PREFIX: getEnvVar(
      'VITE_STORAGE_PREFIX',
      DEFAULT_VALUES.STORAGE_PREFIX
    ),

    // External Services
    STRIPE_PUBLISHABLE_KEY: getEnvVar(
      'VITE_STRIPE_PUBLISHABLE_KEY',
      DEFAULT_VALUES.STRIPE_PUBLISHABLE_KEY
    ),
    GOOGLE_CLIENT_ID: getEnvVar(
      'VITE_GOOGLE_CLIENT_ID',
      DEFAULT_VALUES.GOOGLE_CLIENT_ID
    ),
    DISCORD_CLIENT_ID: getEnvVar(
      'VITE_DISCORD_CLIENT_ID',
      DEFAULT_VALUES.DISCORD_CLIENT_ID
    ),
    SENTRY_DSN: getEnvVar('VITE_SENTRY_DSN', DEFAULT_VALUES.SENTRY_DSN),
    SENTRY_ENVIRONMENT: getEnvVar(
      'VITE_SENTRY_ENVIRONMENT',
      DEFAULT_VALUES.SENTRY_ENVIRONMENT
    ),
    GA_TRACKING_ID: getEnvVar(
      'VITE_GA_TRACKING_ID',
      DEFAULT_VALUES.GA_TRACKING_ID
    ),
    GTM_ID: getEnvVar('VITE_GTM_ID', DEFAULT_VALUES.GTM_ID),
    POSTHOG_KEY: getEnvVar('VITE_POSTHOG_KEY', DEFAULT_VALUES.POSTHOG_KEY),
    POSTHOG_HOST: getEnvVar('VITE_POSTHOG_HOST', DEFAULT_VALUES.POSTHOG_HOST),

    // App Configuration
    APP_ENV: appEnv,
    NODE_ENV: nodeEnv,
    APP_VERSION: getEnvVar('VITE_APP_VERSION', DEFAULT_VALUES.APP_VERSION),
    DEFAULT_THEME:
      (import.meta.env
        .VITE_DEFAULT_THEME as EnvironmentConfig['DEFAULT_THEME']) ||
      DEFAULT_VALUES.DEFAULT_THEME,
    DEFAULT_LANGUAGE: getEnvVar(
      'VITE_DEFAULT_LANGUAGE',
      DEFAULT_VALUES.DEFAULT_LANGUAGE
    ),
    MAX_FILE_SIZE: getNumericEnvVar(
      'VITE_MAX_FILE_SIZE',
      DEFAULT_VALUES.MAX_FILE_SIZE
    ),
    SUPPORTED_FILE_TYPES: getArrayEnvVar(
      'VITE_SUPPORTED_FILE_TYPES',
      DEFAULT_VALUES.SUPPORTED_FILE_TYPES
    ),

    // Rate Limiting & Performance
    RATE_LIMIT_RPM: getNumericEnvVar(
      'VITE_RATE_LIMIT_RPM',
      DEFAULT_VALUES.RATE_LIMIT_RPM
    ),
    MESSAGE_RATE_LIMIT: getNumericEnvVar(
      'VITE_MESSAGE_RATE_LIMIT',
      DEFAULT_VALUES.MESSAGE_RATE_LIMIT
    ),
    CONNECTION_TIMEOUT: getNumericEnvVar(
      'VITE_CONNECTION_TIMEOUT',
      DEFAULT_VALUES.CONNECTION_TIMEOUT
    ),
    WS_HEARTBEAT_INTERVAL: getNumericEnvVar(
      'VITE_WS_HEARTBEAT_INTERVAL',
      DEFAULT_VALUES.WS_HEARTBEAT_INTERVAL
    ),

    // Content & Moderation
    CONTENT_FILTER_LEVEL:
      (import.meta.env
        .VITE_CONTENT_FILTER_LEVEL as EnvironmentConfig['CONTENT_FILTER_LEVEL']) ||
      DEFAULT_VALUES.CONTENT_FILTER_LEVEL,
    MAX_MESSAGE_LENGTH: getNumericEnvVar(
      'VITE_MAX_MESSAGE_LENGTH',
      DEFAULT_VALUES.MAX_MESSAGE_LENGTH
    ),
    MAX_MESSAGES_PER_CHAT: getNumericEnvVar(
      'VITE_MAX_MESSAGES_PER_CHAT',
      DEFAULT_VALUES.MAX_MESSAGES_PER_CHAT
    ),

    // URLs & Links
    TERMS_URL: getEnvVar('VITE_TERMS_URL', DEFAULT_VALUES.TERMS_URL),
    PRIVACY_URL: getEnvVar('VITE_PRIVACY_URL', DEFAULT_VALUES.PRIVACY_URL),
    SUPPORT_EMAIL: getEnvVar(
      'VITE_SUPPORT_EMAIL',
      DEFAULT_VALUES.SUPPORT_EMAIL
    ),
    TWITTER_URL: getEnvVar('VITE_TWITTER_URL', DEFAULT_VALUES.TWITTER_URL),
    DISCORD_URL: getEnvVar('VITE_DISCORD_URL', DEFAULT_VALUES.DISCORD_URL),

    // Feature Flags
    FEATURES: parseFeatureFlags(),
  };

  // Валидация
  validateProductionEnvironment(config);

  return config;
}

// Экспорт конфигурации
export const env = createEnvironmentConfig();

// Удобные геттеры для часто используемых значений
export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';

// Feature flags shortcuts
export const features = env.FEATURES;

// API endpoints helpers
export const apiConfig = {
  baseURL: env.API_URL,
  wsURL: env.WS_URL,
  timeout: isDevelopment ? 30000 : 10000,
  retries: isProduction ? 3 : 1,
} as const;

// External services configuration
export const externalServices = {
  stripe: {
    publicKey: env.STRIPE_PUBLISHABLE_KEY,
    enabled: !!env.STRIPE_PUBLISHABLE_KEY && features.ENABLE_SUBSCRIPTIONS,
  },
  sentry: {
    dsn: env.SENTRY_DSN,
    enabled: !!env.SENTRY_DSN && features.ENABLE_SENTRY,
    environment: env.SENTRY_ENVIRONMENT,
    release: env.APP_VERSION,
  },
  analytics: {
    gaTrackingId: env.GA_TRACKING_ID,
    gtmId: env.GTM_ID,
    posthogKey: env.POSTHOG_KEY,
    posthogHost: env.POSTHOG_HOST,
    enabled: features.ENABLE_ANALYTICS,
  },
} as const;

// Debug helpers
if (isDevelopment && features.ENABLE_DEBUG_MODE) {
  console.group('🔧 Environment Configuration');
  console.log('Environment:', env.APP_ENV);
  console.log('Node Environment:', env.NODE_ENV);
  console.log('API URL:', env.API_URL);
  console.log('WebSocket URL:', env.WS_URL);
  console.log('Default Theme:', env.DEFAULT_THEME);
  console.log('Features:', features);
  console.log('External Services:', externalServices);
  console.groupEnd();
}

// Type-safe environment variable access
export function getFeatureFlag(flag: keyof FeatureFlags): boolean {
  return features[flag];
}

// Runtime feature flag checker
export function isFeatureEnabled(flag: keyof FeatureFlags): boolean {
  return getFeatureFlag(flag);
}

// Export types for external use
export type EnvironmentMode = EnvironmentConfig['NODE_ENV'];
