# 🐳 Docker Setup для AI Chat Frontend

## 🚀 Быстрый запуск
### 📁 Docker Compose варианты:

**🚀 docker-compose.simple.yml** (рекомендуется):
- ✅ Самая быстрая сборка
- ✅ Минимальная конфигурация
- ✅ Healthcheck оптимизирован
- 🎯 Подходит для: быстрое тестирование, демо

**🔧 docker-compose.dev.yml** (для разработки):
- ✅ Volume mapping `./dist:/usr/share/nginx/html`
- ✅ Hot reload без пересборки контейнера
- ✅ Быстрое обновление изменений
- 🎯 Подходит для: активная разработка

**📦 docker-compose.minimal.yml** (самый простой):
- ✅ Кэширование слоев сборки
- ✅ Labels для идентификации
- ✅ Комментарии для volume mapping
- 🎯 Подходит для: минимальные требования

**🏗️ docker-compose.yml** (production-ready):
- ✅ Полный стек с nginx proxy
- ✅ Redis для кэширования
- ✅ Сети и volumes
- ✅ SSL готовность
- 🎯 Подходит для: production deploymentстой запуск (рекомендуется):
```bash
# Быстрая сборка и запуск
docker-compose -f docker-compose.simple.yml up --build

# В фоновом режиме
docker-compose -f docker-compose.simple.yml up -d --build
```

### 🔧 Development с hot reload:
```bash
# Сборка frontend локально
cd ai-chat-frontend && npm run build

# Запуск с volume mapping для быстрого обновления
docker-compose -f docker-compose.dev.yml up --build

# Обновить содержимое без перезапуска контейнера
npm run build  # изменения автоматически отобразятся
```

### 📦 Минималистичная версия:
```bash
# Самая простая конфигурация
docker-compose -f docker-compose.minimal.yml up --build
```

### 🏗️ Полный стек (production-ready):
```bash
# Запуск всех сервисов (фронтенд + nginx + redis)
docker-compose up --build

# В фоновом режиме
docker-compose up -d --build

# Остановка всех сервисов
docker-compose down -v
```

## 📦 Ручная сборка Docker образа

```bash
# Переход в директорию фронтенда
cd ai-chat-frontend

# Сборка образа
docker build -t ai-chat-frontend .

# Запуск контейнера
docker run -p 3000:80 ai-chat-frontend

# Запуск с переменными окружения
docker run -p 3000:80 -e NODE_ENV=production ai-chat-frontend
```

## 🔧 Конфигурация

### Структура файлов:
```
├── ai-chat-frontend/
│   ├── Dockerfile          # Production сборка
│   ├── .dockerignore       # Исключения для сборки
│   ├── nginx.conf          # Полная nginx конфигурация (с API proxy)
│   └── nginx-simple.conf   # Упрощенная конфигурация (по умолчанию)
├── docker-compose.yml      # Полная конфигурация
├── docker-compose.simple.yml # Упрощенная версия
└── DOCKER.md              # Эта документация
```

### 📋 Nginx конфигурации:

**🎯 nginx-simple.conf** (используется по умолчанию):
- ✅ Оптимизирована для простоты и скорости
- ✅ Поддержка Vite `/assets/` директории
- ✅ Улучшенные security заголовки
- ✅ Правильное кэширование для SPA
- ✅ Gzip компрессия
- 📦 Размер: ~50 строк

**🔧 nginx.conf** (расширенная):
- ✅ Все функции простой версии +
- ✅ API проксирование (готово к backend)
- ✅ WebSocket поддержка
- ✅ Расширенная безопасность (HSTS)
- ✅ Подробное логирование
- 📦 Размер: ~100+ строк

### 🔄 Смена конфигурации:
```dockerfile
# В Dockerfile замените строку:
COPY nginx-simple.conf /etc/nginx/conf.d/default.conf
# на:
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

### Порты:
- **3000** - Frontend приложение
- **80** - Nginx proxy (в полной конфигурации)
- **6379** - Redis (для будущих фич)

### Переменные окружения:
```bash
NODE_ENV=production    # Режим production
```

## 🛠 Разработка

### Локальная разработка с Docker:
```bash
# Быстрый rebuild при изменениях
docker-compose up --build frontend

# Логи в реальном времени
docker-compose logs -f frontend

# Вход в контейнер для отладки
docker-compose exec frontend sh
```

### Оптимизация размера образа:
- ✅ Multi-stage сборка (node:18-alpine → nginx:alpine)
- ✅ .dockerignore исключает ненужные файлы
- ✅ Только production зависимости
- ✅ Gzip сжатие в nginx
- ✅ Кэширование статических ресурсов

## 🔒 Безопасность

- ✅ Непривилегированный пользователь (nodejs:1001)
- ✅ Security заголовки в nginx
- ✅ Healthcheck для мониторинга
- ✅ Ограничение размера запросов (10MB)

## 📊 Мониторинг

### Healthcheck:
```bash
# Проверка статуса контейнеров
docker-compose ps

# Логи healthcheck
docker inspect --format='{{json .State.Health}}' <container_id>
```

### Производительность:
- **Размер образа**: ~25MB (nginx:alpine)
- **Время сборки**: ~2-3 минуты
- **Холодный старт**: ~5 секунд

## 🚀 Production Deploy

### Готовность к продакшену:
- ✅ Nginx оптимизирован для SPA
- ✅ Gzip компрессия
- ✅ Кэширование статики
- ✅ Security заголовки
- ✅ Healthcheck
- ✅ Graceful shutdown

### Рекомендации для продакшена:
1. Используйте внешний Load Balancer
2. Настройте SSL/TLS сертификаты
3. Добавьте мониторинг (Prometheus/Grafana)
4. Используйте централизованные логи
5. Настройте автомасштабирование

---

**Статус**: ✅ Готово к производству
**Размер образа**: ~25MB  
**Время сборки**: ~2-3 мин