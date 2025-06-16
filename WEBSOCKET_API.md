# WebSocket API для чатов

## Подключение

Для подключения к WebSocket серверу используйте:

```javascript
const socket = io('ws://localhost:4201', {
  auth: {
    token: 'your_jwt_token_here' // Bearer токен из авторизации
  }
});
```

Или через headers:

```javascript
const socket = io('ws://localhost:4201', {
  extraHeaders: {
    Authorization: 'Bearer your_jwt_token_here'
  }
});
```

## События

### Отправка сообщения
```javascript
socket.emit('send_message', {
  chatId: 'chat_id_here',
  text: 'Текст сообщения'
});
```

**Ответ:**
```javascript
{
  success: true,
  message: {
    id: 'message_id',
    text: 'Текст сообщения',
    sender: 'user_id',
    chatId: 'chat_id',
    createdAt: '2024-01-01T00:00:00.000Z',
    user: {
      id: 'user_id',
      email: 'user@example.com',
      username: 'username'
    }
  }
}
```

### Присоединение к чату
```javascript
socket.emit('join_chat', {
  chatId: 'chat_id_here'
});
```

**Ответ:**
```javascript
{
  success: true,
  messages: [
    // Массив сообщений чата
  ]
}
```

### Покидание чата
```javascript
socket.emit('leave_chat', {
  chatId: 'chat_id_here'
});
```

**Ответ:**
```javascript
{
  success: true
}
```

### Получение сообщений чата
```javascript
socket.emit('get_chat_messages', {
  chatId: 'chat_id_here'
});
```

**Ответ:**
```javascript
{
  success: true,
  messages: [
    // Массив сообщений чата
  ]
}
```

### Получение своих чатов
```javascript
socket.emit('get_my_chats');
```

**Ответ:**
```javascript
{
  success: true,
  chats: [
    {
      id: 'chat_id',
      users: [
        {
          id: 'user_id',
          email: 'user@example.com',
          username: 'username'
        }
      ],
      messages: [
        // Последнее сообщение в чате
      ]
    }
  ]
}
```

## Слушатели событий

### Новое сообщение
```javascript
socket.on('new_message', (message) => {
  console.log('Новое сообщение:', message);
});
```

## Безопасность

- Все методы требуют авторизации через JWT токен
- Пользователи могут отправлять сообщения только в свои чаты
- Доступ к чату проверяется перед каждой операцией
- При попытке доступа к чужому чату возвращается ошибка

## Обработка ошибок

Все методы возвращают объект с полем `success`:
- `success: true` - операция выполнена успешно
- `success: false` - произошла ошибка, поле `error` содержит описание

Пример ошибки:
```javascript
{
  success: false,
  error: 'У вас нет доступа к этому чату'
}
``` 