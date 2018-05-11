# xcontrol
A lightweight state management library for browsers and node.

It is currently an experimental project.

## Related packages
- [react-xcontrol](https://github.com/thk2b/react-xcontrol) seamless react bindings.
- [xcontrol-examples](https://github.com/thk2b/xcontrol-examples) several complete examples.
- [xcontrol-logger](https://github.com/thk2b/xcontrol-logger) a simple logger that logs a controller's store when it updates. 
- [socket.io-client-xcontrol](https://github.com/thk2b/socket.io-client-xcontrol) 

## Motivation

`xcontrol` is a javascript state managment library.

A major difficulty when developping applications is responding to changes in application state.
When the state changes, other aspects of the application have to be updated.
For instance, re-rendering the view or notifying a server through the network.

`xcontrol` provides:
- a mechanism for linking application state to side effects
- reusable implementations of common data structures (`HashMap`, `List`, ...)
- an ecosystem for integrating application-specific controllers to existing third party tools and libraries (such as `react-xcontrol`, `socket.io-client-xcontrol`, ...)

[Documentation](https://github.com/thk2b/xcontrol/blob/master/docs.md)

[API](https://github.com/thk2b/xcontrol/blob/master/api.md)
