export default class Controller {
    constructor(initialState){
        this._nextSubscriberId = 0
        this._subscribers = {}
        this._state = initialState
    }
    subscribe(notifyCb){
        const id = this._nextSubscriberId
        this._nextSubscriberId += 1

        this._subscribers[id] = notifyCb

        return () => delete this._subscribers[id]
    }
    get state(){
        return this._state
    }
    set state(newState){
        Object.values(this._subscribers).forEach(
            subscriber => subscriber(newState, this._state)
        )
        this._state = newState
    }
}