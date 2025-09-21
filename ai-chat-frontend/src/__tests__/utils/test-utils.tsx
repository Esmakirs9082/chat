/**
 * Testing Utilities
 * Кастомные утилиты для тестирования React компонентов с providers
 */

import React, { ReactElement, ReactNode } from 'react';
import {
  render,
  renderHook,
  RenderOptions,
  RenderHookOptions,
} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { vi } from 'vitest'; // Закомментировано до установки vitest

// Простой мок для замены vitest/jest
const mockFn = (implementation?: Function) => {
  const fn = implementation || (() => {});
  (fn as any).mockClear = () => {};
  (fn as any).mockReset = () => {};
  (fn as any).mockRestore = () => {};
  return fn as jest.MockedFunction<any>;
};

const vi = {
  fn: mockFn,
  mock: mockFn,
  clearAllMocks: () => {},
  resetAllMocks: () => {},
};

// Zustand stores
import { useAuthStore } from '../../stores/authStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { useCharacterStore } from '../../stores/characterStore';
import { useSubscriptionStore } from '../../stores/subscriptionStore';

// Contexts
import { ToastProvider } from '../../contexts/ToastContext';

// Types
import type { User, Character, Message, Subscription } from '../../types';

// ===========================================
// Test Wrapper with Providers
// ===========================================

interface TestWrapperProps {
  children: ReactNode;
  queryClient?: QueryClient;
  initialRoute?: string;
}

function TestWrapper({
  children,
  queryClient,
  initialRoute = '/',
}: TestWrapperProps) {
  // Create a new QueryClient for each test to avoid state pollution
  const testQueryClient =
    queryClient ||
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        },
        mutations: {
          retry: false,
        },
      },
    });

  return (
    <BrowserRouter>
      <QueryClientProvider client={testQueryClient}>
        <ToastProvider>{children}</ToastProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

// ===========================================
// Custom Render Functions
// ===========================================

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient;
  initialRoute?: string;
  wrapper?: React.ComponentType<any>;
}

/**
 * Кастомный render с providers
 */
export function customRender(
  ui: ReactElement,
  options: CustomRenderOptions = {}
) {
  const { queryClient, initialRoute, wrapper, ...renderOptions } = options;

  const Wrapper =
    wrapper ||
    (({ children }: { children: ReactNode }) => (
      <TestWrapper queryClient={queryClient} initialRoute={initialRoute}>
        {children}
      </TestWrapper>
    ));

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

/**
 * Кастомный renderHook с providers
 */
export function customRenderHook<TResult, TProps>(
  hook: (initialProps: TProps) => TResult,
  options: RenderHookOptions<TProps> & CustomRenderOptions = {}
) {
  const { queryClient, initialRoute, wrapper, ...renderOptions } = options;

  const Wrapper =
    wrapper ||
    (({ children }: { children: ReactNode }) => (
      <TestWrapper queryClient={queryClient} initialRoute={initialRoute}>
        {children}
      </TestWrapper>
    ));

  return renderHook(hook, { wrapper: Wrapper, ...renderOptions });
}

// ===========================================
// Store Utilities
// ===========================================

/**
 * Сброс всех Zustand stores
 */
export function resetStores() {
  useAuthStore.getState().reset?.();
  useSettingsStore.getState().reset?.();
  useCharacterStore.getState().reset?.();
  useSubscriptionStore.getState().reset?.();
}

/**
 * Установка начального состояния stores
 */
export function setupStores(
  initialState: {
    auth?: Partial<ReturnType<typeof useAuthStore.getState>>;
    settings?: Partial<ReturnType<typeof useSettingsStore.getState>>;
    character?: Partial<ReturnType<typeof useCharacterStore.getState>>;
    subscription?: Partial<ReturnType<typeof useSubscriptionStore.getState>>;
  } = {}
) {
  if (initialState.auth) {
    useAuthStore.setState(initialState.auth);
  }
  if (initialState.settings) {
    useSettingsStore.setState(initialState.settings);
  }
  if (initialState.character) {
    useCharacterStore.setState(initialState.character);
  }
  if (initialState.subscription) {
    useSubscriptionStore.setState(initialState.subscription);
  }
}

// ===========================================
// Mock Functions
// ===========================================

/**
 * Mock для localStorage
 */
export const mockLocalStorage = () => {
  const storage: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => storage[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      storage[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete storage[key];
    }),
    clear: vi.fn(() => {
      Object.keys(storage).forEach((key) => delete storage[key]);
    }),
    key: vi.fn((index: number) => Object.keys(storage)[index] || null),
    get length() {
      return Object.keys(storage).length;
    },
  };
};

/**
 * Mock для fetch API
 */
export const mockFetch = (responseData: any, status = 200) => {
  return vi.fn(() =>
    Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(responseData),
      text: () => Promise.resolve(JSON.stringify(responseData)),
      headers: new Headers(),
      redirected: false,
      statusText: status === 200 ? 'OK' : 'Error',
      type: 'basic' as const,
      url: '',
      clone: vi.fn(),
      body: null,
      bodyUsed: false,
    } as Response)
  );
};

/**
 * Mock для WebSocket
 */
export class MockWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  readyState = MockWebSocket.CONNECTING;
  onopen = vi.fn();
  onclose = vi.fn();
  onmessage = vi.fn();
  onerror = vi.fn();

  constructor(public url: string) {
    // Симулируем успешное подключение
    setTimeout(() => {
      this.readyState = MockWebSocket.OPEN;
      this.onopen?.(new Event('open'));
    }, 0);
  }

  send = vi.fn((data: string) => {
    // Симулируем отправку сообщения
    console.log('Mock WebSocket send:', data);
  });

  close = vi.fn(() => {
    this.readyState = MockWebSocket.CLOSED;
    this.onclose?.(new CloseEvent('close'));
  });

  // Метод для симуляции получения сообщения
  simulateMessage(data: any) {
    const event = new MessageEvent('message', {
      data: typeof data === 'string' ? data : JSON.stringify(data),
    });
    this.onmessage?.(event);
  }

  // Метод для симуляции ошибки
  simulateError(error: Error) {
    const event = new ErrorEvent('error', { error });
    this.onerror?.(event);
  }
}

/**
 * Mock для IntersectionObserver
 */
export const mockIntersectionObserver = () => {
  const mockIntersectionObserver = vi.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  });

  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: mockIntersectionObserver,
  });

  Object.defineProperty(global, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: mockIntersectionObserver,
  });

  return mockIntersectionObserver;
};

/**
 * Mock для ResizeObserver
 */
export const mockResizeObserver = () => {
  const mockResizeObserver = vi.fn();
  mockResizeObserver.mockReturnValue({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  });

  Object.defineProperty(window, 'ResizeObserver', {
    writable: true,
    configurable: true,
    value: mockResizeObserver,
  });

  return mockResizeObserver;
};

/**
 * Mock для matchMedia
 */
export const mockMatchMedia = (matches = false) => {
  const mockMatchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: mockMatchMedia,
  });

  return mockMatchMedia;
};

// ===========================================
// Animation Mocks
// ===========================================

/**
 * Mock для CSS animations
 */
export const mockAnimations = () => {
  // Mock для requestAnimationFrame
  Object.defineProperty(window, 'requestAnimationFrame', {
    writable: true,
    value: vi.fn((cb: FrameRequestCallback) => {
      setTimeout(cb, 16); // ~60fps
      return 1;
    }),
  });

  // Mock для cancelAnimationFrame
  Object.defineProperty(window, 'cancelAnimationFrame', {
    writable: true,
    value: vi.fn(),
  });

  // Mock для getComputedStyle
  Object.defineProperty(window, 'getComputedStyle', {
    writable: true,
    value: vi.fn(() => ({
      getPropertyValue: vi.fn(() => ''),
      animation: '',
      transition: '',
    })),
  });
};

/**
 * Mock для Framer Motion
 */
export const mockFramerMotion = () => {
  // Пока закомментировано - требует установки vitest или jest
  console.log('Framer Motion мок заглушка');
};

// Re-export testing library utilities
export * from '@testing-library/react';
export * from '@testing-library/user-event';
// export { vi } from 'vitest'; // Закомментировано до установки vitest

// Экспортируем наш локальный мок vi
export { vi };

// Custom render as default export
export { customRender as render, customRenderHook as renderHook };
