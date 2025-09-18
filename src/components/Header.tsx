import { Moon, Sun, Settings, User } from 'lucide-react';
import { usePreferencesStore, useAuthStore } from '../stores';
import { Button } from '../components/ui';

interface HeaderProps {
  onOpenSettings?: () => void;
  onOpenAuth?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  onOpenAuth,
}) => {
  const { preferences, toggleDarkMode } = usePreferencesStore();
  const { isAuthenticated, user } = useAuthStore();

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            AI Chat
          </h1>
          <span className="text-sm text-gray-500 dark:text-gray-400 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
            Beta
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Dark Mode Toggle */}
          <Button
            onClick={toggleDarkMode}
            variant="ghost"
            size="sm"
            className="p-2"
            title={preferences.darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {preferences.darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </Button>

          {/* Settings */}
          <Button
            onClick={onOpenSettings}
            variant="ghost"
            size="sm"
            className="p-2"
            title="Settings"
          >
            <Settings size={18} />
          </Button>

          {/* User/Auth */}
          {isAuthenticated && user ? (
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {user.username}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {user.subscriptionTier} Plan
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full" />
                ) : (
                  <User size={16} />
                )}
              </div>
            </div>
          ) : (
            <Button
              onClick={onOpenAuth}
              variant="primary"
              size="sm"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};