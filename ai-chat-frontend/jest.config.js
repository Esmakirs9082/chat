/**
 * Jest Configuration
 * Настройка Jest для тестирования React + TypeScript приложения
 */

module.exports = {
  // Test environment
  testEnvironment: 'jsdom',

  // Root directory
  rootDir: '.',

  // Test files patterns
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{test,spec}.{ts,tsx,js,jsx}',
    '<rootDir>/src/**/*.{test,spec}.{ts,tsx,js,jsx}',
  ],

  // Files to ignore
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/build/',
    '<rootDir>/.next/',
  ],

  // Setup files
  setupFilesAfterEnv: [
    '<rootDir>/src/__tests__/setupTests.ts',
  ],

  // Module file extensions
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node',
  ],

  // Transform files
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      },
    }],
    '^.+\\.(js|jsx)$': 'babel-jest',
    '^.+\\.css$': 'jest-transform-css',
    '^.+\\.(jpg|jpeg|png|gif|svg|webp)$': 'jest-transform-file',
  },

  // Transform ignore patterns
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$|@testing-library|framer-motion))',
  ],

  // Module name mapping (для путей и статических файлов)
  moduleNameMapper: {
    // Absolute imports
    '^@/(.*)$': '<rootDir>/src/$1',
    '^~/(.*)$': '<rootDir>/src/$1',
    
    // CSS modules
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    
    // Static files
    '\\.(jpg|jpeg|png|gif|svg|webp|ico)$': '<rootDir>/src/__tests__/mocks/fileMock.js',
    '\\.(mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/src/__tests__/mocks/fileMock.js',
    '\\.(woff|woff2|eot|ttf|otf)$': '<rootDir>/src/__tests__/mocks/fileMock.js',
  },

  // Coverage configuration
  collectCoverage: false, // Включать по необходимости
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/__tests__/**/*',
    '!src/**/*.test.{ts,tsx}',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
  ],

  coverageDirectory: 'coverage',

  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov',
    'clover',
  ],

  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },

  // Test timeout
  testTimeout: 10000,

  // Verbose output
  verbose: true,

  // Error handling
  errorOnDeprecated: true,
  
  // Bail on first error in CI
  bail: process.env.CI ? 1 : 0,

  // Max workers
  maxWorkers: process.env.CI ? 2 : '50%',

  // Cache
  cache: true,
  cacheDirectory: '<rootDir>/node_modules/.cache/jest',

  // Clear mocks between tests
  clearMocks: true,
  restoreMocks: true,

  // Global setup/teardown
  globalSetup: undefined,
  globalTeardown: undefined,

  // Reporters
  reporters: [
    'default',
    ...(process.env.CI ? [
      ['jest-junit', {
        outputDirectory: 'test-results',
        outputName: 'junit.xml',
      }]
    ] : []),
  ],

  // Watch plugins (for development)
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],

  // TypeScript configuration
  preset: 'ts-jest',

  // ESM support
  extensionsToTreatAsEsm: ['.ts', '.tsx'],

  // Mock patterns
  automock: false,
  unmockedModulePathPatterns: [
    'node_modules/react/',
    'node_modules/react-dom/',
  ],

  // Resolver
  resolver: undefined,

  // Custom environment variables
  testEnvironmentOptions: {
    url: 'http://localhost:3000',
    userAgent: 'jest-test-environment',
  },

  // Snapshot serializers
  snapshotSerializers: [
    '@emotion/jest/serializer',
  ],

  // Module directories
  moduleDirectories: [
    'node_modules',
    '<rootDir>/src',
  ],

  // Force exit (prevent hanging tests)
  forceExit: process.env.CI ? true : false,

  // Detect open handles
  detectOpenHandles: !process.env.CI,

  // Projects (для multi-project setup, если понадобится)
  projects: undefined,

  // Custom test results processor
  testResultsProcessor: undefined,

  // Notify mode (для watch mode)
  notify: false,
  notifyMode: 'failure-change',

  // Silent mode
  silent: false,

  // Log heap usage
  logHeapUsage: process.env.CI ? true : false,
};