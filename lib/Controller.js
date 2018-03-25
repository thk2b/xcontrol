export default class Controller {
    constructor(initialState) {
        this._subscribers = [];
        this._state = initialState;
    }
    subscribe(notifyCb) {
        this._subscribers.push(notifyCb);
        // TODO: return an unsubscribe function
    }
    get state() {
        return this._state;
    }
    set state(newState) {
        this._subscribers.forEach(subscriber => subscriber(newState, this._state));
        this._state = newState;
    }
}