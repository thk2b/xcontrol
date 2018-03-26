import Model from './Model'

export default class Controller extends Model {
    constructor(initialState){
        super(initialState)
        this._nextSubscriberId = 0
        this._subscribers = {}
    }
    get nextSubscriberId(){
        return ++this._nextSubscriberId
    }
    unsubscribe(id){
        return delete this._subscribers[id]
    }
    subscribe(notifyCb){
        const id = this.nextSubscriberId
        this._subscribers[id] = notifyCb
        notifyCb(super.state)
        return () => this.unsubscribe(id)
    }
    set state(newState){
        Object.values(this._subscribers).forEach(
            subscriber => subscriber(newState, this.state)
        )
        super.state = newState
    }
}