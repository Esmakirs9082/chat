import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';

// Loading fallback component
const LoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
  </div>
);

const Layout: React.FC = () => {
  return (
    <ErrorBoundary>
      <div
        style={{
          position: 'fixed',
          top: 10,
          left: 10,
          zIndex: 9999,
          background: 'red',
          color: 'white',
          padding: '5px',
          fontSize: '12px',
        }}
      >
        React mounted! {new Date().toLocaleTimeString()}
      </div>
      <Suspense fallback={<LoadingFallback />}>
        <Outlet />
      </Suspense>
    </ErrorBoundary>
  );
};

export default Layout;
