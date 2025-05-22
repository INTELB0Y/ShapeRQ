ShapeRQ
---
**ShapeRQ** это **HTTP-Клиент**, основанный на работе **Promise** для браузера. 
Основой ShapeRQ является `fetch`, идеей - создание HTTP-Клиента который сэкономит время.
## Особенности
* Поддержка `Promise`
* Автоматическая обработка `JSON`
* Поддержка `AbortController`
* Встроенный дебаг и обработка ошибок
* Локализация на русский и английский языки
* Встроенная `XSRF` защита
* Преобразование входных и выходных данных

## Установка
```bash
npm install shape-rq
```
## Базовое использование

##### Настройка
```typescript
import { setConfig } from "shape-rq";
```
```typescript
setConfig({
    APIs: {
        "MyAPI": "example.com/api/"
    },
    debug: true,
    lang: "ru"
})
```
##### Запрос
```typescript
import { get } from "shape-rq"

// GET запрос, в качестве параметров запроса указывается 
// ключ вашего API и эндпоинт куда отправляется запрос.
get("MyAPI", "users/") // Запрос на example.com/api/users/
    .then(data => {
        // Какая-то ваша логика.
        // Если происходит ошибка запроса то как data 
        // возвращается null.
        console.log(data)
    })
// Аналагично работают DELETE, HEAD и OPTIONS запросы.
```
##### Запрос POST
```typescript
import { post } from "shape-rq"

// Данные из тела запроса преобразуются автоматически
post(
    "MyAPI", 
    "/auth/users/",
    {
        username: "JohnDoe",
        password: "12345678"
    }
).then(
    data => {
        // Ваша логика
        console.log(data)
    }
)
// Логика аналагична GET запросу.
```
##### OPTIONS и HEAD
```typescript
import { head } from 'shape-rq'

// Отправляем запрос
head("MyAPI", "users/") 
// HEAD и OPTIONS не возвращают никаких данных, но 
// если у вас включён debug то вы увидете 
// Ответ сервера, и информацию.

```

<small>Версия - `DEV 0.7.0`</small>
