export default Model => class extends Model {
    constructor(initialState){
        super(initialState)
        this._nextSubscriberId = 0
        this._subscribers = {}
    }
    get state(){
        return super.state
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
        notifyCb(this.state)
        return () => this.unsubscribe(id)
    }
    set state(newState){
        Object.values(this._subscribers).forEach(
            subscriber => subscriber(newState, this.state)
        )
        super.state = newState
    }
}

// control(typed(HashMap))

// class myController extends timeTravel(control(typed(HashMap)))