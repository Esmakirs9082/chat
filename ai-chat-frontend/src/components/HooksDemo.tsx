import React, { useState } from 'react';
import LocalStorageDemo from './LocalStorageDemo';
import FormDemo from './FormDemo';
import ToastDemo from './ToastDemo';
import LoadingDemo from './LoadingDemo';
import ConstantsDemo from './ConstantsDemo';
import { ToastProvider } from '../contexts/ToastContext';

const HooksDemo: React.FC = () => {
  const [currentDemo, setCurrentDemo] = useState<
    'localStorage' | 'forms' | 'toasts' | 'loading' | 'constants'
  >('localStorage');

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto py-8">
          {/* Demo Selector */}
          <div className="flex justify-center gap-4 mb-8 flex-wrap">
            <button
              onClick={() => setCurrentDemo('localStorage')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                currentDemo === 'localStorage'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              LocalStorage Hooks
            </button>
            <button
              onClick={() => setCurrentDemo('forms')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                currentDemo === 'forms'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              Form Hooks
            </button>
            <button
              onClick={() => setCurrentDemo('toasts')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                currentDemo === 'toasts'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              Toast Notifications
            </button>
            <button
              onClick={() => setCurrentDemo('loading')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                currentDemo === 'loading'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              Loading Components
            </button>
            <button
              onClick={() => setCurrentDemo('constants')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                currentDemo === 'constants'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              App Constants
            </button>
          </div>

          {/* Demo Content */}
          {currentDemo === 'localStorage' && <LocalStorageDemo />}
          {currentDemo === 'forms' && <FormDemo />}
          {currentDemo === 'toasts' && <ToastDemo />}
          {currentDemo === 'loading' && <LoadingDemo />}
          {currentDemo === 'constants' && <ConstantsDemo />}
        </div>
      </div>
    </ToastProvider>
  );
};

export default HooksDemo;
