# API

Table of Contents
- [Controllers](#controllers)
  - [Controller](#controller)
  - [Reactive](#reactive)
  - [Computed](#computed)


# Controllers
## `Controller`
```js
import { Controller } from 'xcontrol'
import Controller from 'xcontrol/controllers/Controller'
```
A function that returns a `Controller` class extending the optional Super class provided as the only argument.

### Arguments
- `Super` {class | undefined}
Optional class to be extend.

### Getters and Setters
- `set store(nextState)`
Sets the controller's store

- `get store`
Returns the controller's store

- `delete`
Sets the store to `null`

## `Reactive`
```js
import { Reactive} from 'xcontrol'
import Reactive from 'xcontrol/controllers/Reactive'
```
A function that returns a `Reactive` class extending the Super class provided as the only argument.

### Arguments
- `Super` {class}
The class to be made reactive. Must be a `Controller`.

### Getters and Setters
- `set store(nextState)`
Sets `super.store` and notifies all subscribers with the next state.

- `get store`
Returns `super.store`

- `delete`
Returns `super.delete`

## `Computed`
```js
import { Computed} from 'xcontrol'
import Reactive from 'xcontrol/controllers/Computed'
```
A function that returns a function (refered to as `bindControllers`)
`bindControllers` takes controller instances and a mapState function, and returns a `Computed` class extending the Super class provided as the initial argument.

### Arguments
- `Super` {class}
The class to extend. Must be a `Controller`.

`BindControllers arguments`:
- controllers {Object}
An object with keys being the controller's name in the computed state and values being controller instances.

- mapState {Function: (nextCombinedState, initialState, state) => nextState | undefined}
A function that will recieve three arguments whenever any of the provided controllers updates:

  1) Combined state of all controllers 

      Each key in the combined state corresponds to the name asociated to the controller passed in the previous argument, and the value is the controller's state.

  2) Initial state

      The state provided when the controller was instantiated with `new`

  3) State

      The controller's current state

    Based on these three parameters, return the state of the computed controller. The computed controller's store is set to the return value of this function.

