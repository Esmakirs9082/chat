import React, { lazy, Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';

const HomePage = lazy(() => import('./pages/HomePage'));
const CharactersPage = lazy(() => import('./pages/CharactersPage'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<div className="text-center p-8">Загрузка...</div>}>
      <Routes>
        {/* Публичные роуты */}
        <Route path="/" element={<HomePage />} />
        <Route path="/characters" element={<CharactersPage />} />
        {/* Защищённые роуты */}
        <Route path="/chat" element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
