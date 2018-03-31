# xcontrol
A lightweight flux interpretation.

## Related packages
- [react-xcontrol](https://github.com/thk2b/react-xcontrol) seamless react bindings.
- [xcontrol-examples](https://github.com/thk2b/xcontrol-examples) several complete examples.
- [xcontrol-logger](https://github.com/thk2b/xcontrol-logger) a simple logger that logs a controller's store when it updates. 


## API
- `Reactive(Super)`

Overrides the Super's store get/set to notify all subscribers.

- `Subscribe(Super)(controllers, mapState, mapActions)`

Subscribes the Super's store to the result of calling mapState with the combined state of all controllers. This value is recomputed whenever any controller's store update.

## Concepts

`xcontrol` is a flux interpretation powered by four core constructs:

- 💾 models
- 🎮 controllers
- 📡 subscribers
- 💥 actions

Models store the state. They allow reading and writing state.

A Controller is a subsclass of Model, which overrides the Model's base state getters and setters. Controllers can have side effects whenever the Model's state is changed. These changes are intercepted in getters and setters. Therefore, by definition, any subclass of Model which overrides get/set state to cause side effects is a Controller.

One possible side effect is notifying subscribers of state changes. This is implemented by the `reactive` HOC. For instance,
`reactive(Model)` enables subscribing to the Model's state changes. Whenever its state changes, all the subscribers are notified with the new state.

Subscribers consume a controller's state and cause actions.
They connect to the store by passing it a function of state. Whenever the state updates, the function is called by the controller.
Subscribers cause actions which may change the state.

Actions take a controller's current state and arguments, and compute the new state. They cause the controller to notify all subscribers by passing the new state to the callback they provided when subscribing.

There are two major types of actions.

Pure actions only modify the state, with no side effects. That is, in pseudocode: `action = (state1, ...args) => state2`.

Unpure actions cause side effects (other actions, logging, rendering, network calls... ). They can cause actions both from their own controller and from other controller instances. That is, unpure actions can subscribe to other controllers (they can read the state and cause actions). Unpure actions can also be asynchronous.

## Classes

### `Model`
a `Model` is a state container. It contains state, which cannot be accessed. It serves as a way of abstracting the process of reading / writing state. The basic Model prohibits reading the state, and allows setting it. 

More complex models can be engineered. An idiomatic one could be `TimeTravelModel`. Whenever the state is set, a record of the previous state is kept. Calling `timeTravelModel.back(n)` method reverts the state to the `n`th previous state. Similarly for `.forward(n)`.

### `Controller`
a `Controller` is a `Model` with added functionality. It adds a publish/subscribe mechanism to a model. Whenever the model's state is set (ie.changes), it notifies all the subscribers with the new state.

Classes extending a controller implement actions.
