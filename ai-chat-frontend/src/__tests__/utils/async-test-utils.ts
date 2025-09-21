/**
 * Async Testing Utilities
 * Утилиты для тестирования асинхронных операций, состояний загрузки и ошибок
 */

// Заменяем на локальные типы пока нет testing-library
type WaitForOptions = {
  timeout?: number;
  interval?: number;
};

type MockScreen = {
  queryByText: (text: string | RegExp) => HTMLElement | null;
  queryByTestId: (testId: string) => HTMLElement | null;
  queryByRole: (role: string, options?: any) => HTMLElement | null;
};

// ===========================================
// Loading State Testing
// ===========================================

/**
 * Ожидает появления состояния загрузки
 */
export const waitForLoadingState = async (
  screen: MockScreen,
  options: WaitForOptions = {}
): Promise<HTMLElement> => {
  const { timeout = 5000, interval = 100 } = options;
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const loadingElement =
      screen.queryByTestId('loading-spinner') ||
      screen.queryByTestId('skeleton') ||
      screen.queryByText(/загрузка|loading/i) ||
      screen.queryByRole('status');

    if (loadingElement) {
      return loadingElement;
    }

    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  throw new Error(`Loading state did not appear within ${timeout}ms`);
};

/**
 * Ожидает исчезновения состояния загрузки
 */
export const waitForLoadingToFinish = async (
  screen: MockScreen,
  options: WaitForOptions = {}
): Promise<void> => {
  const { timeout = 10000, interval = 100 } = options;
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const loadingElement =
      screen.queryByTestId('loading-spinner') ||
      screen.queryByTestId('skeleton') ||
      screen.queryByText(/загрузка|loading/i) ||
      screen.queryByRole('status');

    if (!loadingElement) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  throw new Error(`Loading state did not finish within ${timeout}ms`);
};

/**
 * Проверяет последовательность состояний: loading -> content
 */
export const expectLoadingSequence = async (
  screen: MockScreen,
  contentChecker: () => HTMLElement | null,
  options: WaitForOptions = {}
): Promise<void> => {
  // 1. Проверяем появление загрузки
  await waitForLoadingState(screen, { timeout: 1000 });

  // 2. Проверяем исчезновение загрузки
  await waitForLoadingToFinish(screen, options);

  // 3. Проверяем появление контента
  const startTime = Date.now();
  const { timeout = 5000, interval = 100 } = options;

  while (Date.now() - startTime < timeout) {
    const content = contentChecker();
    if (content) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  throw new Error(
    `Content did not appear after loading finished within ${timeout}ms`
  );
};

// ===========================================
// Error State Testing
// ===========================================

/**
 * Ожидает появления сообщения об ошибке
 */
export const waitForErrorMessage = async (
  screen: MockScreen,
  errorText?: string | RegExp,
  options: WaitForOptions = {}
): Promise<HTMLElement> => {
  const { timeout = 5000, interval = 100 } = options;
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    let errorElement: HTMLElement | null = null;

    if (errorText) {
      errorElement = screen.queryByText(errorText);
    } else {
      errorElement =
        screen.queryByTestId('error-message') ||
        screen.queryByText(/ошибка|error|что-то пошло не так/i) ||
        screen.queryByRole('alert');
    }

    if (errorElement) {
      return errorElement;
    }

    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  throw new Error(`Error message did not appear within ${timeout}ms`);
};

/**
 * Проверяет последовательность: loading -> error
 */
export const expectErrorSequence = async (
  screen: MockScreen,
  errorText?: string | RegExp,
  options: WaitForOptions = {}
): Promise<void> => {
  // 1. Может быть состояние загрузки
  try {
    await waitForLoadingState(screen, { timeout: 1000 });
    await waitForLoadingToFinish(screen, { timeout: 5000 });
  } catch {
    // Загрузка может отсутствовать, это нормально
  }

  // 2. Проверяем появление ошибки
  await waitForErrorMessage(screen, errorText, options);
};

// ===========================================
// Data Fetching Testing
// ===========================================

/**
 * Мокает успешный API запрос с задержкой
 */
export const mockSuccessfulApiCall = <T>(
  data: T,
  delay: number = 500
): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

/**
 * Мокает неудачный API запрос с задержкой
 */
export const mockFailedApiCall = (
  error: string | Error = 'API Error',
  delay: number = 500
): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      const errorObj = typeof error === 'string' ? new Error(error) : error;
      reject(errorObj);
    }, delay);
  });
};

/**
 * Мокает API запрос с возможностью отмены
 */
export const mockCancellableApiCall = <T>(
  data: T,
  delay: number = 500
): { promise: Promise<T>; cancel: () => void } => {
  let cancelled = false;

  const promise = new Promise<T>((resolve, reject) => {
    setTimeout(() => {
      if (cancelled) {
        reject(new Error('Request cancelled'));
      } else {
        resolve(data);
      }
    }, delay);
  });

  const cancel = () => {
    cancelled = true;
  };

  return { promise, cancel };
};

// ===========================================
// Form Submission Testing
// ===========================================

/**
 * Симулирует отправку формы с валидацией
 */
export const simulateFormSubmission = async (
  screen: MockScreen,
  formData: Record<string, string>,
  options: {
    expectValidation?: boolean;
    validationDelay?: number;
    submissionDelay?: number;
  } = {}
): Promise<void> => {
  const {
    expectValidation = true,
    validationDelay = 200,
    submissionDelay = 1000,
  } = options;

  // 1. Заполняем форму
  Object.entries(formData).forEach(([fieldName, value]) => {
    const input = screen.queryByRole('textbox', {
      name: new RegExp(fieldName, 'i'),
    });
    if (input) {
      // Симулируем ввод
      (input as HTMLInputElement).value = value;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  // 2. Ждем валидацию
  if (expectValidation) {
    await new Promise((resolve) => setTimeout(resolve, validationDelay));
  }

  // 3. Отправляем форму
  const submitButton = screen.queryByRole('button', {
    name: /отправить|submit/i,
  });
  if (submitButton) {
    submitButton.click();
  }

  // 4. Ждем обработку
  await new Promise((resolve) => setTimeout(resolve, submissionDelay));
};

/**
 * Ожидает результат отправки формы
 */
export const expectFormSubmissionResult = async (
  screen: MockScreen,
  expectedResult: 'success' | 'error',
  options: WaitForOptions = {}
): Promise<void> => {
  const { timeout = 5000 } = options;

  if (expectedResult === 'success') {
    // Ожидаем успешное сообщение или редирект
    const successElement = await Promise.race([
      waitForElement(
        screen,
        () => screen.queryByText(/успешно|success|сохранено/i),
        { timeout }
      ),
      waitForElement(screen, () => screen.queryByTestId('success-message'), {
        timeout,
      }),
    ]);

    if (!successElement) {
      throw new Error('Success state not found after form submission');
    }
  } else {
    await waitForErrorMessage(screen, undefined, { timeout });
  }
};

// ===========================================
// Real-time Updates Testing
// ===========================================

/**
 * Симулирует получение real-time обновлений
 */
export const simulateRealtimeUpdate = <T>(
  callback: (data: T) => void,
  updates: T[],
  interval: number = 1000
): { start: () => void; stop: () => void } => {
  let intervalId: NodeJS.Timeout | null = null;
  let currentIndex = 0;

  const start = () => {
    intervalId = setInterval(() => {
      if (currentIndex < updates.length) {
        callback(updates[currentIndex]);
        currentIndex++;
      }
    }, interval);
  };

  const stop = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  return { start, stop };
};

/**
 * Ожидает определенное количество обновлений
 */
export const waitForUpdates = async (
  screen: MockScreen,
  updateChecker: () => HTMLElement | null,
  expectedCount: number,
  options: WaitForOptions & { updateInterval?: number } = {}
): Promise<HTMLElement[]> => {
  const { timeout = 10000, interval = 100, updateInterval = 1000 } = options;

  const foundUpdates: HTMLElement[] = [];
  const startTime = Date.now();
  let lastUpdateTime = startTime;

  while (
    Date.now() - startTime < timeout &&
    foundUpdates.length < expectedCount
  ) {
    const update = updateChecker();

    if (update && Date.now() - lastUpdateTime >= updateInterval) {
      foundUpdates.push(update);
      lastUpdateTime = Date.now();
    }

    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  if (foundUpdates.length < expectedCount) {
    throw new Error(
      `Expected ${expectedCount} updates, but only found ${foundUpdates.length} within ${timeout}ms`
    );
  }

  return foundUpdates;
};

// ===========================================
// Typing Simulation
// ===========================================

/**
 * Симулирует постепенный ввод текста
 */
export const simulateTyping = async (
  input: HTMLElement,
  text: string,
  options: {
    delay?: number;
    clearFirst?: boolean;
  } = {}
): Promise<void> => {
  const { delay = 100, clearFirst = true } = options;

  if (clearFirst && input instanceof HTMLInputElement) {
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }

  for (let i = 0; i < text.length; i++) {
    if (input instanceof HTMLInputElement) {
      input.value = text.substring(0, i + 1);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }

    await new Promise((resolve) => setTimeout(resolve, delay));
  }
};

/**
 * Симулирует индикатор набора текста в чате
 */
export const simulateTypingIndicator = (
  screen: MockScreen,
  duration: number = 3000
): Promise<void> => {
  return new Promise((resolve) => {
    // Показываем индикатор
    const indicator = document.createElement('div');
    indicator.setAttribute('data-testid', 'typing-indicator');
    indicator.textContent = 'Печатает...';
    document.body.appendChild(indicator);

    // Убираем через заданное время
    setTimeout(() => {
      document.body.removeChild(indicator);
      resolve();
    }, duration);
  });
};

// ===========================================
// Network Simulation
// ===========================================

/**
 * Симулирует медленную сеть
 */
export const simulateSlowNetwork = <T>(
  operation: () => Promise<T>,
  delay: number = 3000
): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const result = await operation();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }, delay);
  });
};

/**
 * Симулирует прерывание сети
 */
export const simulateNetworkFailure = (
  delay: number = 1000
): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('Network Error'));
    }, delay);
  });
};

// ===========================================
// Utility Functions
// ===========================================

/**
 * Универсальная функция ожидания элемента
 */
export const waitForElement = async (
  screen: MockScreen,
  elementFinder: () => HTMLElement | null,
  options: WaitForOptions = {}
): Promise<HTMLElement> => {
  const { timeout = 5000, interval = 100 } = options;
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const element = elementFinder();
    if (element) {
      return element;
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  throw new Error(`Element not found within ${timeout}ms`);
};

/**
 * Ожидание выполнения условия
 */
export const waitForCondition = async (
  condition: () => boolean,
  options: WaitForOptions = {}
): Promise<void> => {
  const { timeout = 5000, interval = 100 } = options;
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    if (condition()) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  throw new Error(`Condition was not met within ${timeout}ms`);
};

/**
 * Функция для тестирования с таймаутом
 */
export const withTimeout = <T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage = 'Operation timed out'
): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(errorMessage)), timeoutMs);
    }),
  ]);
};

/**
 * Пакетное ожидание нескольких условий
 */
export const waitForMultipleConditions = async (
  conditions: Array<{
    name: string;
    check: () => boolean;
    timeout?: number;
  }>
): Promise<void> => {
  const promises = conditions.map(({ name, check, timeout = 5000 }) =>
    waitForCondition(check, { timeout }).catch((error) => {
      throw new Error(`Condition "${name}" failed: ${error.message}`);
    })
  );

  await Promise.all(promises);
};

/**
 * Retry утилита для нестабильных тестов
 */
export const retry = async <T>(
  operation: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxAttempts) {
        break;
      }

      console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error(
    `Operation failed after ${maxAttempts} attempts. Last error: ${lastError!.message}`
  );
};
