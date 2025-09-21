/// <reference types="vite/client" />

/**
 * Environment Variables Type Definitions
 * Provides type safety for Vite environment variables
 */

interface ImportMetaEnv {
  // ====================================
  // API Configuration
  // ====================================
  readonly VITE_API_URL: string;
  readonly VITE_WS_URL: string;
  readonly VITE_API_TIMEOUT?: string;
  readonly VITE_API_RETRY_ATTEMPTS?: string;

  // ====================================
  // Authentication & Security
  // ====================================
  readonly VITE_TOKEN_EXPIRY?: string;
  readonly VITE_REFRESH_TOKEN_EXPIRY?: string;
  readonly VITE_SECURE_COOKIES?: string;
  readonly VITE_STORAGE_PREFIX?: string;

  // ====================================
  // Third-party Services
  // ====================================
  readonly VITE_STRIPE_PUBLISHABLE_KEY?: string;
  readonly VITE_GOOGLE_CLIENT_ID?: string;
  readonly VITE_DISCORD_CLIENT_ID?: string;
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_SENTRY_ENVIRONMENT?: string;
  readonly VITE_GA_TRACKING_ID?: string;
  readonly VITE_GTM_ID?: string;
  readonly VITE_POSTHOG_KEY?: string;
  readonly VITE_POSTHOG_HOST?: string;

  // ====================================
  // Feature Flags
  // ====================================
  readonly VITE_ENABLE_ANALYTICS?: string;
  readonly VITE_ENABLE_SENTRY?: string;
  readonly VITE_DEBUG_MODE?: string;
  readonly VITE_ENABLE_DEV_TOOLS?: string;
  readonly VITE_ENABLE_BETA_FEATURES?: string;
  readonly VITE_ENABLE_NSFW?: string;
  readonly VITE_ENABLE_SUBSCRIPTIONS?: string;
  readonly VITE_ENABLE_CHARACTER_CREATION?: string;
  readonly VITE_ENABLE_REALTIME_CHAT?: string;

  // ====================================
  // Application Configuration
  // ====================================
  readonly VITE_APP_ENV?: 'development' | 'staging' | 'production';
  readonly VITE_APP_VERSION?: string;
  readonly VITE_DEFAULT_THEME?: 'light' | 'dark' | 'system';
  readonly VITE_DEFAULT_LANGUAGE?: string;
  readonly VITE_MAX_FILE_SIZE?: string;
  readonly VITE_SUPPORTED_FILE_TYPES?: string;

  // ====================================
  // Rate Limiting & Performance
  // ====================================
  readonly VITE_RATE_LIMIT_RPM?: string;
  readonly VITE_MESSAGE_RATE_LIMIT?: string;
  readonly VITE_CONNECTION_TIMEOUT?: string;
  readonly VITE_WS_HEARTBEAT_INTERVAL?: string;

  // ====================================
  // Content & Moderation
  // ====================================
  readonly VITE_ENABLE_MODERATION?: string;
  readonly VITE_CONTENT_FILTER_LEVEL?: 'strict' | 'moderate' | 'permissive';
  readonly VITE_MAX_MESSAGE_LENGTH?: string;
  readonly VITE_MAX_MESSAGES_PER_CHAT?: string;

  // ====================================
  // Development & Testing
  // ====================================
  readonly VITE_USE_MOCK_API?: string;
  readonly VITE_SHOW_PERFORMANCE?: string;
  readonly VITE_ENABLE_SW?: string;
  readonly VITE_ENABLE_PWA?: string;
  readonly VITE_HMR?: string;

  // ====================================
  // URLs & Links
  // ====================================
  readonly VITE_TERMS_URL?: string;
  readonly VITE_PRIVACY_URL?: string;
  readonly VITE_SUPPORT_EMAIL?: string;
  readonly VITE_TWITTER_URL?: string;
  readonly VITE_DISCORD_URL?: string;
}
