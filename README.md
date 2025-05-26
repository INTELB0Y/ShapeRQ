
# ShapeRQ

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

* *GitBook WIP*

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
import { httpGet } from "shape-rq";

httpGet("MyAPI", "users/")
    .then(data => {
        console.log(data);
    });
```

#### POST Request

```ts
import { httpPost } from "shape-rq";

httpPost("MyAPI", "/auth/users/", {
    body: {
        username: "JohnDoe",
        password: "12345678"
    }
}).then(data => {
    console.log(data);
});
```

#### HEAD & OPTIONS

```ts
import { httpHead } from "shape-rq";

httpHead("MyAPI", "users/");
```
**Version** – `Release 1.1.2`