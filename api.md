# API

Table of Contents

- [Controllers](#controllers)
  - [Controller](#controller)


# Controllers
## `Controller`

```js
import { Controller } from 'xcontrol'
import Controller from 'xcontrol/controllers/Controller'
```
A function that returns a `Controller` class extending the optional Super class provided as the only argument.

### Arguments

- `Super`
Optional class to be extend.

### Getters and Setters

- `set store(nextState)`
Sets the controller's store

- `get store`
Returns the controller's store

- `delete`
Sets the store to `null`

## Reactive

## Computed
