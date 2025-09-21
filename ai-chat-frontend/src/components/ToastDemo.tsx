import React, { useState } from 'react';
import { useToast, toastPresets } from '../hooks/useToast';
import type { ToastPosition } from '../hooks/useToast';

const ToastDemo: React.FC = () => {
  const toast = useToast();
  const [position, setPosition] = useState<ToastPosition>('top-right');
  const [customTitle, setCustomTitle] = useState('Custom notification');
  const [customDescription, setCustomDescription] = useState(
    'This is a custom toast message'
  );
  const [customDuration, setCustomDuration] = useState(5000);

  const handleBasicToasts = () => {
    toast.success({
      title: 'Success!',
      description: 'Operation completed successfully',
      position,
    });

    setTimeout(() => {
      toast.error({
        title: 'Error occurred',
        description: 'Something went wrong, please try again',
        position,
      });
    }, 500);

    setTimeout(() => {
      toast.warning({
        title: 'Warning',
        description: 'Please review your settings',
        position,
      });
    }, 1000);

    setTimeout(() => {
      toast.info({
        title: 'Information',
        description: 'New update available',
        position,
      });
    }, 1500);
  };

  const handlePresetToasts = () => {
    toast.success({ ...toastPresets.saveSuccess(), position });

    setTimeout(() => {
      toast.error({ ...toastPresets.networkError(), position });
    }, 600);

    setTimeout(() => {
      toast.success({ ...toastPresets.loginSuccess('John'), position });
    }, 1200);

    setTimeout(() => {
      toast.info({ ...toastPresets.copySuccess(), position });
    }, 1800);
  };

  const handleQueueTest = () => {
    // Быстро создаем много уведомлений для тестирования очереди
    for (let i = 1; i <= 8; i++) {
      setTimeout(() => {
        toast.info({
          title: `Queue Test #${i}`,
          description: `Testing queue system with message ${i}`,
          duration: 3000,
          position,
        });
      }, i * 200);
    }
  };

  const handleCustomToast = () => {
    toast.info({
      title: customTitle,
      description: customDescription,
      duration: customDuration,
      position,
    });
  };

  const handleMultiplePositions = () => {
    toast.success({
      title: 'Top Right',
      description: 'This appears in top-right corner',
      position: 'top-right',
    });

    toast.warning({
      title: 'Bottom Right',
      description: 'This appears in bottom-right corner',
      position: 'bottom-right',
    });

    toast.info({
      title: 'Center',
      description: 'This appears in center of screen',
      position: 'center',
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          🍞 Toast Notifications Demo
        </h1>

        {/* Position Control */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Default Position</h3>
          <div className="flex gap-2 flex-wrap">
            {(['top-right', 'bottom-right', 'center'] as ToastPosition[]).map(
              (pos) => (
                <button
                  key={pos}
                  onClick={() => setPosition(pos)}
                  className={`px-4 py-2 rounded transition-colors ${
                    position === pos
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {pos
                    .replace('-', ' ')
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </button>
              )
            )}
          </div>
        </div>

        {/* Basic Toast Types */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Basic Toast Types</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() =>
                toast.success({
                  title: 'Success!',
                  description: 'Task completed successfully',
                  position,
                })
              }
              className="bg-green-600 text-white px-4 py-3 rounded hover:bg-green-700 transition-colors"
            >
              Success Toast
            </button>

            <button
              onClick={() =>
                toast.error({
                  title: 'Error!',
                  description: 'Something went wrong',
                  position,
                })
              }
              className="bg-red-600 text-white px-4 py-3 rounded hover:bg-red-700 transition-colors"
            >
              Error Toast
            </button>

            <button
              onClick={() =>
                toast.warning({
                  title: 'Warning!',
                  description: 'Please be careful',
                  position,
                })
              }
              className="bg-yellow-600 text-white px-4 py-3 rounded hover:bg-yellow-700 transition-colors"
            >
              Warning Toast
            </button>

            <button
              onClick={() =>
                toast.info({
                  title: 'Info!',
                  description: 'Here is some information',
                  position,
                })
              }
              className="bg-blue-600 text-white px-4 py-3 rounded hover:bg-blue-700 transition-colors"
            >
              Info Toast
            </button>
          </div>
        </div>

        {/* Advanced Features */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Advanced Features</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={handleBasicToasts}
              className="bg-purple-600 text-white px-4 py-3 rounded hover:bg-purple-700 transition-colors"
            >
              Multiple Toasts
            </button>

            <button
              onClick={handlePresetToasts}
              className="bg-indigo-600 text-white px-4 py-3 rounded hover:bg-indigo-700 transition-colors"
            >
              Preset Messages
            </button>

            <button
              onClick={handleQueueTest}
              className="bg-pink-600 text-white px-4 py-3 rounded hover:bg-pink-700 transition-colors"
            >
              Queue Test (8 toasts)
            </button>

            <button
              onClick={handleMultiplePositions}
              className="bg-teal-600 text-white px-4 py-3 rounded hover:bg-teal-700 transition-colors"
            >
              Multiple Positions
            </button>
          </div>
        </div>

        {/* Custom Toast Configuration */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            Custom Toast Configuration
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (ms)
              </label>
              <input
                type="number"
                value={customDuration}
                onChange={(e) => setCustomDuration(Number(e.target.value))}
                min="1000"
                max="30000"
                step="1000"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleCustomToast}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition-colors"
              >
                Show Custom Toast
              </button>
            </div>
          </div>
        </div>

        {/* Special Features */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Special Features</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() =>
                toast.success({
                  title: 'Persistent',
                  description: 'This toast never auto-dismisses',
                  duration: 0,
                  position,
                })
              }
              className="bg-orange-600 text-white px-4 py-3 rounded hover:bg-orange-700 transition-colors"
            >
              Persistent Toast
            </button>

            <button
              onClick={() =>
                toast.info({
                  title: 'Quick Message',
                  description: 'Disappears in 1 second',
                  duration: 1000,
                  position,
                })
              }
              className="bg-cyan-600 text-white px-4 py-3 rounded hover:bg-cyan-700 transition-colors"
            >
              Quick Toast (1s)
            </button>

            <button
              onClick={() => toast.clearAll()}
              className="bg-gray-600 text-white px-4 py-3 rounded hover:bg-gray-700 transition-colors"
            >
              Clear All Toasts
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">
            🎮 How to Test
          </h3>
          <ul className="text-blue-700 space-y-2">
            <li>
              • <strong>Click to dismiss:</strong> Click on any toast to close
              it
            </li>
            <li>
              • <strong>Swipe to dismiss:</strong> Drag left or right to close
            </li>
            <li>
              • <strong>Auto-dismiss:</strong> Most toasts disappear after 5
              seconds
            </li>
            <li>
              • <strong>Queue system:</strong> Maximum 5 toasts shown at once
            </li>
            <li>
              • <strong>Animations:</strong> Smooth slide-in/out with Framer
              Motion
            </li>
            <li>
              • <strong>Progress bar:</strong> Shows remaining time before
              auto-dismiss
            </li>
          </ul>
        </div>

        {/* Current Statistics */}
        <div className="mt-6 text-center text-gray-600">
          <p>
            Current active toasts: <strong>{toast.toasts.length}</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ToastDemo;
