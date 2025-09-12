import React from 'react';
import { usePreferencesStore } from '../stores';
import { Modal, Button } from '../components/ui';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { preferences, updatePreferences, toggleNSFW } = usePreferencesStore();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings" maxWidth="max-w-lg">
      <div className="space-y-6">
        {/* Theme Settings */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
            Appearance
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Dark Mode
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Switch between light and dark themes
                </p>
              </div>
              <button
                onClick={() => updatePreferences({ darkMode: !preferences.darkMode })}
                className={[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  preferences.darkMode ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700',
                ].join(' ')}
              >
                <span
                  className={[
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    preferences.darkMode ? 'translate-x-6' : 'translate-x-1',
                  ].join(' ')}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Content Settings */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
            Content
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  NSFW Content
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Show adult-oriented characters and conversations
                </p>
              </div>
              <button
                onClick={toggleNSFW}
                className={[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  preferences.nsfwEnabled ? 'bg-red-600' : 'bg-gray-200 dark:bg-gray-700',
                ].join(' ')}
              >
                <span
                  className={[
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    preferences.nsfwEnabled ? 'translate-x-6' : 'translate-x-1',
                  ].join(' ')}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
            Notifications
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Push Notifications
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Receive notifications for new messages
                </p>
              </div>
              <button
                onClick={() => updatePreferences({ notifications: !preferences.notifications })}
                className={[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  preferences.notifications ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700',
                ].join(' ')}
              >
                <span
                  className={[
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    preferences.notifications ? 'translate-x-6' : 'translate-x-1',
                  ].join(' ')}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex justify-end">
          <Button onClick={onClose} variant="primary">
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
};