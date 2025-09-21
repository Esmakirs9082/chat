import React, { useState } from 'react';
import Skeleton, {
  SkeletonText,
  SkeletonAvatar,
  SkeletonCard,
  SkeletonButton,
  SkeletonList,
  SkeletonForm,
} from './ui/Skeleton';
import LoadingSpinner, {
  LoadingSpinnerSmall,
  LoadingSpinnerMedium,
  LoadingSpinnerLarge,
  LoadingSpinnerPage,
  LoadingSpinnerOverlay,
  LoadingSpinnerButton,
  LoadingSpinnerCard,
  LoadingDots,
  LoadingPulse,
} from './ui/LoadingSpinner';

const LoadingDemo: React.FC = () => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              ⏳ Loading Components Demo
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Skeleton loading states and spinners for better UX
            </p>

            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
              </button>

              <button
                onClick={() => setShowOverlay(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Show Overlay
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Skeleton Components */}
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                🦴 Skeleton Components
              </h2>

              {/* Basic Skeleton Variants */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Basic Variants
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Text:
                    </p>
                    <SkeletonText lines={3} />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Avatar:
                    </p>
                    <div className="flex gap-3">
                      <SkeletonAvatar size="sm" />
                      <SkeletonAvatar size="md" />
                      <SkeletonAvatar size="lg" />
                      <SkeletonAvatar size="xl" />
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Button:
                    </p>
                    <div className="flex gap-3">
                      <SkeletonButton size="sm" />
                      <SkeletonButton size="md" />
                      <SkeletonButton size="lg" />
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Custom:
                    </p>
                    <Skeleton
                      width="200px"
                      height="100px"
                      className="rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Composite Skeletons */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Composite Skeletons
                </h3>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      Card:
                    </p>
                    <SkeletonCard showHeader showFooter />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      List:
                    </p>
                    <SkeletonList items={3} showAvatar />
                  </div>
                </div>
              </div>

              {/* Form Skeleton */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Form Skeleton
                </h3>
                <SkeletonForm fields={4} />
              </div>

              {/* Animation Control */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Animation Control
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      With Animation:
                    </p>
                    <SkeletonText lines={2} />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Without Animation:
                    </p>
                    <Skeleton variant="text" animate={false} />
                    <Skeleton
                      variant="text"
                      animate={false}
                      width="75%"
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Loading Spinners */}
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                ⚡ Loading Spinners
              </h2>

              {/* Basic Spinners */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Basic Spinners
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Sizes:
                    </p>
                    <div className="flex items-center gap-4">
                      <LoadingSpinnerSmall />
                      <LoadingSpinnerMedium />
                      <LoadingSpinnerLarge />
                      <LoadingSpinner size="xl" />
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      With Text:
                    </p>
                    <div className="space-y-3">
                      <LoadingSpinnerMedium text="Loading..." />
                      <LoadingSpinnerLarge text="Processing your request..." />
                    </div>
                  </div>
                </div>
              </div>

              {/* Color Variants */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Color Variants
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <LoadingSpinner color="primary" text="Primary" />
                    <LoadingSpinner color="success" text="Success" />
                    <LoadingSpinner color="error" text="Error" />
                  </div>
                  <div className="space-y-3">
                    <LoadingSpinner color="warning" text="Warning" />
                    <LoadingSpinner color="secondary" text="Secondary" />
                    <LoadingSpinner color="gray" text="Gray" />
                  </div>
                </div>
              </div>

              {/* Special Spinners */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Special Spinners
                </h3>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      Button Spinner:
                    </p>
                    <div className="flex gap-3">
                      <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2">
                        <LoadingSpinnerButton />
                        Loading...
                      </button>
                      <button className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2">
                        <LoadingSpinnerButton text="Saving..." />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      Dots Animation:
                    </p>
                    <div className="flex gap-4">
                      <LoadingDots size="sm" />
                      <LoadingDots size="md" color="success" />
                      <LoadingDots size="lg" color="error" />
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      Pulse Animation:
                    </p>
                    <div className="flex gap-4">
                      <LoadingPulse size="sm" />
                      <LoadingPulse size="md" color="primary" />
                      <LoadingPulse size="lg" color="warning" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Page Components */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <h3 className="text-lg font-semibold p-6 pb-0 text-gray-900 dark:text-white">
                  Page Component
                </h3>
                <LoadingSpinnerPage
                  text="Loading page content..."
                  className="h-48"
                />
              </div>

              {/* Card Component */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <LoadingSpinnerCard text="Fetching data..." />
              </div>
            </div>
          </div>

          {/* Real-world Examples */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              🌟 Real-world Examples
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Chat Message Loading */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">
                  Chat Message
                </h4>
                <div className="flex items-start space-x-3">
                  <SkeletonAvatar size="sm" />
                  <div className="flex-1 space-y-2">
                    <Skeleton variant="text" width="30%" height="0.875rem" />
                    <SkeletonText lines={2} />
                  </div>
                </div>
              </div>

              {/* Profile Card Loading */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">
                  Profile Card
                </h4>
                <div className="text-center space-y-3">
                  <div className="flex justify-center">
                    <SkeletonAvatar size="xl" />
                  </div>
                  <SkeletonText />
                  <div style={{ width: '60%', margin: '0 auto' }}>
                    <SkeletonText />
                  </div>
                  <div className="flex justify-center gap-2">
                    <SkeletonButton size="sm" />
                    <SkeletonButton size="sm" />
                  </div>
                </div>
              </div>

              {/* Article Loading */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">
                  Article
                </h4>
                <div className="space-y-4">
                  <Skeleton height="120px" className="rounded" />
                  <div style={{ width: '80%' }}>
                    <SkeletonText />
                  </div>
                  <SkeletonText lines={4} />
                  <div className="flex justify-between items-center">
                    <div style={{ width: '40%' }}>
                      <SkeletonText />
                    </div>
                    <SkeletonButton size="sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">
              📋 Usage Instructions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-blue-700 dark:text-blue-300">
              <div>
                <h4 className="font-medium mb-2">Skeleton Components:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Use for content that's loading</li>
                  <li>• Match the shape of final content</li>
                  <li>• Animate by default for better UX</li>
                  <li>• Support dark mode automatically</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Loading Spinners:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Use for actions in progress</li>
                  <li>• Choose appropriate size and color</li>
                  <li>• Add descriptive text when needed</li>
                  <li>• Use overlay for blocking actions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Overlay Demo */}
        {showOverlay && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center cursor-pointer"
            onClick={() => setShowOverlay(false)}
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl">
              <LoadingSpinner
                size="lg"
                color="primary"
                text="Processing your request..."
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingDemo;
