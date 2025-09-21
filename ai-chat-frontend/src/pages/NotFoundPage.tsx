import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import Button from '../components/ui/Button';
import { useSettingsStore } from '../stores/settingsStore';

const NotFoundPage: React.FC = () => {
  const theme = useSettingsStore((state) => state.theme);

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    >
      <div className="max-w-md w-full text-center">
        {/* 404 Icon */}
        <div
          className={`w-32 h-32 mx-auto mb-8 rounded-full flex items-center justify-center ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}
        >
          <div
            className={`text-6xl font-bold ${
              theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
            }`}
          >
            404
          </div>
        </div>

        {/* Title */}
        <h1
          className={`text-3xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}
        >
          Страница не найдена
        </h1>

        {/* Description */}
        <p
          className={`text-lg mb-8 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}
        >
          К сожалению, страница, которую вы ищете, не существует или была
          перемещена.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
              <Home className="w-4 h-4 mr-2" />
              На главную
            </Button>
          </Link>

          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
        </div>

        {/* Additional Links */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p
            className={`text-sm mb-4 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            Или попробуйте один из этих разделов:
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/gallery"
              className={`text-sm transition-colors ${
                theme === 'dark'
                  ? 'text-purple-400 hover:text-purple-300'
                  : 'text-purple-600 hover:text-purple-700'
              }`}
            >
              Галерея персонажей
            </Link>
            <Link
              to="/dashboard"
              className={`text-sm transition-colors ${
                theme === 'dark'
                  ? 'text-purple-400 hover:text-purple-300'
                  : 'text-purple-600 hover:text-purple-700'
              }`}
            >
              Панель управления
            </Link>
            <Link
              to="/subscription"
              className={`text-sm transition-colors ${
                theme === 'dark'
                  ? 'text-purple-400 hover:text-purple-300'
                  : 'text-purple-600 hover:text-purple-700'
              }`}
            >
              Подписки
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
