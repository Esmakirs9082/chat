// Типы для форм

export interface LoginForm {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterForm {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  isOver18: boolean;
}

export interface CharacterCreateForm {
  name: string;
  description: string;
  avatar?: File;
  personality: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
  };
  isNsfw: boolean;
  tags: string[];
  isPublic: boolean;
}

export interface UserSettingsForm {
  username?: string;
  email?: string;
  avatar?: File;
  theme: 'dark' | 'light';
  nsfwEnabled: boolean;
  notifications: boolean;
}
