# controlx
A lightweight flux interpretation.

## Concepts

`controlx` is a flux interpretation powered by four core constructs:

- 💾 models
- 🎮 controllers
- 📡 subscribers
- 💥 actions

Models store the state. They allow reading and writing state. They are pure: no side effects are permitted. Models can be subclassed to represent more advanced data structures.

Controllers are enabled by the `control(Model)` higher order component. Any subclass of `Model` is valid.
`control(Model)` is essentially a 'dynamic'`extends` statement.
Controllers enable subscribers to subscribe to its state. Whenever state is written to the model, all subscribers are called with the model's new state. This is the only way of reading the state, by subscribing to it.

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
