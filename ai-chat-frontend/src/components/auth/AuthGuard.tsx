
import React, { useEffect, useState, ReactNode } from 'react';
import { useAuthStore } from '../../stores/authStore';
import axios from 'axios';

// Глобальный лоадер
const GlobalLoader: React.FC = () => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900 bg-opacity-90 text-white transition-opacity animate-fade-in">
    <div className="mb-6 animate-spin">
      <svg width="56" height="56" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="20" stroke="#6366F1" strokeWidth="4" />
        <path d="M24 8a16 16 0 1 1-16 16" stroke="#6366F1" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </div>
    <div className="text-xl font-semibold">Загрузка...</div>
  </div>
);

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading, checkAuth, logout, token } = useAuthStore();
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
    return () => { isMounted = false; };
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
      response => response,
      error => {
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

  // Обертка для всего приложения
  return <>{children}</>;
};

export default AuthGuard;
