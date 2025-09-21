import React, { useEffect, useState, ReactNode } from 'react';
import { useAuthStore } from '../../stores/authStore';
import axios from 'axios';

// Глобальный лоадер
const GlobalLoader: React.FC = () => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900 bg-opacity-90 text-white transition-opacity animate-fade-in">
    <div className="mb-6 animate-spin">
      <svg
        width="56"
        height="56"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="24" cy="24" r="20" stroke="#6366F1" strokeWidth="4" />
        <path
          d="M24 8a16 16 0 1 1-16 16"
          stroke="#6366F1"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </div>
    <div className="text-xl font-semibold">Загрузка...</div>
  </div>
);

interface AuthGuardProps {
  children: ReactNode;
  requirePremium?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requirePremium = false,
}) => {
  const { isAuthenticated, isLoading, checkAuth, logout, token, user } =
    useAuthStore();
  const [initLoading, setInitLoading] = useState(true);

  // Проверка авторизации при маунте и восстановление токена
  useEffect(() => {
    let isMounted = true;
    const runCheck = async () => {
      try {
        await checkAuth();
      } finally {
        if (isMounted) setInitLoading(false);
      }
    };
    runCheck();
    return () => {
      isMounted = false;
    };
  }, [checkAuth]);

  // Подписка на изменения authStore
  useEffect(() => {
    const handleAuthChange = () => {
      if (!isAuthenticated) {
        localStorage.removeItem('token');
      }
    };
    // Можно добавить подписку через Zustand subscribe, если реализовано
    // Пример: const unsub = useAuthStore.subscribe(handleAuthChange);
    // return () => unsub();
  }, [isAuthenticated]);

  // Axios interceptor для глобальной обработки 401
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [logout]);

  // Глобальный лоадер при инициализации
  if (initLoading || isLoading) {
    return <GlobalLoader />;
  }

  // Проверка Premium подписки, если требуется
  if (
    requirePremium &&
    isAuthenticated &&
    user &&
    user.subscription !== 'premium'
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Premium подписка требуется
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Для доступа к этой функции необходима Premium подписка
            </p>
          </div>
          <button
            onClick={() => (window.location.href = '/subscription')}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity"
          >
            Обновить подписку
          </button>
        </div>
      </div>
    );
  }

  // Обертка для всего приложения
  return <>{children}</>;
};

export default AuthGuard;
