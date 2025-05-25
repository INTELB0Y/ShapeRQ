Debugging
---
**Debug** - one of main **ShapeRQ** like for *novice* and for *proficianals*.

### What is the point?
<hr>

**ShapeRQ** has its own debug and error logging system.
Its behavior applies to all requests.

There is *general* - this is logging the start and end of the request, as well as exception errors.

And there is *local* - this is what is not common to all requests. For example: when sending `POST | PUT | PATCH` requests,
when successfully executed, the console will show the request body with all the sent data.


If the server returns data, then its list will also be output to the console as a separate log.

![gif](/assets/successExample.gif)

If server return error, then the console will display a message with the error code, possible reasons and MDN documentation

![img](/assets/httpErrorExample.png)

If a request error occurs, a log will appear with possible reasons and suggestions on how to fix it

![img](/assets/requestErrorExample.png)