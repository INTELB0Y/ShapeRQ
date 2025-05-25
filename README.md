
# ShapeRQ

> 🌐 Multi-language: [English](#english) | [Русский](#русский)

---

## English

**ShapeRQ** is a **Promise-based HTTP client** for the browser, built on top of the native `Fetch API`.  
Its goal is to **save your time** by offering a clean and flexible API for making HTTP requests.

### Features & Benefits 🚀

#### ✅ Easy to Use
- Clean, concise syntax
- Automatic `JSON` handling
- Full `Promise` support

#### ✅ Flexible API Handling
- Seamless work with multiple APIs
- Easy switching between APIs
- Supports all standard `HTTP` methods

#### ✅ Debug-Friendly
- Automatic request/response logging
- Styled and readable error messages
- Localization support for English and Russian

#### ✅ Secure and Controlled
- `AbortController` support to cancel requests
- Built-in **XSRF protection**
- Fully customizable requests

### Installation 💾

```bash
npm install shape-rq
````

### Documentation 🔗

* [Configuration](/docs/en/Configuration.md)
* [Requests](/docs/en/Requests.md)
* [Debugging](/docs/en/Debugging.md)

### Basic Usage 🛠️

#### Setup

```ts
import { setConfig } from "shape-rq";

setConfig({
    APIs: {
        "MyAPI": "example.com/api/"
    },
    debug: true,
    lang: "en"
});
```

#### GET Request

```ts
import { get } from "shape-rq";

get("MyAPI", "users/")
    .then(data => {
        console.log(data);
    });
```

#### POST Request

```ts
import { post } from "shape-rq";

post("MyAPI", "/auth/users/", {
    username: "JohnDoe",
    password: "12345678"
}).then(data => {
    console.log(data);
});
```

#### HEAD & OPTIONS

```ts
import { head } from "shape-rq";

head("MyAPI", "users/");
```

---

## Русский

**ShapeRQ** — это **HTTP-клиент** на основе `Promise` для браузера, построенный на `Fetch API`.
Цель — **сэкономить время**, предоставляя удобный и гибкий способ работы с HTTP-запросами.

### Особенности и преимущества 🚀

#### ✅ Простота использования

* Лаконичный синтаксис
* Автоматическая обработка `JSON`
* Поддержка `Promise`

#### ✅ Гибкость работы с API

* Работа с множеством API через `APIs`
* Лёгкое переключение между API
* Поддержка всех HTTP-методов

#### ✅ Отладка и ошибки

* Автоматическое логирование запросов и ответов
* Стилизация ошибок с подсказками
* Локализация: русский и английский

#### ✅ Безопасность и контроль

* Поддержка `AbortController`
* Встроенная XSRF-защита
* Гибкая кастомизация запросов

### Установка 💾

```bash
npm install shape-rq
```

### Документация 🔗

* [Конфигурация](/docs/ru/Конфигурация.md)
* [Запросы](/docs/ru/Запросы.md)
* [Дебаггинг](/docs/ru/Дебаггинг.md)

### Базовое использование 🛠️

#### Настройка

```ts
import { setConfig } from "shape-rq";

setConfig({
    APIs: {
        "MyAPI": "example.com/api/"
    },
    debug: true,
    lang: "ru"
});
```

#### GET-запрос

```ts
import { get } from "shape-rq";

get("MyAPI", "users/")
    .then(data => {
        console.log(data);
    });
```

#### POST-запрос

```ts
import { post } from "shape-rq";

post("MyAPI", "/auth/users/", {
    username: "JohnDoe",
    password: "12345678"
}).then(data => {
    console.log(data);
});
```

#### HEAD и OPTIONS

```ts
import { head } from "shape-rq";

head("MyAPI", "users/");
```

---

**Version** – `Release 1.0.0`