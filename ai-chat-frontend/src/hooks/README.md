# useChat Hook Documentation

Хук `useChat` предоставляет полную функциональность для WebSocket чат-соединения с автоматическим переподключением, управлением состояниями печати и интеграцией с chatStore.

## Особенности

- ✅ **WebSocket соединение** с автоматическим подключением
- ✅ **Автоматическое переподключение** при разрыве соединения
- ✅ **Отправка/получение сообщений** в реальном времени
- ✅ **Typing indicators** (отправка и получение)
- ✅ **Connection status** управление
- ✅ **Управление пользователями** (online/offline)
- ✅ **Error handling** с детальной информацией
- ✅ **Cleanup** при размонтировании компонента
- ✅ **Интеграция с chatStore** для автоматического обновления

## Использование

```tsx
import { useChat } from '../hooks/useChat';

const ChatComponent = () => {
  const {
    // Messages
    messages,
    sendMessage,

    // Connection
    isConnected,
    connectionStatus,
    reconnect,
    disconnect,

    // Typing
    isTyping,
    isOtherTyping,
    startTyping,
    stopTyping,

    // Users & Error handling
    onlineUsers,
    lastError,
    clearError,
  } = useChat({
    chatId: 'chat-123',
    characterId: 'character-456',
    autoReconnect: true,
    reconnectInterval: 3000,
    maxReconnectAttempts: 5,
    typingTimeout: 3000,
  });

  // Отправка сообщения
  const handleSendMessage = () => {
    sendMessage('Hello, World!');
  };

  // Обработка печати
  const handleInputChange = (value: string) => {
    if (value.length > 0) {
      startTyping();
    } else {
      stopTyping();
    }
  };

  return (
    <div>
      {/* Connection status */}
      <div className={isConnected ? 'text-green-500' : 'text-red-500'}>
        Status: {connectionStatus}
      </div>

      {/* Messages */}
      {messages.map((message) => (
        <div key={message.id}>
          <strong>{message.sender}:</strong> {message.content}
        </div>
      ))}

      {/* Typing indicator */}
      {isOtherTyping && <div>Someone is typing...</div>}

      {/* Error handling */}
      {lastError && (
        <div className="error">
          {lastError}
          <button onClick={clearError}>×</button>
        </div>
      )}

      {/* Controls */}
      <button onClick={handleSendMessage} disabled={!isConnected}>
        Send Message
      </button>
      <button onClick={reconnect}>Reconnect</button>
    </div>
  );
};
```

## API Reference

### Options (UseChatOptions)

| Параметр               | Тип       | По умолчанию | Описание                              |
| ---------------------- | --------- | ------------ | ------------------------------------- |
| `chatId`               | `string`  | undefined    | ID чата для подключения               |
| `characterId`          | `string`  | undefined    | ID персонажа (опционально)            |
| `autoReconnect`        | `boolean` | `true`       | Автоматическое переподключение        |
| `reconnectInterval`    | `number`  | `3000`       | Интервал переподключения (мс)         |
| `maxReconnectAttempts` | `number`  | `5`          | Максимум попыток переподключения      |
| `typingTimeout`        | `number`  | `3000`       | Timeout для автоостановки печати (мс) |

### Return Value (UseChatReturn)

#### Messages

- `messages: Message[]` - Массив сообщений из store
- `sendMessage: (content: string) => void` - Отправка сообщения

#### Connection

- `isConnected: boolean` - Статус подключения
- `connectionStatus: ConnectionStatus` - Детальный статус ('connected' | 'connecting' | 'disconnected' | 'reconnecting')
- `reconnect: () => void` - Ручное переподключение
- `disconnect: () => void` - Отключение

#### Typing

- `isTyping: boolean` - Печатает ли текущий пользователь
- `isOtherTyping: boolean` - Печатает ли другой пользователь
- `startTyping: () => void` - Начать печать
- `stopTyping: () => void` - Остановить печать

#### Users & Errors

- `onlineUsers: string[]` - Список ID онлайн пользователей
- `lastError: string | null` - Последняя ошибка
- `clearError: () => void` - Очистить ошибку

## WebSocket Events

### Отправляемые события

| Событие        | Описание             | Payload                                                                |
| -------------- | -------------------- | ---------------------------------------------------------------------- |
| `join_chat`    | Присоединение к чату | `{ type, chatId, userId, timestamp }`                                  |
| `leave_chat`   | Покидание чата       | `{ type, chatId, userId, timestamp }`                                  |
| `message`      | Новое сообщение      | `{ type, data: { content, sender, type }, chatId, userId, timestamp }` |
| `typing_start` | Начало печати        | `{ type, chatId, userId, timestamp }`                                  |
| `typing_stop`  | Остановка печати     | `{ type, chatId, userId, timestamp }`                                  |

### Получаемые события

| Событие        | Описание                   | Обработка                 |
| -------------- | -------------------------- | ------------------------- |
| `message`      | Новое сообщение            | Добавляется в chatStore   |
| `typing_start` | Кто-то начал печать        | Обновляет isOtherTyping   |
| `typing_stop`  | Кто-то остановил печать    | Обновляет isOtherTyping   |
| `user_joined`  | Пользователь присоединился | Добавляется в onlineUsers |
| `user_left`    | Пользователь покинул чат   | Удаляется из onlineUsers  |
| `error`        | Ошибка сервера             | Устанавливает lastError   |

## Environment Variables

```env
REACT_APP_WS_URL=ws://localhost:3001
```

## Error Handling

Хук автоматически обрабатывает различные типы ошибок:

- **Connection errors** - ошибки подключения к WebSocket
- **Parse errors** - ошибки парсинга сообщений
- **Send errors** - ошибки отправки сообщений
- **Server errors** - ошибки от сервера

Все ошибки доступны через `lastError` и могут быть очищены через `clearError()`.

## Автоматические функции

### Переподключение

- Автоматически пытается переподключиться при разрыве соединения
- Использует экспоненциальную задержку
- Ограничивает количество попыток

### Cleanup

- Автоматически закрывает соединение при размонтировании
- Очищает все таймеры
- Отправляет событие покидания чата

### Typing Management

- Автоматически останавливает печать через заданный timeout
- Предотвращает дублирование событий печати
- Синхронизируется с chatStore

## Интеграция с Store

Хук автоматически интегрируется с:

- **`useAuthStore`** - получает user и token для авторизации
- **`useChatStore`** - обновляет messages и typing состояния
- Все изменения автоматически отражаются в UI через store
