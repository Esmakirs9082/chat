import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { CharacterSelector } from './components/CharacterSelector';
import { ChatInterface } from './components/ChatInterface';
import { SettingsModal } from './components/SettingsModal';
import { usePreferencesStore } from './stores';

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { preferences } = usePreferencesStore();

  // Apply dark mode class to document
  useEffect(() => {
    if (preferences.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [preferences.darkMode]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header 
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <CharacterSelector />
        <ChatInterface />
      </div>

      {/* Modals */}
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Placeholder for Auth modal - will implement later */}
      {isAuthOpen && (
        <div className="modal-overlay" onClick={() => setIsAuthOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-semibold mb-4">Authentication</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Authentication system will be implemented in the next phase.
            </p>
            <button
              onClick={() => setIsAuthOpen(false)}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
