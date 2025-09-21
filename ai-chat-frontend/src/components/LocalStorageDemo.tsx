import React, { useState } from 'react';
import {
  Moon,
  Sun,
  Monitor,
  Settings,
  History,
  Trash2,
  Plus,
  Bell,
  Eye,
  Type,
  Download,
  Upload,
  RotateCcw,
} from 'lucide-react';
import {
  useLocalStorage,
  useTheme,
  useChatHistory,
  useUserPreferences,
  ChatHistoryItem,
} from '../hooks/useLocalStorage';
import Button from './ui/Button';

const LocalStorageDemo: React.FC = () => {
  const [demoValue, setDemoValue, removeDemoValue] = useLocalStorage(
    'demo-key',
    'Initial Value'
  );
  const [newDemoValue, setNewDemoValue] = useState('');

  // Theme hook
  const { theme, setTheme, toggleTheme, isDark } = useTheme();

  // Chat history hook
  const {
    chatHistory,
    addChatToHistory,
    removeChatFromHistory,
    clearChatHistory,
    getChatById,
    getChatsByCharacter,
    getRecentChats,
  } = useChatHistory();

  // User preferences hook
  const {
    preferences,
    updatePreferences,
    resetPreferences,
    updateNotificationSettings,
    updateDisplaySettings,
  } = useUserPreferences();

  const [newChatForm, setNewChatForm] = useState({
    id: '',
    characterId: '',
    characterName: '',
    lastMessage: '',
    messageCount: 1,
    tags: '',
  });

  const handleAddChat = () => {
    if (newChatForm.id && newChatForm.characterName) {
      addChatToHistory({
        ...newChatForm,
        messageCount: Number(newChatForm.messageCount) || 1,
        tags: newChatForm.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
      });
      setNewChatForm({
        id: '',
        characterId: '',
        characterName: '',
        lastMessage: '',
        messageCount: 1,
        tags: '',
      });
    }
  };

  const exportData = () => {
    const data = {
      theme,
      chatHistory,
      preferences,
      demoValue,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'localStorage-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (data.theme) setTheme(data.theme);
          if (data.demoValue) setDemoValue(data.demoValue);
          // Note: For chatHistory and preferences, you'd need to use the respective setters
        } catch (error) {
          console.error('Error importing data:', error);
          alert('Error importing data. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          localStorage Hooks Demo
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Interactive demonstration of localStorage management hooks
        </p>
      </div>

      {/* Basic useLocalStorage Demo */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          Basic useLocalStorage Hook
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Value:
            </label>
            <p className="text-lg font-mono bg-gray-100 dark:bg-gray-700 p-3 rounded">
              {JSON.stringify(demoValue)}
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newDemoValue}
              onChange={(e) => setNewDemoValue(e.target.value)}
              placeholder="Enter new value"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
            <Button onClick={() => setDemoValue(newDemoValue)}>
              Set Value
            </Button>
            <Button onClick={removeDemoValue} variant="outline">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Theme Demo */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          {isDark ? (
            <Moon className="w-5 h-5 mr-2" />
          ) : (
            <Sun className="w-5 h-5 mr-2" />
          )}
          Theme Management
        </h2>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Current theme: <span className="font-semibold">{theme}</span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Dark mode active:{' '}
              <span className="font-semibold">{isDark ? 'Yes' : 'No'}</span>
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => setTheme('light')}
              variant={theme === 'light' ? 'primary' : 'outline'}
              className="flex items-center"
            >
              <Sun className="w-4 h-4 mr-2" />
              Light
            </Button>
            <Button
              onClick={() => setTheme('dark')}
              variant={theme === 'dark' ? 'primary' : 'outline'}
              className="flex items-center"
            >
              <Moon className="w-4 h-4 mr-2" />
              Dark
            </Button>
            <Button
              onClick={() => setTheme('system')}
              variant={theme === 'system' ? 'primary' : 'outline'}
              className="flex items-center"
            >
              <Monitor className="w-4 h-4 mr-2" />
              System
            </Button>
            <Button onClick={toggleTheme} className="flex items-center">
              <RotateCcw className="w-4 h-4 mr-2" />
              Toggle
            </Button>
          </div>
        </div>
      </div>

      {/* Chat History Demo */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <History className="w-5 h-5 mr-2" />
          Chat History Management
        </h2>

        <div className="space-y-4">
          {/* Add New Chat Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <input
              type="text"
              placeholder="Chat ID"
              value={newChatForm.id}
              onChange={(e) =>
                setNewChatForm((prev) => ({ ...prev, id: e.target.value }))
              }
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 dark:text-white"
            />
            <input
              type="text"
              placeholder="Character Name"
              value={newChatForm.characterName}
              onChange={(e) =>
                setNewChatForm((prev) => ({
                  ...prev,
                  characterName: e.target.value,
                }))
              }
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 dark:text-white"
            />
            <input
              type="text"
              placeholder="Character ID"
              value={newChatForm.characterId}
              onChange={(e) =>
                setNewChatForm((prev) => ({
                  ...prev,
                  characterId: e.target.value,
                }))
              }
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 dark:text-white"
            />
            <input
              type="text"
              placeholder="Last Message"
              value={newChatForm.lastMessage}
              onChange={(e) =>
                setNewChatForm((prev) => ({
                  ...prev,
                  lastMessage: e.target.value,
                }))
              }
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 dark:text-white"
            />
            <input
              type="number"
              placeholder="Message Count"
              value={newChatForm.messageCount}
              onChange={(e) =>
                setNewChatForm((prev) => ({
                  ...prev,
                  messageCount: Number(e.target.value),
                }))
              }
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 dark:text-white"
            />
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={newChatForm.tags}
              onChange={(e) =>
                setNewChatForm((prev) => ({ ...prev, tags: e.target.value }))
              }
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 dark:text-white"
            />
            <div className="md:col-span-2 flex gap-2">
              <Button onClick={handleAddChat} className="flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Add Chat
              </Button>
              <Button
                onClick={clearChatHistory}
                variant="outline"
                className="flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>

          {/* Chat History List */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Chat History ({chatHistory.length} chats)
            </h3>
            {chatHistory.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 italic">
                No chats in history
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto">
                {getRecentChats(20).map((chat) => (
                  <div
                    key={chat.id}
                    className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {chat.characterName}
                      </h4>
                      <Button
                        onClick={() => removeChatFromHistory(chat.id)}
                        variant="outline"
                        size="sm"
                        className="p-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {chat.lastMessage}
                    </p>
                    <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                      <span>{chat.messageCount} messages</span>
                      <span>
                        {new Date(chat.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    {chat.tags.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {chat.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Preferences Demo */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          User Preferences
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* General Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              General
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Language
              </label>
              <select
                value={preferences.language}
                onChange={(e) =>
                  updatePreferences({ language: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              >
                <option value="en">English</option>
                <option value="ru">Русский</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </div>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.nsfwEnabled}
                onChange={(e) =>
                  updatePreferences({ nsfwEnabled: e.target.checked })
                }
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Enable NSFW Content
              </span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.autoSave}
                onChange={(e) =>
                  updatePreferences({ autoSave: e.target.checked })
                }
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Auto Save
              </span>
            </label>
          </div>

          {/* Notifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </h3>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.notifications.email}
                onChange={(e) =>
                  updateNotificationSettings({ email: e.target.checked })
                }
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Email Notifications
              </span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.notifications.push}
                onChange={(e) =>
                  updateNotificationSettings({ push: e.target.checked })
                }
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Push Notifications
              </span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.notifications.sound}
                onChange={(e) =>
                  updateNotificationSettings({ sound: e.target.checked })
                }
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Sound
              </span>
            </label>
          </div>

          {/* Display Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <Eye className="w-4 h-4 mr-2" />
              Display
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                <Type className="w-4 h-4 mr-1" />
                Font Size
              </label>
              <select
                value={preferences.display.fontSize}
                onChange={(e) =>
                  updateDisplaySettings({ fontSize: e.target.value as any })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.display.compactMode}
                onChange={(e) =>
                  updateDisplaySettings({ compactMode: e.target.checked })
                }
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Compact Mode
              </span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.display.showAvatars}
                onChange={(e) =>
                  updateDisplaySettings({ showAvatars: e.target.checked })
                }
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Show Avatars
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Actions
            </h3>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={resetPreferences}
                variant="outline"
                className="flex items-center"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset All
              </Button>

              <Button
                onClick={exportData}
                variant="outline"
                className="flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>

              <label className="cursor-pointer">
                <Button variant="outline" className="flex items-center">
                  <Upload className="w-4 h-4 mr-2" />
                  Import Data
                </Button>
                <input
                  type="file"
                  accept=".json"
                  onChange={importData}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Current Values Preview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Current localStorage Values
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              Preferences
            </h3>
            <pre className="text-xs bg-gray-100 dark:bg-gray-700 p-3 rounded overflow-auto max-h-40">
              {JSON.stringify(preferences, null, 2)}
            </pre>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              Theme & Demo
            </h3>
            <pre className="text-xs bg-gray-100 dark:bg-gray-700 p-3 rounded overflow-auto max-h-40">
              {JSON.stringify({ theme, demoValue, isDark }, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocalStorageDemo;
