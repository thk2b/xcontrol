# Concepts
- Controllers
  - Reactive Controllers
  - Computed Controllers
- Models

## Basic ES6 techniques

`xcontrol` heavily relies on prototypical inheritance, and uses the syntax introduced in ES6.
Complex functionality and reactivity is added to basic classes through the `extend` keyword.
However, the `extend` keyword cannot be chained multiple times as in `class A extends B extends C {...}`.
To allow composing multiple classes together, most classes are returned by functions.
Consider this example

```js
class A { a(){ console.log('a') }}
const B = Super => class B extends Super { b(){ console.log('b') }}
const C = Super => class C extends Super { c(){ console.log('c') }}

class MyC extends ( C(null) ) {...} // note the extra parentheses: we extend the result of the function call, which is a class.  

const ABC = C ( B ( A )) 
const abc = new ABC()
```
This way, we can easily create chains of inheritance.
Most controlers are created by chaining a number of these functions to give it the desired behaviour.

## Controllers

Controllers are the basic entity made available by `xcontrol`.
A controller has a `store`, which contains the state.
The state of a controller is a specific value of its store.
The most basic controller has getters and setters for the `store` property, and nothing else.

To set a controller's store, set `this.store = nextState` or `controllerInstance.store = nextState`.
cf `src/controllers/Controller`

Methods defined on controllers are refered to as actions. These may update the store or cause side effects.
Actions that only update the store are considered pure. On the other hand, unpure actions have side effects, and are therefore more difficult to manage. Aim at having as little unpure actions as possibe.

Lastly, controllers can cause actions from other controllers.

### The `Reactive` Controller
Reactivity plays a central role in `xcontrol`.
The core idea is that whenever a controller's store updates, some side effects should take place.
For instance, we may want to re-render the view or log the new state.

The `Reactive` function takes a class and extends it with a `subscribe` method.
Using subscribe is the simplest way of causing reactive side effects.

Whenever the store is updated, all the callbacks registered through `subscribe` are called with the new value of the store.
An important point is that mutating the store will not trigger an update; the entire store needs to be replaced.
This ensures that the store is treated as an immutable object.

Subscribe returns a function which, when called, unsbscribes the callback from future store updates.

```js
const ReactiveController = Reactive ( Controller ())
const rc = new ReactiveController('initial store')
const unsubscribe = rc.subscribe( nextState => console.log(nextState)) // console: 'initial store'

rc.store = 'new state' // console: 'new state'
```


cf `src/controllers/Reactive`
## Models

Models are reactive controllers with pure actions defined on them.
These actions are methods which have no side effects other than modifying the state.
Overall, Models implement basic data structures. The `xcontrol` packages ships with the following models:

- `Molde`: the Model base class. Extend it to create your own custom models.
- `Value`: holds a simple value
- `List`
- `HashMap`

These models are all reactive by default. Causing their actions will trigger a store update, and will notify subscribers.

## Computed Controllers

As we have seen so far, controllers can be subscribed-to. But controllers can also subscribe to other controllers (only if they are reactive).
That is, a controller can be dependent on another's state.
Whenever the parent controller updates, the dependent ones should also update.
Such controllers are said to be `computed`.

The `Computed` function takes a Controller class and returns a function
that takes
- a mapping between controller instances and their name.
- an optional `mapState` function.

This function returns a Controller class whose store updates whenver any of the controllers updates.
This class has an `unsubscribe` method which unsibscribes the computed controller from updates.

Under the hood, `Computed` is just a wrapper around the `subscribe` method of reactive controllers.
Anything that `Computed` can achieve can be done solely by using `subscribe`. However, `Computed` is more elegant,
and implements basic features such as unsubscribing from the upstream controllers.

