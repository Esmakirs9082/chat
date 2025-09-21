# Testing Infrastructure Setup Guide

Полное руководство по настройке и использованию системы тестирования для AI Chat Frontend.

## 📋 Обзор системы

Создана комплексная система тестирования включающая:

- **Test Utilities** - кастомные утилиты для рендера компонентов с провайдерами
- **Data Factories** - генераторы тестовых данных для всех сущностей приложения
- **Screen Assertions** - хелперы для проверки UI состояний
- **Async Test Utils** - утилиты для тестирования асинхронных операций
- **MSW Mocking** - мокирование API запросов
- **Jest Configuration** - настройка тестового окружения

## 🚀 Быстрый старт

### 1. Установка зависимостей

```bash
npm install --save-dev \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  @testing-library/react-hooks \
  jest \
  jest-environment-jsdom \
  ts-jest \
  msw \
  @types/jest \
  identity-obj-proxy \
  jest-transform-css \
  jest-watch-typeahead
```

### 2. Обновление setupTests.ts

Раскомментируйте импорты в `src/__tests__/setupTests.ts`:

```typescript
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

configure({
  testIdAttribute: 'data-testid',
  asyncUtilTimeout: 5000,
});
```

### 3. Настройка MSW

В `src/__tests__/mocks/server.ts` раскомментируйте:

```typescript
import { setupServer } from 'msw/node';
import { rest } from 'msw';

export const server = setupServer(
  ...mockHandlers.map((h) => rest[h.method.toLowerCase()](h.path, h.handler))
);
```

### 4. Обновление test-utils.ts

Замените моковые импорты на реальные:

```typescript
import { render, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
```

## 📁 Структура файлов

```
src/__tests__/
├── utils/
│   ├── test-utils.tsx         # Кастомный render и утилиты
│   ├── test-factories.ts      # Генераторы тестовых данных
│   ├── screen-assertions.ts   # UI проверки
│   └── async-test-utils.ts    # Асинхронное тестирование
├── mocks/
│   ├── server.ts             # MSW сервер и handlers
│   └── fileMock.js           # Мок для статических файлов
├── examples/
│   └── component-tests.test.tsx  # Примеры тестов
└── setupTests.ts             # Глобальная настройка тестов
```

## 🛠 Основные утилиты

### Test Utils

```typescript
import { customRender, resetStores } from '../utils/test-utils';

// Рендер компонента со всеми провайдерами
const { getByText } = customRender(<MyComponent />);

// Сброс состояния сторов между тестами
resetStores();
```

### Data Factories

```typescript
import {
  createUser,
  createCharacter,
  createMessage,
} from '../utils/test-factories';

// Создание тестовых данных
const user = createUser({ email: 'test@test.com' });
const character = createCharacter({ name: 'Test Bot' });
const message = createMessage({ content: 'Hello!' });
```

### Screen Assertions

```typescript
import {
  expectLoadingState,
  expectToastState,
} from '../utils/screen-assertions';

// Проверка состояний UI
expectLoadingState(screen).toBeVisible();
expectToastState(screen).toShowSuccess(/успешно/i);
```

### Async Testing

```typescript
import {
  waitForLoadingToFinish,
  mockSuccessfulApiCall,
} from '../utils/async-test-utils';

// Ожидание завершения загрузки
await waitForLoadingToFinish(screen);

// Мокирование API вызовов
const data = await mockSuccessfulApiCall({ result: 'success' });
```

## 🧪 Примеры тестов

### Компонентный тест

```typescript
describe('Button Component', () => {
  it('should handle click events', async () => {
    const handleClick = jest.fn();
    const { getByRole } = customRender(
      <Button onClick={handleClick}>Click me</Button>
    );

    const button = getByRole('button');
    await userEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Тест с API мокингом

```typescript
describe('Characters Gallery', () => {
  beforeEach(() => {
    const mockCharacters = [
      createCharacter({ name: 'Alice' }),
      createCharacter({ name: 'Bob' })
    ];
    mockCharactersScenario(mockCharacters);
  });

  it('should load and display characters', async () => {
    const { getByText } = customRender(<CharactersGallery />);

    await waitForLoadingToFinish(screen);

    expect(getByText('Alice')).toBeInTheDocument();
    expect(getByText('Bob')).toBeInTheDocument();
  });
});
```

### Форма тест

```typescript
describe('Login Form', () => {
  it('should submit form successfully', async () => {
    mockSuccessfulLogin();
    const { getByRole } = customRender(<LoginForm />);

    await simulateFormSubmission(screen, {
      email: 'test@example.com',
      password: 'password123'
    });

    await waitFor(() => {
      expectToastState(screen).toShowSuccess(/добро пожаловать/i);
    });
  });
});
```

## 🎯 Лучшие практики

### 1. Структура тестов

```typescript
describe('Component Name', () => {
  beforeEach(() => {
    resetStores(); // Очищаем состояние
  });

  describe('when user is authenticated', () => {
    beforeEach(() => {
      mockSuccessfulLogin();
    });

    it('should display user content', () => {
      // тест
    });
  });
});
```

### 2. Именование тестов

- Используйте описательные имена: `should display error when login fails`
- Группируйте по сценариям: `when user is not authenticated`
- Покрывайте edge cases: `should handle empty response`

### 3. Мокирование

```typescript
// Хорошо: специфичный мок для теста
mockCharactersScenario([
  createCharacter({ name: 'Test Character', isNSFW: false }),
]);

// Плохо: универсальный мок для всех тестов
mockSuccessfulApiCall(genericData);
```

### 4. Асинхронность

```typescript
// Используйте правильные ожидания
await waitFor(() => {
  expect(screen.getByText('Loading...')).not.toBeInTheDocument();
});

// Не забывайте про cleanup
afterEach(() => {
  jest.clearAllMocks();
});
```

## 📊 Команды тестирования

```bash
# Запуск всех тестов
npm test

# Запуск с наблюдением
npm run test:watch

# Генерация отчета покрытия
npm run test:coverage

# Запуск в CI режиме
npm run test:ci
```

## 🔧 Настройка CI/CD

### GitHub Actions пример:

```yaml
- name: Run tests
  run: |
    npm ci
    npm run test:ci

- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    file: ./coverage/lcov.info
```

## 🚨 Troubleshooting

### Проблема: "jest is not defined"

**Решение:** Убедитесь что установлены `@types/jest` и jest globals настроены в `setupTests.ts`

### Проблема: "MSW handlers not working"

**Решение:** Проверьте что `server.listen()` вызывается в `beforeAll()` и сервер настроен правильно

### Проблема: "Component not updating"

**Решение:** Используйте `waitFor()` для асинхронных обновлений и проверьте что моки возвращают корректные данные

## 📚 Дополнительные ресурсы

- [React Testing Library docs](https://testing-library.com/docs/react-testing-library/intro)
- [Jest documentation](https://jestjs.io/docs/getting-started)
- [MSW documentation](https://mswjs.io/docs)
- [Testing best practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

## ✅ Checklist готовности

- [ ] Установлены все зависимости из package.json
- [ ] Раскомментированы импорты в setupTests.ts
- [ ] Настроен MSW server в mocks/server.ts
- [ ] Обновлены импорты в test-utils.tsx
- [ ] Создан первый тест для проверки работоспособности
- [ ] Настроены команды тестирования в CI/CD

После выполнения всех шагов система тестирования будет полностью готова к использованию! 🎉
