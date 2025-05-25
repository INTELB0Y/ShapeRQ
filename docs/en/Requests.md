# Requests
---
**ShapeRQ** supports all types of requests:

>- GET - get data
>- POST - send data
>- PUT - update data with *full overwrite* of the object
>- PATCH - update data with *partial overwrite* of the object
>- DELETE - delete the object
>- HEAD - get headers, check resource existence
>- OPTIONS - get information about supported methods

```typescript
import { get, post, put, patch, del, head, options } from "shape-rq"
```
##### Request without body
```typescript
get("MyAPI", "users/")
    .then(data => {
        console.log(data)
    })
// Also for all types of requests, the following syntax is valid
const res = get("MyAPI", "users/")
console.log(res)
```
```typescript
delete(
    "MyAPI", 
    "/auth/users/1/"
).then(
    ...
    }
)
```
Request without body also includes HEAD and OPTIONS.
These types of requests take only two parameters as arguments - the key from `APIs` and the endpoint of the request.
#### Requests with body
```typescript
post(
    "MyAPI", 
    "/auth/users/",
    {
        username: "JohnDoe",
        password: "12345678"
    }
).then(
    ...
)
```
```typescript
put(
    "MyAPI", 
    "/auth/users/1/",
    {
        username: "DoeJohn",
        password: "87654321"
    }
).then(
    ...
)
```

```typescript
patch(
    "MyAPI", 
    "/auth/users/1/",
    {
        username: "DoeJohn"
    }
).then(
    ...
)
```
Its difference from "simple" requests is that they accept a third parameter, which is an object with data.
When sending data, it automatically converts them to JSON.

##### Notes
1. All requests return a Promise, which resolves to the response data.
   If the request fails, the Promise will be rejected with an error.
2. Check the received data (in the `then` block) for `null`, as an error will always return `null`.
3. In case of a network error (CORS, internet issues), a built-in exception will be triggered. During debugging, a corresponding message will appear. `null` will be returned.
4. When debugging is enabled in the browser console, information about errors and requests in general will be displayed.

