### Структура проекта

```
shape-rq/
├── src/
│   ├── core/
│   │   └── config.ts          // глобальный конфиг
│   ├── http/
│   │   ├── request.ts         // базовые методы get/post/put/delete
│   │   └── types.ts           // типы запросов и конфигов
│   ├── http/
│   │   ├── en.json            // Русская локализация
│   │   ├── ru.json            // Английская локализация
│   │   ├── i18.ts             // Скрипт приобразование JSON
│   │   └── index.ts           // Экспорт локалей
│   ├── utils/
│   │   └── logger.ts          // логгер для debug
│   ├── search/
│   │   └── index.ts           // client/server search
│   └── index.ts
├── package.json
├── tsconfig.json
└── README.md
```

### Установка

```npm
npm install link-to-proj
```

## Git

### Клонирование репозитория

```bash
  git clone https://github.com/INTELB0Y/ShapeRQ.git
```

### Переход в директорию проекта

```bash
  cd ShapeRQ
```

### Создание новой ветки (до релиза)

```bash
  git checkout -b shape-rq/<имя_ветки>
```

### Создание новой ветки (после релиз)

```bash
  git checkout -b release/<имя_ветки>
```
