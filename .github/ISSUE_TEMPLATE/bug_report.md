---
name: Bug report
about: A template of simple bug report
title: BugFound
labels: bug, wontfix
assignees: INTELB0Y

---

**Describe the bug**
When you use unsafe method xsrf fall the request

**To Reproduce**
Steps to reproduce on React:
1.Write a simple unsafe request
```ts
httpDel("yourapi", "endpoint")
```
2.Call the request

**Expected behavior**
Just send request on the server

**Behavior**
Request falls, and raise exception

**Desktop (please complete the following information):**
 - Browser (firefox, chrome, etc...)
 - Version (like `v1.2.3`)
