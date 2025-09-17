import React from 'react';
import { useSettingsStore, useTheme, useNSFW } from '../stores/settingsStore';

const SettingsPage: React.FC = () => {
  const {
    notifications,
    chatSettings,
    privacy,
    isLoading,
    lastSyncedAt,
    updateNotifications,
    updateChatSettings,
    updatePrivacy,
    resetToDefaults,
    saveSettings
  } = useSettingsStore();

  const { theme, setTheme } = useTheme();
  const { nsfwEnabled, toggleNSFW } = useNSFW();

  const handleSaveSettings = async () => {
    await saveSettings();
  };

  const handleResetSettings = () => {
    if (confirm('Вы уверены, что хотите сбросить все настройки по умолчанию?')) {
      resetToDefaults();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Настройки
        </h1>

        {/* Тема и внешний вид */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Внешний вид
          </h2>
          
          <div className="space-y-4">
            {/* Выбор темы */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Тема
              </label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as 'dark' | 'light')}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="light">Светлая</option>
                <option value="dark">Тёмная</option>
              </select>
            </div>

            {/* NSFW контент */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  NSFW контент
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Показывать контент для взрослых
                </p>
              </div>
              <button
                onClick={toggleNSFW}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  nsfwEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    nsfwEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Уведомления */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Уведомления
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email уведомления
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Получать уведомления на почту
                </p>
              </div>
              <button
                onClick={() => updateNotifications({ email: !notifications.email })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.email ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.email ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Push уведомления
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Получать push-уведомления в браузере
                </p>
              </div>
              <button
                onClick={() => updateNotifications({ push: !notifications.push })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.push ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.push ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Маркетинговые уведомления
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Получать новости и предложения
                </p>
              </div>
              <button
                onClick={() => updateNotifications({ marketing: !notifications.marketing })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.marketing ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.marketing ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Настройки чата */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Настройки чата
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Автоответ
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Автоматически отвечать на сообщения
                </p>
              </div>
              <button
                onClick={() => updateChatSettings({ autoReply: !chatSettings.autoReply })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  chatSettings.autoReply ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    chatSettings.autoReply ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Индикаторы печати
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Показывать когда персонаж печатает
                </p>
              </div>
              <button
                onClick={() => updateChatSettings({ typingIndicators: !chatSettings.typingIndicators })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  chatSettings.typingIndicators ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    chatSettings.typingIndicators ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Звуки
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Воспроизводить звуки уведомлений
                </p>
              </div>
              <button
                onClick={() => updateChatSettings({ soundEnabled: !chatSettings.soundEnabled })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  chatSettings.soundEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    chatSettings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Приватность */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Приватность
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Публичный профиль
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Другие пользователи могут видеть ваш профиль
                </p>
              </div>
              <button
                onClick={() => updatePrivacy({ profilePublic: !privacy.profilePublic })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  privacy.profilePublic ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    privacy.profilePublic ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Публичные персонажи
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Ваши персонажи видны другим пользователям
                </p>
              </div>
              <button
                onClick={() => updatePrivacy({ charactersPublic: !privacy.charactersPublic })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  privacy.charactersPublic ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    privacy.charactersPublic ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Действия */}
        <section className="border-t pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleSaveSettings}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Сохранить настройки
            </button>
            
            <button
              onClick={handleResetSettings}
              className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Сбросить по умолчанию
            </button>
          </div>

          {lastSyncedAt && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              Последняя синхронизация: {lastSyncedAt.toLocaleString('ru-RU')}
            </p>
          )}
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;