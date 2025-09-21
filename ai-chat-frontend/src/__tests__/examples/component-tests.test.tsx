/**
 * Example Tests
 * Демонстрация использования testing utilities для различных сценариев
 */

// import React from 'react';
// import { screen, fireEvent, waitFor } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';

// Локальные импорты для разработки (будут заменены на реальные)
import { customRender, resetStores } from '../utils/test-utils';
import {
  createUser,
  createCharacter,
  createMessage,
} from '../utils/test-factories';
import {
  expectLoadingState,
  expectFormState,
  expectToastState,
  expectModalState,
  expectCharacterCard,
  expectChatState,
} from '../utils/screen-assertions';
import {
  waitForLoadingToFinish,
  mockSuccessfulApiCall,
  simulateFormSubmission,
  waitForElement,
} from '../utils/async-test-utils';
import {
  mockSuccessfulLogin,
  mockCharactersScenario,
  mockChatScenario,
} from '../mocks/server';

// Mock screen для примеров
const mockScreen = {
  queryByText: jest.fn(),
  queryByTestId: jest.fn(),
  queryByRole: jest.fn(),
  getByText: jest.fn(),
  getByTestId: jest.fn(),
  getByRole: jest.fn(),
  findByText: jest.fn(),
  findByRole: jest.fn(),
  findByTestId: jest.fn(),
};

// ===========================================
// Component Testing Examples
// ===========================================

/**
 * Пример теста компонента Button
 */
describe('Button Component', () => {
  beforeEach(() => {
    resetStores();
  });

  it('should render button with correct text', () => {
    // const { getByRole } = customRender(
    //   <Button onClick={jest.fn()}>Click me</Button>
    // );

    // const button = getByRole('button', { name: /click me/i });
    // expect(button).toBeInTheDocument();

    console.log('Example: Button component test');
  });

  it('should handle click events', async () => {
    const handleClick = jest.fn();

    // const { getByRole } = customRender(
    //   <Button onClick={handleClick}>Click me</Button>
    // );

    // const button = getByRole('button');
    // await userEvent.click(button);

    // expect(handleClick).toHaveBeenCalledTimes(1);

    console.log('Example: Button click handling test');
  });

  it('should show loading state', async () => {
    // const { getByRole } = customRender(
    //   <Button loading={true}>Click me</Button>
    // );

    // expectLoadingState(screen).toBeVisible();

    console.log('Example: Button loading state test');
  });
});

// ===========================================
// Form Testing Examples
// ===========================================

/**
 * Пример теста формы входа
 */
describe('Login Form', () => {
  beforeEach(() => {
    resetStores();
    mockSuccessfulLogin();
  });

  it('should validate form inputs', async () => {
    // const { getByRole } = customRender(<LoginForm />);

    // expectFormState(screen).toBeInvalid();

    // // Заполняем форму
    // await simulateFormSubmission(screen, {
    //   email: 'test@example.com',
    //   password: 'password123'
    // });

    // expectFormState(screen).toBeValid();

    console.log('Example: Login form validation test');
  });

  it('should submit form successfully', async () => {
    // const { getByRole } = customRender(<LoginForm />);

    // await simulateFormSubmission(screen, {
    //   email: 'test@example.com',
    //   password: 'password123'
    // });

    // // Ожидаем успешного toast
    // await waitFor(() => {
    //   expectToastState(screen).toShowSuccess(/успешно/i);
    // });

    console.log('Example: Login form submission test');
  });

  it('should handle validation errors', async () => {
    // const { getByRole } = customRender(<LoginForm />);

    // await simulateFormSubmission(screen, {
    //   email: 'invalid-email',
    //   password: ''
    // });

    // expectFormState(screen).toShowError(/некорректный email/i);
    // expectFormState(screen).toShowError(/пароль обязателен/i);

    console.log('Example: Login form validation errors test');
  });
});

// ===========================================
// Modal Testing Examples
// ===========================================

/**
 * Пример теста модального окна
 */
describe('Modal Component', () => {
  it('should open and close modal', async () => {
    // const { getByRole } = customRender(<Modal />);

    // // Модал закрыт по умолчанию
    // expectModalState(screen).toBeClosed();

    // // Открываем модал
    // const openButton = getByRole('button', { name: /открыть/i });
    // await userEvent.click(openButton);

    // expectModalState(screen).toBeOpen();
    // expectModalState(screen).toHaveCloseButton();

    // // Закрываем модал
    // const closeButton = getByRole('button', { name: /закрыть/i });
    // await userEvent.click(closeButton);

    // expectModalState(screen).toBeClosed();

    console.log('Example: Modal open/close test');
  });

  it('should close modal on escape key', async () => {
    // const { getByRole } = customRender(<Modal isOpen={true} />);

    // expectModalState(screen).toBeOpen();

    // // Нажимаем Escape
    // await userEvent.keyboard('{Escape}');

    // expectModalState(screen).toBeClosed();

    console.log('Example: Modal escape key test');
  });
});

// ===========================================
// Data Fetching Testing Examples
// ===========================================

/**
 * Пример теста загрузки персонажей
 */
describe('Characters Gallery', () => {
  beforeEach(() => {
    resetStores();
  });

  it('should load and display characters', async () => {
    const mockCharacters = [
      createCharacter({ name: 'Alice', category: 'Дружелюбные' }),
      createCharacter({ name: 'Bob', category: 'Помощники' }),
    ];

    mockCharactersScenario(mockCharacters);

    // const { getByTestId } = customRender(<CharactersGallery />);

    // // Проверяем состояние загрузки
    // expectLoadingState(screen).toBeVisible();

    // // Ждем загрузки
    // await waitForLoadingToFinish(screen);

    // // Проверяем отображение персонажей
    // expectCharacterCard(screen).toDisplayCharacter('Alice');
    // expectCharacterCard(screen).toDisplayCharacter('Bob');

    console.log('Example: Characters loading test');
  });

  it('should handle loading error', async () => {
    // simulateNetworkError('/api/characters');

    // const { getByTestId } = customRender(<CharactersGallery />);

    // await waitFor(() => {
    //   expectToastState(screen).toShowError(/ошибка загрузки/i);
    // });

    console.log('Example: Characters loading error test');
  });

  it('should filter characters by category', async () => {
    const mockCharacters = [
      createCharacter({ name: 'Alice', category: 'Дружелюбные' }),
      createCharacter({ name: 'Bob', category: 'Помощники' }),
      createCharacter({ name: 'Charlie', category: 'Дружелюбные' }),
    ];

    mockCharactersScenario(mockCharacters);

    // const { getByRole } = customRender(<CharactersGallery />);

    // await waitForLoadingToFinish(screen);

    // // Фильтруем по категории
    // const categoryFilter = getByRole('combobox', { name: /категория/i });
    // await userEvent.selectOptions(categoryFilter, 'Дружелюбные');

    // // Проверяем результат фильтрации
    // expectCharacterCard(screen).toDisplayCharacter('Alice');
    // expectCharacterCard(screen).toDisplayCharacter('Charlie');
    // expect(screen.queryByText('Bob')).not.toBeInTheDocument();

    console.log('Example: Characters filtering test');
  });
});

// ===========================================
// Chat Testing Examples
// ===========================================

/**
 * Пример теста чата
 */
describe('Chat Component', () => {
  const mockConversationId = 'conv-123';

  beforeEach(() => {
    resetStores();
  });

  it('should load and display messages', async () => {
    const mockMessages = [
      {
        id: '1',
        conversationId: mockConversationId,
        senderId: 'user-123',
        content: 'Привет!',
        type: 'text' as const,
        timestamp: new Date().toISOString(),
      },
      {
        id: '2',
        conversationId: mockConversationId,
        senderId: 'char-456',
        content: 'Привет! Как дела?',
        type: 'text' as const,
        timestamp: new Date().toISOString(),
      },
    ];

    mockChatScenario(mockConversationId, mockMessages);

    // const { getByTestId } = customRender(
    //   <Chat conversationId={mockConversationId} />
    // );

    // expectLoadingState(screen).toBeVisible();
    // await waitForLoadingToFinish(screen);

    // expectChatState(screen).toShowMessages();
    // expect(screen.getByText('Привет!')).toBeInTheDocument();
    // expect(screen.getByText('Привет! Как дела?')).toBeInTheDocument();

    console.log('Example: Chat messages loading test');
  });

  it('should send new message', async () => {
    mockChatScenario(mockConversationId);

    // const { getByRole } = customRender(
    //   <Chat conversationId={mockConversationId} />
    // );

    // await waitForLoadingToFinish(screen);

    // expectChatState(screen).toHaveInput();

    // // Отправляем сообщение
    // const input = getByRole('textbox', { name: /сообщение/i });
    // await userEvent.type(input, 'Новое сообщение');

    // const sendButton = getByRole('button', { name: /отправить/i });
    // await userEvent.click(sendButton);

    // // Проверяем индикатор отправки
    // expectChatState(screen).toShowTypingIndicator();

    // // Ждем ответа
    // await waitFor(() => {
    //   expectChatState(screen).toHideTypingIndicator();
    // });

    console.log('Example: Chat send message test');
  });

  it('should handle typing indicator', async () => {
    mockChatScenario(mockConversationId);

    // const { getByRole } = customRender(
    //   <Chat conversationId={mockConversationId} />
    // );

    // await waitForLoadingToFinish(screen);

    // const input = getByRole('textbox', { name: /сообщение/i });

    // // Начинаем печатать
    // await userEvent.type(input, 'Печатаю...');

    // // Проверяем индикатор набора
    // expectChatState(screen).toShowTypingIndicator();

    // // Останавливаем печать
    // await userEvent.clear(input);

    // // Ждем исчезновения индикатора
    // await waitFor(() => {
    //   expectChatState(screen).toHideTypingIndicator();
    // });

    console.log('Example: Chat typing indicator test');
  });
});

// ===========================================
// Integration Testing Examples
// ===========================================

/**
 * Пример интеграционного теста: полный поток входа и использования
 */
describe('Full User Flow', () => {
  beforeEach(() => {
    resetStores();
    mockSuccessfulLogin();
  });

  it('should complete full login to chat flow', async () => {
    // 1. Вход в систему
    // const { getByRole } = customRender(<App />);

    // const loginButton = getByRole('button', { name: /войти/i });
    // await userEvent.click(loginButton);

    // expectModalState(screen).toBeOpen(/вход/i);

    // await simulateFormSubmission(screen, {
    //   email: 'test@example.com',
    //   password: 'password123'
    // });

    // await waitFor(() => {
    //   expectToastState(screen).toShowSuccess(/добро пожаловать/i);
    //   expectModalState(screen).toBeClosed();
    // });

    // 2. Переход к персонажам
    // const charactersLink = getByRole('link', { name: /персонажи/i });
    // await userEvent.click(charactersLink);

    // await waitForLoadingToFinish(screen);
    // expectCharacterCard(screen).toDisplayCharacter('Alice');

    // 3. Начало чата
    // const chatButton = getByRole('button', { name: /начать чат/i });
    // await userEvent.click(chatButton);

    // await waitForLoadingToFinish(screen);
    // expectChatState(screen).toHaveInput();

    console.log('Example: Full user flow integration test');
  });
});

// ===========================================
// Performance Testing Examples
// ===========================================

/**
 * Пример теста производительности
 */
describe('Performance Tests', () => {
  it('should render large character list efficiently', async () => {
    const manyCharacters = Array.from({ length: 100 }, (_, i) =>
      createCharacter({ name: `Character ${i}` })
    );

    mockCharactersScenario(manyCharacters);

    const startTime = performance.now();

    // const { getByTestId } = customRender(<CharactersGallery />);
    // await waitForLoadingToFinish(screen);

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    // Проверяем, что рендер занял меньше 2 секунд
    expect(renderTime).toBeLessThan(2000);

    console.log(`Example: Performance test - render time: ${renderTime}ms`);
  });

  it('should handle rapid user interactions', async () => {
    // const { getByRole } = customRender(<CharacterFilter />);

    // const filter = getByRole('combobox');

    // // Быстро меняем фильтр несколько раз
    // for (let i = 0; i < 10; i++) {
    //   await userEvent.selectOptions(filter, `category-${i % 3}`);
    // }

    // // Проверяем, что компонент не сломался
    // expect(filter).toBeInTheDocument();

    console.log('Example: Rapid interaction performance test');
  });
});

// ===========================================
// Accessibility Testing Examples
// ===========================================

/**
 * Пример теста доступности
 */
describe('Accessibility Tests', () => {
  it('should have proper keyboard navigation', async () => {
    // const { getByRole } = customRender(<CharactersGallery />);

    // await waitForLoadingToFinish(screen);

    // // Проверяем навигацию по Tab
    // await userEvent.tab();
    // expect(document.activeElement).toHaveAttribute('role', 'button');

    // await userEvent.tab();
    // expect(document.activeElement).toHaveAttribute('role', 'link');

    console.log('Example: Keyboard navigation accessibility test');
  });

  it('should have proper ARIA attributes', () => {
    // const { getByRole } = customRender(<Modal isOpen={true} />);

    // const modal = getByRole('dialog');
    // expect(modal).toHaveAttribute('aria-modal', 'true');
    // expect(modal).toHaveAttribute('aria-labelledby');

    console.log('Example: ARIA attributes accessibility test');
  });

  it('should support screen readers', () => {
    // const { getByRole } = customRender(<CharacterCard character={createCharacter()} />);

    // const card = getByRole('button');
    // expect(card).toHaveAttribute('aria-label');
    // expect(card).toHaveAttribute('aria-describedby');

    console.log('Example: Screen reader support test');
  });
});

// ===========================================
// Error Boundary Testing Examples
// ===========================================

/**
 * Пример теста Error Boundary
 */
describe('Error Boundary Tests', () => {
  it('should catch and display errors gracefully', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    // const { getByText } = customRender(
    //   <ErrorBoundary>
    //     <ThrowError />
    //   </ErrorBoundary>
    // );

    // expect(getByText(/что-то пошло не так/i)).toBeInTheDocument();

    console.log('Example: Error boundary test');
  });
});

export { mockScreen };
