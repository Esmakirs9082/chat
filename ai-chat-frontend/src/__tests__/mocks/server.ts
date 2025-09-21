/**
 * Mock Service Worker Configuration
 * Настройка MSW для мокирования API запросов в тестах
 */

// Когда будут установлены зависимости, раскомментировать:
// import { setupServer } from 'msw/node';
// import { rest } from 'msw';

// Типы для моков
interface MockUser {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  subscription: {
    plan: 'free' | 'premium' | 'pro';
    status: 'active' | 'inactive' | 'cancelled';
    expiresAt?: string;
  };
  createdAt: string;
  isNSFWEnabled: boolean;
}

interface MockCharacter {
  id: string;
  name: string;
  description: string;
  avatar: string;
  category: string;
  tags: string[];
  personality: string[];
  isNSFW: boolean;
  createdBy: string;
  stats: {
    likes: number;
    chats: number;
    rating: number;
  };
  createdAt: string;
}

interface MockMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'system';
  timestamp: string;
  isEdited?: boolean;
}

interface MockConversation {
  id: string;
  userId: string;
  characterId: string;
  title: string;
  lastMessage?: string;
  lastMessageAt: string;
  createdAt: string;
  messageCount: number;
}

// ===========================================
// Mock Data Generators
// ===========================================

const generateMockUser = (overrides: Partial<MockUser> = {}): MockUser => ({
  id: `user-${Math.random().toString(36).substr(2, 9)}`,
  email: 'test@example.com',
  username: 'testuser',
  avatar: '/avatars/default.jpg',
  subscription: {
    plan: 'free',
    status: 'active',
  },
  createdAt: new Date().toISOString(),
  isNSFWEnabled: false,
  ...overrides,
});

const generateMockCharacter = (
  overrides: Partial<MockCharacter> = {}
): MockCharacter => ({
  id: `char-${Math.random().toString(36).substr(2, 9)}`,
  name: 'Test Character',
  description: 'A friendly test character',
  avatar: '/characters/default.jpg',
  category: 'Дружелюбные',
  tags: ['дружелюбный', 'помощник'],
  personality: ['добрый', 'умный', 'веселый'],
  isNSFW: false,
  createdBy: 'system',
  stats: {
    likes: 150,
    chats: 89,
    rating: 4.8,
  },
  createdAt: new Date().toISOString(),
  ...overrides,
});

const generateMockMessage = (
  overrides: Partial<MockMessage> = {}
): MockMessage => ({
  id: `msg-${Math.random().toString(36).substr(2, 9)}`,
  conversationId: 'conv-test',
  senderId: 'user-test',
  content: 'Test message content',
  type: 'text',
  timestamp: new Date().toISOString(),
  ...overrides,
});

const generateMockConversation = (
  overrides: Partial<MockConversation> = {}
): MockConversation => ({
  id: `conv-${Math.random().toString(36).substr(2, 9)}`,
  userId: 'user-test',
  characterId: 'char-test',
  title: 'Test Conversation',
  lastMessage: 'Last test message',
  lastMessageAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  messageCount: 5,
  ...overrides,
});

// ===========================================
// API Response Helpers
// ===========================================

const createApiResponse = <T>(data: T, success: boolean = true) => ({
  success,
  data,
  timestamp: new Date().toISOString(),
});

const createPaginatedResponse = <T>(
  items: T[],
  page: number = 1,
  limit: number = 20
) => ({
  success: true,
  data: {
    items: items.slice((page - 1) * limit, page * limit),
    pagination: {
      page,
      limit,
      total: items.length,
      totalPages: Math.ceil(items.length / limit),
      hasNext: page * limit < items.length,
      hasPrev: page > 1,
    },
  },
  timestamp: new Date().toISOString(),
});

const createErrorResponse = (message: string, code: number = 400) => ({
  success: false,
  error: {
    message,
    code,
  },
  timestamp: new Date().toISOString(),
});

// ===========================================
// Mock Handlers (заготовки для MSW)
// ===========================================

// Заготовки обработчиков - будут активированы после установки MSW
const mockHandlers = [
  // Auth handlers
  {
    method: 'POST',
    path: '/api/auth/login',
    handler: (req: any, res: any, ctx: any) => {
      return res(
        ctx.status(200),
        ctx.json(
          createApiResponse({
            user: generateMockUser(),
            token: 'mock-jwt-token',
          })
        )
      );
    },
  },

  {
    method: 'POST',
    path: '/api/auth/register',
    handler: (req: any, res: any, ctx: any) => {
      return res(
        ctx.status(201),
        ctx.json(
          createApiResponse({
            user: generateMockUser(),
            token: 'mock-jwt-token',
          })
        )
      );
    },
  },

  {
    method: 'POST',
    path: '/api/auth/logout',
    handler: (req: any, res: any, ctx: any) => {
      return res(
        ctx.status(200),
        ctx.json(createApiResponse({ message: 'Logged out successfully' }))
      );
    },
  },

  // User handlers
  {
    method: 'GET',
    path: '/api/user/profile',
    handler: (req: any, res: any, ctx: any) => {
      return res(
        ctx.status(200),
        ctx.json(createApiResponse(generateMockUser()))
      );
    },
  },

  {
    method: 'PUT',
    path: '/api/user/profile',
    handler: (req: any, res: any, ctx: any) => {
      return res(
        ctx.status(200),
        ctx.json(createApiResponse(generateMockUser()))
      );
    },
  },

  // Characters handlers
  {
    method: 'GET',
    path: '/api/characters',
    handler: (req: any, res: any, ctx: any) => {
      const characters = Array.from({ length: 50 }, () =>
        generateMockCharacter()
      );
      return res(
        ctx.status(200),
        ctx.json(createPaginatedResponse(characters))
      );
    },
  },

  {
    method: 'GET',
    path: '/api/characters/:id',
    handler: (req: any, res: any, ctx: any) => {
      const { id } = req.params;
      return res(
        ctx.status(200),
        ctx.json(createApiResponse(generateMockCharacter({ id })))
      );
    },
  },

  {
    method: 'POST',
    path: '/api/characters',
    handler: (req: any, res: any, ctx: any) => {
      return res(
        ctx.status(201),
        ctx.json(createApiResponse(generateMockCharacter()))
      );
    },
  },

  // Conversations handlers
  {
    method: 'GET',
    path: '/api/conversations',
    handler: (req: any, res: any, ctx: any) => {
      const conversations = Array.from({ length: 20 }, () =>
        generateMockConversation()
      );
      return res(
        ctx.status(200),
        ctx.json(createPaginatedResponse(conversations))
      );
    },
  },

  {
    method: 'POST',
    path: '/api/conversations',
    handler: (req: any, res: any, ctx: any) => {
      return res(
        ctx.status(201),
        ctx.json(createApiResponse(generateMockConversation()))
      );
    },
  },

  {
    method: 'GET',
    path: '/api/conversations/:id/messages',
    handler: (req: any, res: any, ctx: any) => {
      const { id } = req.params;
      const messages = Array.from({ length: 15 }, () =>
        generateMockMessage({ conversationId: id })
      );
      return res(ctx.status(200), ctx.json(createPaginatedResponse(messages)));
    },
  },

  {
    method: 'POST',
    path: '/api/conversations/:id/messages',
    handler: (req: any, res: any, ctx: any) => {
      const { id } = req.params;
      return res(
        ctx.status(201),
        ctx.json(createApiResponse(generateMockMessage({ conversationId: id })))
      );
    },
  },

  // Subscription handlers
  {
    method: 'GET',
    path: '/api/subscription/plans',
    handler: (req: any, res: any, ctx: any) => {
      return res(
        ctx.status(200),
        ctx.json(
          createApiResponse([
            {
              id: 'free',
              name: 'Бесплатный',
              price: 0,
              features: ['Базовый чат', '3 персонажа'],
            },
            {
              id: 'premium',
              name: 'Премиум',
              price: 9.99,
              features: ['Неограниченный чат', 'Все персонажи', 'NSFW контент'],
            },
            {
              id: 'pro',
              name: 'Профессионал',
              price: 19.99,
              features: [
                'Всё из Премиум',
                'Создание персонажей',
                'Приоритетная поддержка',
              ],
            },
          ])
        )
      );
    },
  },

  // Error scenarios
  {
    method: 'GET',
    path: '/api/error/500',
    handler: (req: any, res: any, ctx: any) => {
      return res(
        ctx.status(500),
        ctx.json(createErrorResponse('Internal Server Error', 500))
      );
    },
  },

  {
    method: 'GET',
    path: '/api/error/timeout',
    handler: (req: any, res: any, ctx: any) => {
      return res(
        ctx.delay(10000), // 10 секунд задержки для тестирования таймаутов
        ctx.status(200),
        ctx.json(createApiResponse({ message: 'Delayed response' }))
      );
    },
  },
];

// ===========================================
// Server Setup
// ===========================================

// Заглушка для server - будет заменена на настоящий MSW server
const mockServer = {
  listen: () => console.log('Mock server listening (placeholder)'),
  close: () => console.log('Mock server closed (placeholder)'),
  resetHandlers: () => console.log('Mock server handlers reset (placeholder)'),
  use: (...handlers: any[]) =>
    console.log('Mock server using handlers (placeholder)', handlers),
};

// Когда будут установлены MSW зависимости, заменить на:
// export const server = setupServer(...mockHandlers.map(h =>
//   rest[h.method.toLowerCase()](h.path, h.handler)
// ));

export const server = mockServer;

// ===========================================
// Test Utilities
// ===========================================

/**
 * Настройка сервера для тестов
 */
export const setupMswServer = () => {
  // beforeAll(() => server.listen());
  // afterEach(() => server.resetHandlers());
  // afterAll(() => server.close());

  console.log('MSW server setup (placeholder)');
};

/**
 * Создание кастомного обработчика для тестов
 */
export const createMockHandler = (
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  response: any,
  status: number = 200,
  delay: number = 0
) => {
  return {
    method,
    path,
    response,
    status,
    delay,
    // В реальном MSW будет:
    // handler: rest[method.toLowerCase()](path, (req, res, ctx) => {
    //   return res(
    //     ctx.delay(delay),
    //     ctx.status(status),
    //     ctx.json(response)
    //   );
    // })
  };
};

/**
 * Временное переопределение обработчика
 */
export const overrideHandler = (handler: any) => {
  server.use(handler);
};

/**
 * Симуляция ошибки сети
 */
export const simulateNetworkError = (path: string) => {
  const errorHandler = createMockHandler(
    'GET',
    path,
    createErrorResponse('Network Error', 500),
    500
  );

  overrideHandler(errorHandler);
};

/**
 * Симуляция медленного ответа
 */
export const simulateSlowResponse = (path: string, delay: number = 3000) => {
  const slowHandler = createMockHandler(
    'GET',
    path,
    createApiResponse({ message: 'Slow response' }),
    200,
    delay
  );

  overrideHandler(slowHandler);
};

// ===========================================
// Scenario Helpers
// ===========================================

/**
 * Настройка сценария успешного входа
 */
export const mockSuccessfulLogin = () => {
  const loginHandler = createMockHandler(
    'POST',
    '/api/auth/login',
    createApiResponse({
      user: generateMockUser({
        email: 'test@example.com',
        username: 'testuser',
      }),
      token: 'mock-jwt-token',
    })
  );

  overrideHandler(loginHandler);
};

/**
 * Настройка сценария неудачного входа
 */
export const mockFailedLogin = (
  errorMessage: string = 'Invalid credentials'
) => {
  const loginHandler = createMockHandler(
    'POST',
    '/api/auth/login',
    createErrorResponse(errorMessage, 401),
    401
  );

  overrideHandler(loginHandler);
};

/**
 * Настройка сценария с персонажами
 */
export const mockCharactersScenario = (
  characters: Partial<MockCharacter>[] = []
) => {
  const mockCharacters = characters.length
    ? characters.map((c) => generateMockCharacter(c))
    : Array.from({ length: 10 }, () => generateMockCharacter());

  const charactersHandler = createMockHandler(
    'GET',
    '/api/characters',
    createPaginatedResponse(mockCharacters)
  );

  overrideHandler(charactersHandler);
};

/**
 * Настройка сценария чата
 */
export const mockChatScenario = (
  conversationId: string,
  messages: Partial<MockMessage>[] = []
) => {
  const mockMessages = messages.length
    ? messages.map((m) => generateMockMessage({ ...m, conversationId }))
    : Array.from({ length: 5 }, () => generateMockMessage({ conversationId }));

  const messagesHandler = createMockHandler(
    'GET',
    `/api/conversations/${conversationId}/messages`,
    createPaginatedResponse(mockMessages)
  );

  overrideHandler(messagesHandler);

  // Обработчик для отправки сообщений
  const sendMessageHandler = createMockHandler(
    'POST',
    `/api/conversations/${conversationId}/messages`,
    createApiResponse(generateMockMessage({ conversationId }))
  );

  overrideHandler(sendMessageHandler);
};

// ===========================================
// Export All
// ===========================================

export {
  generateMockUser,
  generateMockCharacter,
  generateMockMessage,
  generateMockConversation,
  createApiResponse,
  createPaginatedResponse,
  createErrorResponse,
  mockHandlers,
};

// Type exports
export type { MockUser, MockCharacter, MockMessage, MockConversation };
