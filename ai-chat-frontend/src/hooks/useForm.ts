import { useState, useCallback } from 'react';
import { useForm as useReactHookForm } from 'react-hook-form';
import { z } from 'zod';

// Упрощенная версия без zodResolver для обхода проблем с типами
interface UseFormOptions<T extends Record<string, any>> {
  schema: z.ZodSchema<T>;
  onSubmit: (data: T) => Promise<void>;
  defaultValues?: Partial<T>;
  mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
  resetOnSuccess?: boolean;
  successMessage?: string;
  errorMessage?: string;
}

export const useForm = <T extends Record<string, any>>({
  schema,
  onSubmit,
  defaultValues = {},
  mode = 'onChange',
  resetOnSuccess = false,
  successMessage = 'Operation completed successfully!',
  errorMessage = 'An error occurred. Please try again.',
}: UseFormOptions<T>) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const form = useReactHookForm<T>({
    defaultValues: defaultValues as any,
    mode,
  });

  // Ручная валидация через Zod
  const validate = useCallback(
    (data: T) => {
      try {
        schema.parse(data);
        return {};
      } catch (error) {
        if (error instanceof z.ZodError) {
          const errors: Record<string, any> = {};
          error.issues.forEach((issue) => {
            const path = issue.path.join('.');
            if (path) {
              errors[path] = { message: issue.message };
            }
          });
          return errors;
        }
        return {};
      }
    },
    [schema]
  );

  const handleSubmit = form.handleSubmit(async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    // Валидация через Zod
    const validationErrors = validate(data);
    if (Object.keys(validationErrors).length > 0) {
      Object.entries(validationErrors).forEach(([field, error]) => {
        form.setError(field as any, error as any);
      });
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmit(data);
      setSubmitSuccess(successMessage);

      if (resetOnSuccess) {
        form.reset();
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError(error instanceof Error ? error.message : errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  });

  const clearSubmitError = useCallback(() => {
    setSubmitError(null);
  }, []);

  const clearSubmitSuccess = useCallback(() => {
    setSubmitSuccess(null);
  }, []);

  return {
    ...form,
    handleSubmit,
    isSubmitting,
    submitError,
    submitSuccess,
    clearSubmitSuccess,
    clearSubmitError,
  };
};

// Схемы для специализированных форм
export const authSchemas = {
  login: z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    rememberMe: z.boolean().optional(),
  }),

  register: z
    .object({
      username: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(20, 'Username must not exceed 20 characters')
        .regex(
          /^[a-zA-Z0-9_]+$/,
          'Username can only contain letters, numbers, and underscores'
        ),
      email: z.string().email('Please enter a valid email address'),
      password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          'Password must contain at least one lowercase letter, one uppercase letter, and one number'
        ),
      confirmPassword: z.string(),
      acceptTerms: z
        .boolean()
        .refine(
          (val) => val === true,
          'You must accept the terms and conditions'
        ),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    }),

  resetPassword: z.object({
    email: z.string().email('Please enter a valid email address'),
  }),

  changePassword: z
    .object({
      currentPassword: z.string().min(1, 'Current password is required'),
      newPassword: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          'Password must contain at least one lowercase letter, one uppercase letter, and one number'
        ),
      confirmNewPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: "Passwords don't match",
      path: ['confirmNewPassword'],
    }),
};

export const characterSchema = z.object({
  name: z
    .string()
    .min(2, 'Character name must be at least 2 characters')
    .max(50, 'Character name must not exceed 50 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must not exceed 1000 characters'),
  personality: z
    .string()
    .min(5, 'Personality must be at least 5 characters')
    .max(500, 'Personality must not exceed 500 characters'),
  avatar: z.string().url('Please provide a valid avatar URL').optional(),
  tags: z
    .array(z.string())
    .min(1, 'At least one tag is required')
    .max(10, 'Maximum 10 tags allowed'),
  isNSFW: z.boolean().default(false),
  isPublic: z.boolean().default(true),
  category: z
    .enum(['anime', 'realistic', 'fantasy', 'historical', 'sci-fi', 'other'])
    .default('other'),
  age: z
    .number()
    .min(18, 'Character must be at least 18 years old')
    .max(1000, 'Age must be realistic')
    .optional(),
  background: z
    .string()
    .max(2000, 'Background must not exceed 2000 characters')
    .optional(),
});

export const settingsSchema = z.object({
  // Profile settings
  profile: z.object({
    displayName: z
      .string()
      .min(2, 'Display name must be at least 2 characters')
      .max(30, 'Display name must not exceed 30 characters'),
    bio: z.string().max(200, 'Bio must not exceed 200 characters').optional(),
    avatar: z.string().url('Please provide a valid avatar URL').optional(),
    location: z
      .string()
      .max(50, 'Location must not exceed 50 characters')
      .optional(),
    website: z.string().url('Please provide a valid website URL').optional(),
  }),

  // Preferences
  preferences: z.object({
    language: z
      .enum(['en', 'ru', 'es', 'fr', 'de', 'ja', 'ko', 'zh'])
      .default('en'),
    theme: z.enum(['light', 'dark', 'system']).default('system'),
    nsfwEnabled: z.boolean().default(false),
    autoSave: z.boolean().default(true),
    showOnlineStatus: z.boolean().default(true),
  }),

  // Notifications
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(true),
    sound: z.boolean().default(true),
    newMessages: z.boolean().default(true),
    characterUpdates: z.boolean().default(true),
    systemUpdates: z.boolean().default(false),
  }),

  // Privacy
  privacy: z.object({
    profileVisibility: z
      .enum(['public', 'friends', 'private'])
      .default('public'),
    allowDirectMessages: z.boolean().default(true),
    showActivityStatus: z.boolean().default(true),
    dataCollection: z.boolean().default(true),
  }),
});

/**
 * Хук для форм авторизации
 */
export const useAuthForm = (type: keyof typeof authSchemas) => {
  const schema = authSchemas[type];

  const mockAuthSubmit = async (data: any) => {
    // Имитация API вызова
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (type === 'login') {
      console.log('Logging in:', data);
      // Здесь будет реальный вызов API
      // await authApi.login(data);
    } else if (type === 'register') {
      console.log('Registering:', data);
      // await authApi.register(data);
    } else if (type === 'resetPassword') {
      console.log('Resetting password:', data);
      // await authApi.resetPassword(data);
    } else if (type === 'changePassword') {
      console.log('Changing password:', data);
      // await authApi.changePassword(data);
    }
  };

  return useForm({
    schema,
    onSubmit: mockAuthSubmit,
    successMessage:
      type === 'login'
        ? 'Successfully logged in!'
        : type === 'register'
          ? 'Account created successfully!'
          : type === 'resetPassword'
            ? 'Password reset email sent!'
            : 'Password changed successfully!',
    resetOnSuccess: type !== 'login', // Не сбрасывать форму логина
  });
};

/**
 * Хук для формы создания персонажа
 */
export const useCharacterForm = (characterId?: string) => {
  const mockCharacterSubmit = async (data: any) => {
    // Имитация API вызова
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (characterId) {
      console.log('Updating character:', characterId, data);
      // await characterApi.update(characterId, data);
    } else {
      console.log('Creating character:', data);
      // await characterApi.create(data);
    }
  };

  return useForm({
    schema: characterSchema,
    onSubmit: mockCharacterSubmit,
    successMessage: characterId
      ? 'Character updated successfully!'
      : 'Character created successfully!',
    resetOnSuccess: !characterId, // Сбрасывать только при создании
    mode: 'onBlur', // Менее агрессивная валидация для длинных форм
    defaultValues: {
      isNSFW: false,
      isPublic: true,
      category: 'other',
      tags: [],
    },
  });
};

/**
 * Хук для формы настроек пользователя
 */
export const useSettingsForm = () => {
  const mockSettingsSubmit = async (data: any) => {
    // Имитация API вызова
    await new Promise((resolve) => setTimeout(resolve, 800));

    console.log('Updating settings:', data);
    // await settingsApi.update(data);
  };

  return useForm({
    schema: settingsSchema,
    onSubmit: mockSettingsSubmit,
    successMessage: 'Settings saved successfully!',
    mode: 'onBlur', // Для настроек лучше валидировать при потере фокуса
    defaultValues: {
      preferences: {
        language: 'en',
        theme: 'system',
        nsfwEnabled: false,
        autoSave: true,
        showOnlineStatus: true,
      },
      notifications: {
        email: true,
        push: true,
        sound: true,
        newMessages: true,
        characterUpdates: true,
        systemUpdates: false,
      },
      privacy: {
        profileVisibility: 'public',
        allowDirectMessages: true,
        showActivityStatus: true,
        dataCollection: true,
      },
    },
  });
};

// Утилиты для работы с ошибками форм
export const getFieldError = (
  errors: Record<string, any>,
  fieldPath: string
): string | undefined => {
  const keys = fieldPath.split('.');
  let current = errors;

  for (const key of keys) {
    if (current[key]) {
      current = current[key];
    } else {
      return undefined;
    }
  }

  return current?.message;
};

export const hasFieldError = (
  errors: Record<string, any>,
  fieldPath: string
): boolean => {
  return !!getFieldError(errors, fieldPath);
};

// Типы для экспорта
export type LoginFormData = z.infer<typeof authSchemas.login>;
export type RegisterFormData = z.infer<typeof authSchemas.register>;
export type ResetPasswordFormData = z.infer<typeof authSchemas.resetPassword>;
export type ChangePasswordFormData = z.infer<typeof authSchemas.changePassword>;
export type CharacterFormData = z.infer<typeof characterSchema>;
export type SettingsFormData = z.infer<typeof settingsSchema>;
