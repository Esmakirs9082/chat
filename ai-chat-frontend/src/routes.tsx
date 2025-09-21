import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from './Layout';
import AuthGuard from './components/auth/AuthGuard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import TailwindTest from './components/TailwindTest';
import ChatExample from './components/ChatExample';

const HomePage = lazy(() => import('./pages/HomePage'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const CharactersPage = lazy(() => import('./pages/CharactersPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const SubscriptionPage = lazy(() => import('./pages/SubscriptionPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const SubscriptionDemo = lazy(() => import('./components/SubscriptionDemo'));
const LocalStorageDemo = lazy(() => import('./components/LocalStorageDemo'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'gallery',
        element: <GalleryPage />,
      },
      {
        path: 'chat',
        element: (
          <AuthGuard>
            <ChatPage />
          </AuthGuard>
        ),
      },
      {
        path: 'chat/:characterId',
        element: (
          <AuthGuard>
            <ChatPage />
          </AuthGuard>
        ),
      },
      {
        path: 'characters',
        element: (
          <AuthGuard>
            <CharactersPage />
          </AuthGuard>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <AuthGuard>
            <DashboardPage />
          </AuthGuard>
        ),
      },
      {
        path: 'subscription',
        element: (
          <AuthGuard>
            <SubscriptionPage />
          </AuthGuard>
        ),
      },
      {
        path: 'settings',
        element: (
          <AuthGuard>
            <SettingsPage />
          </AuthGuard>
        ),
      },
      {
        path: 'subscription-demo',
        element: (
          <AuthGuard>
            <SubscriptionDemo />
          </AuthGuard>
        ),
      },
      {
        path: 'localstorage-demo',
        element: (
          <AuthGuard>
            <LocalStorageDemo />
          </AuthGuard>
        ),
      },
      {
        path: 'tailwind-test',
        element: <TailwindTest />,
      },
      {
        path: 'chat-demo',
        element: (
          <ChatExample chatId="demo-chat-1" characterId="demo-character" />
        ),
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default router;
