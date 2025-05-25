Setting ShapeRQ configuration
---
**Default config looks like this**
```javascript
let config = {
    APIs: {},
    debug: false,
    lang: "en",
};
```
You can change it:
- Add your project API's
- Add authentication method
- Specify common request headers
- Enable/Disable debug
- Change language

**Templates**
```typescript
setConfig({
    APIs: { // Number of APIs is not limited
        "MyAPI": "example.com/api/", 
        "SecondAPI": "shkibidi.ru/api/" 
    }, 
    debug: true,
    lang: "ru"
})
```
```typescript
setConfig({
    ...
    auth: {
        token: accessToken; // User token
        headerName: "Authorization"; // header in request
        prefix: "Bearer"; // Token prefix
    }
    ...
})
// Authorization and Bearer is default values.
// Specifying these values here will apply them to all requests.
```
```typescript
setConfig({
    ...
    headers: {
        'X-Client-Version': '1.0.0' // Header for all requests
    }
    ...
})
// content-type: application/json is present in all requests by default
```
#### Совет
> Add *setConfig* in core, like *main.tsx* for React, so config is set on initialization.