
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { HomePage, ChatPage, GalleryPage, CharactersPage, SubscriptionPage, DashboardPage } from './pages';
import ErrorBoundary from './components/ErrorBoundary';
import AppProviders from './AppProviders';
import './styles/global.css';

const App: React.FC = () => {
  return (
    <AppProviders>
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/chat/:characterId" element={<ChatPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/characters" element={<CharactersPage />} />
            <Route path="/subscription" element={<SubscriptionPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </AppProviders>
  );
};

export default App;
