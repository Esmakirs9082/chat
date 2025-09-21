import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

console.log('=== ПОЛНОЕ ПРИЛОЖЕНИЕ ===');

const root = document.getElementById('root');
if (root) {
  const reactRoot = ReactDOM.createRoot(root);

  reactRoot.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  console.log('Полное приложение загружено');
}
