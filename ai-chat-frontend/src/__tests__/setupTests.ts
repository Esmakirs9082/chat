/**
 * Setup Tests Configuration
 * Глобальная конфигурация для Jest/Vitest с настройкой моков и утилит
 */

// ===========================================
// Testing Library Setup
// ===========================================

// Когда будут установлены зависимости, раскомментировать:
// import '@testing-library/jest-dom';
// import { configure } from '@testing-library/react';

// Configure testing library
// configure({
//   testIdAttribute: 'data-testid',
//   asyncUtilTimeout: 5000,
// });

// ===========================================
// Global Mocks
// ===========================================

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock window.ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock window.IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
  root: null,
  rootMargin: '',
  thresholds: [],
}));

// Mock window.getComputedStyle
global.getComputedStyle = jest.fn().mockImplementation(() => ({
  getPropertyValue: jest.fn().mockReturnValue(''),
  setProperty: jest.fn(),
  removeProperty: jest.fn(),
}));

// Mock window.scrollTo
global.scrollTo = jest.fn();

// Mock window.scroll
global.scroll = jest.fn();

// ===========================================
// Storage Mocks
// ===========================================

const createStorageMock = () => {
  let store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: jest.fn((index) => Object.keys(store)[index] || null),
  };
};

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: createStorageMock(),
});

// Mock sessionStorage
Object.defineProperty(window, 'sessionStorage', {
  value: createStorageMock(),
});

// ===========================================
// Network Mocks
// ===========================================

// Mock fetch API
global.fetch = jest.fn();

// Mock WebSocket
global.WebSocket = jest.fn().mockImplementation(() => ({
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  send: jest.fn(),
  close: jest.fn(),
  readyState: 0,
  url: '',
  protocol: '',
  extensions: '',
  bufferedAmount: 0,
  binaryType: 'blob',
  onopen: null,
  onclose: null,
  onerror: null,
  onmessage: null,
})) as any;

// Mock XMLHttpRequest
const mockXHR = {
  open: jest.fn(),
  send: jest.fn(),
  setRequestHeader: jest.fn(),
  abort: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  readyState: 0,
  responseText: '',
  status: 200,
  statusText: 'OK',
  response: null,
  responseType: '',
  responseURL: '',
  timeout: 0,
  withCredentials: false,
  upload: {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
  onreadystatechange: null,
  ontimeout: null,
  onerror: null,
  onload: null,
  onloadstart: jest.fn(),
  onloadend: jest.fn(),
  onprogress: jest.fn(),
  onabort: jest.fn(),
};

global.XMLHttpRequest = jest.fn(() => mockXHR) as any;

// ===========================================
// Animation Mocks
// ===========================================

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn((callback) => {
  return setTimeout(callback, 16);
});

// Mock cancelAnimationFrame
global.cancelAnimationFrame = jest.fn((id) => {
  clearTimeout(id);
});

// Mock Element.animate
Element.prototype.animate = jest.fn().mockImplementation(() => ({
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  cancel: jest.fn(),
  finish: jest.fn(),
  pause: jest.fn(),
  play: jest.fn(),
  reverse: jest.fn(),
  updatePlaybackRate: jest.fn(),
  currentTime: 0,
  effect: null,
  finished: Promise.resolve(),
  id: '',
  pending: false,
  playState: 'idle',
  playbackRate: 1,
  ready: Promise.resolve(),
  replaceState: 'active',
  startTime: 0,
  timeline: null,
  oncancel: null,
  onfinish: null,
  onremove: null,
}));

// Mock CSS transitions
const mockTransition = {
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  cancel: jest.fn(),
  finish: jest.fn(),
  pause: jest.fn(),
  play: jest.fn(),
};

Element.prototype.getAnimations = jest.fn().mockReturnValue([]);

// ===========================================
// URL and Navigation Mocks
// ===========================================

// Mock URL constructor
global.URL = jest.fn().mockImplementation((url: string, base?: string) => ({
  href: url,
  origin: 'http://localhost',
  protocol: 'http:',
  host: 'localhost',
  hostname: 'localhost',
  port: '',
  pathname: '/',
  search: '',
  hash: '',
  username: '',
  password: '',
  searchParams: new URLSearchParams(),
  toString: () => url,
  toJSON: () => url,
})) as any;

// Mock URLSearchParams
global.URLSearchParams = jest.fn().mockImplementation((init) => {
  const params = new Map();

  return {
    append: jest.fn((key, value) => {
      const existing = params.get(key);
      if (existing) {
        params.set(key, [...existing, value]);
      } else {
        params.set(key, [value]);
      }
    }),
    delete: jest.fn((key) => params.delete(key)),
    entries: jest.fn(() => params.entries()),
    forEach: jest.fn((callback) => params.forEach(callback)),
    get: jest.fn((key) => {
      const values = params.get(key);
      return values ? values[0] : null;
    }),
    getAll: jest.fn((key) => params.get(key) || []),
    has: jest.fn((key) => params.has(key)),
    keys: jest.fn(() => params.keys()),
    set: jest.fn((key, value) => params.set(key, [value])),
    sort: jest.fn(),
    toString: jest.fn(() => ''),
    values: jest.fn(() => params.values()),
    [Symbol.iterator]: jest.fn(() => params[Symbol.iterator]()),
  };
});

// ===========================================
// Media Mocks
// ===========================================

// Mock HTMLMediaElement
Object.defineProperty(HTMLMediaElement.prototype, 'play', {
  writable: true,
  value: jest.fn().mockImplementation(() => Promise.resolve()),
});

Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
  writable: true,
  value: jest.fn(),
});

Object.defineProperty(HTMLMediaElement.prototype, 'load', {
  writable: true,
  value: jest.fn(),
});

// Mock HTMLCanvasElement
HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue({
  fillRect: jest.fn(),
  clearRect: jest.fn(),
  getImageData: jest.fn(() => ({ data: new Array(4) })),
  putImageData: jest.fn(),
  createImageData: jest.fn(() => ({ data: new Array(4) })),
  setTransform: jest.fn(),
  drawImage: jest.fn(),
  save: jest.fn(),
  fillText: jest.fn(),
  restore: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  closePath: jest.fn(),
  stroke: jest.fn(),
  translate: jest.fn(),
  scale: jest.fn(),
  rotate: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  measureText: jest.fn(() => ({ width: 0 })),
  transform: jest.fn(),
  rect: jest.fn(),
  clip: jest.fn(),
});

// ===========================================
// Console Mocks (для подавления логов в тестах)
// ===========================================

const originalConsole = { ...console };

// Подавляем console.error в тестах (можно настроить через переменные окружения)
if (process.env.NODE_ENV === 'test') {
  console.error = jest.fn((message) => {
    // Показываем только важные ошибки
    if (
      message.includes('Warning:') ||
      message.includes('Error:') ||
      message.includes('Failed')
    ) {
      originalConsole.error(message);
    }
  });

  console.warn = jest.fn((message) => {
    // Показываем предупреждения в development режиме
    if (process.env.NODE_ENV === 'development') {
      originalConsole.warn(message);
    }
  });
}

// ===========================================
// Custom Matchers
// ===========================================

// Расширяем expect с кастомными матчерами
expect.extend({
  toBeInRange(received: number, floor: number, ceiling: number) {
    const pass = received >= floor && received <= ceiling;

    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },

  toHaveBeenCalledWithObjectContaining(received: any, expected: any) {
    const pass = received.mock.calls.some((call: any[]) =>
      call.some(
        (arg: any) =>
          typeof arg === 'object' &&
          Object.keys(expected).every((key) => arg[key] === expected[key])
      )
    );

    return {
      message: () =>
        pass
          ? `expected function not to have been called with object containing ${JSON.stringify(expected)}`
          : `expected function to have been called with object containing ${JSON.stringify(expected)}`,
      pass,
    };
  },

  toHaveClass(received: any, className: string) {
    const pass = received?.classList?.contains?.(className) || false;

    return {
      message: () =>
        pass
          ? `expected element not to have class "${className}"`
          : `expected element to have class "${className}"`,
      pass,
    };
  },
});

// ===========================================
// Test Environment Setup
// ===========================================

// Cleanup после каждого теста
afterEach(() => {
  // Очищаем все моки
  jest.clearAllMocks();

  // Очищаем localStorage/sessionStorage
  localStorage.clear();
  sessionStorage.clear();

  // Очищаем DOM
  document.body.innerHTML = '';
  document.head.innerHTML = '';

  // Сбрасываем focus
  if (document.activeElement && document.activeElement !== document.body) {
    (document.activeElement as HTMLElement).blur();
  }

  // Очищаем таймеры
  jest.clearAllTimers();

  // Восстанавливаем все mocks
  jest.restoreAllMocks();
});

// Cleanup перед каждым тестом
beforeEach(() => {
  // Устанавливаем базовые мета-теги
  const viewport = document.createElement('meta');
  viewport.name = 'viewport';
  viewport.content = 'width=device-width, initial-scale=1';
  document.head.appendChild(viewport);

  // Устанавливаем базовый класс для body (для dark mode и т.д.)
  document.body.className = '';

  // Очищаем все активные таймеры
  jest.clearAllTimers();
});

// ===========================================
// Global Test Utilities
// ===========================================

// Глобальная утилита для создания mock функций с типизацией
global.createMockFunction = <
  T extends (...args: any[]) => any,
>(): jest.MockedFunction<T> => {
  return jest.fn() as unknown as jest.MockedFunction<T>;
};

// Глобальная утилита для ожидания всех Promise
global.flushPromises = () => new Promise((resolve) => setImmediate(resolve));

// Утилита для advance timers в тестах
global.advanceTimersByTime = (time: number) => {
  jest.advanceTimersByTime(time);
};

// ===========================================
// Error Boundary для тестов
// ===========================================

// Мок для React Error Boundary в тестах
global.mockErrorBoundary = (error: Error) => {
  const errorInfo = {
    componentStack: '\n    in TestComponent\n    in ErrorBoundary',
  };

  console.error('Error Boundary caught error:', error, errorInfo);

  return {
    hasError: true,
    error,
    errorInfo,
  };
};

// ===========================================
// Performance Mocks
// ===========================================

// Mock performance API
Object.defineProperty(global, 'performance', {
  value: {
    now: jest.fn(() => Date.now()),
    mark: jest.fn(),
    measure: jest.fn(),
    navigation: {
      type: 'navigate',
    },
    timing: {
      navigationStart: Date.now(),
      loadEventEnd: Date.now() + 1000,
    },
  },
});

// ===========================================
// Export для использования в тестах
// ===========================================

export { createStorageMock, mockXHR, originalConsole };

// Для TypeScript - расширяем глобальные типы
declare global {
  function createMockFunction<
    T extends (...args: any[]) => any,
  >(): jest.MockedFunction<T>;
  function flushPromises(): Promise<void>;
  function advanceTimersByTime(time: number): void;
  function mockErrorBoundary(error: Error): {
    hasError: boolean;
    error: Error;
    errorInfo: any;
  };

  namespace jest {
    interface Matchers<R> {
      toBeInRange(floor: number, ceiling: number): R;
      toHaveBeenCalledWithObjectContaining(expected: object): R;
      toHaveClass(className: string): R;
    }
  }
}
