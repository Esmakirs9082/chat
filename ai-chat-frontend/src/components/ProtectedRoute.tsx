import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
}) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (requireAuth && !isAuthenticated) {
    // Сохраняем путь, куда пользователь хотел попасть
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (!requireAuth && isAuthenticated) {
    // Перенаправляем аутентифицированных пользователей с публичных страниц
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
