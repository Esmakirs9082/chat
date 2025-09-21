import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  User,
  Settings,
  Bell,
  Shield,
  Camera,
  Globe,
  Moon,
  Sun,
  EyeOff,
  Eye,
  Mail,
  Smartphone,
  Share2,
  Lock,
  Save,
  RotateCcw,
  Check,
  X,
  Users,
} from 'lucide-react';
import AuthGuard from '../components/auth/AuthGuard';
import { Button } from '../components/ui';
import { cn } from '../utils/index';
import { useSettingsStore } from '../stores/settingsStore';
import { useAuthStore } from '../stores/authStore';
import { features, env, isDevelopment } from '../config/env';

// Zod schema for form validation
const settingsSchema = z.object({
  // Profile section
  username: z
    .string()
    .min(3, 'Имя пользователя должно содержать минимум 3 символа')
    .max(50, 'Максимум 50 символов'),
  email: z.string().email('Некорректный email адрес'),

  // Preferences section
  theme: z.enum(['light', 'dark', 'system']),
  nsfwEnabled: z.boolean(),
  language: z.enum(['ru', 'en']),

  // Notifications section
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  marketingNotifications: z.boolean(),

  // Privacy section
  profilePublic: z.boolean(),
  charactersPublic: z.boolean(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

const SettingsPage: React.FC = () => {
  const { theme, nsfwEnabled } = useSettingsStore();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setValue,
    watch,
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      username: user?.username || '',
      email: user?.email || '',
      theme: (theme as 'light' | 'dark' | 'system') || 'system',
      nsfwEnabled: nsfwEnabled || false,
      language: 'ru',
      emailNotifications: true,
      pushNotifications: true,
      marketingNotifications: false,
      profilePublic: true,
      charactersPublic: false,
    },
  });

  const currentTheme = watch('theme');
  const currentNsfw = watch('nsfwEnabled');

  // Handle avatar upload
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Form submission
  const onSubmit = async (data: SettingsFormData) => {
    setIsLoading(true);
    try {
      // TODO: Integrate with actual API
      console.log('Saving settings:', data);
      if (avatarFile) {
        console.log('Uploading avatar:', avatarFile);
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update stores if needed
      // await updateUserProfile(data);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form to default values
  const handleReset = () => {
    if (window.confirm('Вы уверены, что хотите сбросить все настройки?')) {
      reset();
      setAvatarFile(null);
      setAvatarPreview(null);
    }
  };

  return (
    <AuthGuard requirePremium={false}>
      <div
        className={cn(
          'min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200',
          theme === 'dark' && 'dark'
        )}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Настройки
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Управляйте своим профилем и настройками приложения
            </p>
          </header>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Profile Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-8">
              <div className="flex items-center mb-6">
                <User className="w-6 h-6 text-blue-500 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Профиль
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Avatar Upload */}
                <div className="md:col-span-1">
                  <div className="text-center">
                    <div className="relative inline-block mb-4">
                      <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                        {avatarPreview ? (
                          <img
                            src={avatarPreview}
                            alt="Avatar preview"
                            className="w-full h-full object-cover"
                          />
                        ) : user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt="Current avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-16 h-16 text-gray-400" />
                        )}
                      </div>
                      <label className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 cursor-pointer transition-colors">
                        <Camera className="w-4 h-4" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      JPG, PNG до 5MB
                    </p>
                  </div>
                </div>

                {/* Profile Fields */}
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Имя пользователя *
                    </label>
                    <input
                      {...register('username')}
                      type="text"
                      className={cn(
                        'w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors',
                        errors.username
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                      )}
                      placeholder="Введите имя пользователя"
                    />
                    {errors.username && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        {errors.username.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email адрес *
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      className={cn(
                        'w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors',
                        errors.email
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                      )}
                      placeholder="Введите email адрес"
                    />
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-blue-500 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                          Email подтверждён
                        </p>
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                          Ваш email адрес успешно подтвержден
                        </p>
                      </div>
                    </div>
                    <Check className="w-5 h-5 text-blue-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Preferences Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-8">
              <div className="flex items-center mb-6">
                <Settings className="w-6 h-6 text-purple-500 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Предпочтения
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {/* Theme Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Тема оформления
                    </label>
                    <div className="space-y-3">
                      {[
                        { value: 'light', label: 'Светлая', icon: Sun },
                        { value: 'dark', label: 'Тёмная', icon: Moon },
                        { value: 'system', label: 'Системная', icon: Settings },
                      ].map(({ value, label, icon: Icon }) => (
                        <label
                          key={value}
                          className="flex items-center cursor-pointer"
                        >
                          <input
                            {...register('theme')}
                            type="radio"
                            value={value}
                            className="sr-only"
                          />
                          <div
                            className={cn(
                              'w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 transition-colors',
                              currentTheme === value
                                ? 'border-blue-500 bg-blue-500'
                                : 'border-gray-300 dark:border-gray-600'
                            )}
                          >
                            {currentTheme === value && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                          <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2" />
                          <span className="text-gray-900 dark:text-white">
                            {label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Language Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Язык интерфейса
                    </label>
                    <select
                      {...register('language')}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="ru">Русский</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* NSFW Content Toggle - только если feature включен */}
                  {features.ENABLE_NSFW_CONTENT && (
                    <div>
                      <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                        <div className="flex items-center">
                          {currentNsfw ? (
                            <Eye className="w-5 h-5 text-orange-500 mr-3" />
                          ) : (
                            <EyeOff className="w-5 h-5 text-gray-400 mr-3" />
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              NSFW контент
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Показывать контент для взрослых (18+)
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            {...register('nsfwEnabled')}
                            type="checkbox"
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500"></div>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Environment Info для development */}
                  {isDevelopment && (
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-start">
                        <Settings className="w-5 h-5 text-yellow-500 mr-3 mt-0.5" />
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-yellow-900 dark:text-yellow-200">
                            Environment (Development Mode)
                          </p>
                          <div className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
                            <p>API URL: {env.API_URL}</p>
                            <p>WebSocket: {env.WS_URL}</p>
                            <p>App Version: {env.APP_VERSION}</p>
                            <div className="mt-2">
                              <p className="font-medium">Active Features:</p>
                              <ul className="list-disc list-inside ml-2 space-y-0.5">
                                {Object.entries(features)
                                  .filter(([_, enabled]) => enabled)
                                  .map(([key, _]) => (
                                    <li key={key} className="text-xs">
                                      {key
                                        .replace('ENABLE_', '')
                                        .toLowerCase()
                                        .replace(/_/g, ' ')}
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Additional Settings Info */}
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start">
                      <Globe className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                          Региональные настройки
                        </p>
                        <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                          Настройки применяются ко всем устройствам, связанным с
                          вашим аккаунтом
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-8">
              <div className="flex items-center mb-6">
                <Bell className="w-6 h-6 text-yellow-500 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Уведомления
                </h2>
              </div>

              <div className="space-y-6">
                {/* Email Notifications */}
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-blue-500 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Email уведомления
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Получать уведомления о новых сообщениях и активности на
                        email
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      {...register('emailNotifications')}
                      type="checkbox"
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"></div>
                  </label>
                </div>

                {/* Push Notifications */}
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center">
                    <Smartphone className="w-5 h-5 text-green-500 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Push уведомления
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Мгновенные уведомления в браузере и мобильном приложении
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      {...register('pushNotifications')}
                      type="checkbox"
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
                  </label>
                </div>

                {/* Marketing Notifications */}
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center">
                    <Share2 className="w-5 h-5 text-purple-500 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Маркетинговые уведомления
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Новости, обновления продукта и специальные предложения
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      {...register('marketingNotifications')}
                      type="checkbox"
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-500"></div>
                  </label>
                </div>

                {/* Notification Preferences Note */}
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <div className="flex items-start">
                    <Bell className="w-5 h-5 text-amber-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                        Настройка уведомлений
                      </p>
                      <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                        Вы можете в любое время изменить эти настройки.
                        Push-уведомления требуют разрешения браузера.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-8">
              <div className="flex items-center mb-6">
                <Shield className="w-6 h-6 text-red-500 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Приватность
                </h2>
              </div>

              <div className="space-y-6">
                {/* Profile Public Toggle */}
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-blue-500 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Публичный профиль
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Разрешить другим пользователям находить и просматривать
                        ваш профиль
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      {...register('profilePublic')}
                      type="checkbox"
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"></div>
                  </label>
                </div>

                {/* Characters Public Toggle */}
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-purple-500 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Публичные персонажи
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Показывать созданных вами персонажей в общей галерее
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      {...register('charactersPublic')}
                      type="checkbox"
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-500"></div>
                  </label>
                </div>

                {/* Privacy Warning */}
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="flex items-start">
                    <Lock className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-900 dark:text-red-200">
                        Важно о приватности
                      </p>
                      <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                        Изменения настроек приватности могут повлиять на
                        видимость вашего контента для других пользователей.
                        Будьте осторожны при публикации личной информации.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Save/Reset Buttons */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {isDirty
                      ? 'У вас есть несохраненные изменения'
                      : 'Все изменения сохранены'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {isDirty
                      ? 'Нажмите "Сохранить настройки" чтобы применить изменения'
                      : 'Все ваши настройки актуальны'}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    disabled={isLoading || !isDirty}
                    className="flex items-center"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Сбросить
                  </Button>

                  <Button
                    type="submit"
                    disabled={isLoading || !isDirty}
                    className="flex items-center bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Сохранение...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Сохранить настройки
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Form Status Indicators */}
              {Object.keys(errors).length > 0 && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="flex items-start">
                    <X className="w-5 h-5 text-red-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-900 dark:text-red-200">
                        Ошибки в форме
                      </p>
                      <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                        Пожалуйста, исправьте ошибки выше перед сохранением
                        настроек
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </AuthGuard>
  );
};

export default SettingsPage;
