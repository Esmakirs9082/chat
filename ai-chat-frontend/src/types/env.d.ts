/// <reference types="vite/client" />

interface ImportMetaEnv {
  // API Configuration
  readonly VITE_API_URL?: string;
  readonly VITE_WS_URL?: string;

  // External Services
  readonly VITE_STRIPE_KEY?: string;
  readonly VITE_SENTRY_DSN?: string;

  // App Configuration
  readonly VITE_APP_VERSION?: string;
  readonly VITE_APP_NAME?: string;

  // Feature Flags
  readonly VITE_ENABLE_ANALYTICS?: string;
  readonly VITE_ENABLE_SENTRY?: string;
  readonly VITE_ENABLE_SUBSCRIPTIONS?: string;
  readonly VITE_ENABLE_NSFW_CONTENT?: string;
  readonly VITE_ENABLE_VOICE_MESSAGES?: string;
  readonly VITE_ENABLE_IMAGE_UPLOAD?: string;
  readonly VITE_ENABLE_BETA_FEATURES?: string;
  readonly VITE_ENABLE_DEBUG_MODE?: string;

  // Standard Vite variables
  readonly NODE_ENV: 'development' | 'production' | 'test';
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
