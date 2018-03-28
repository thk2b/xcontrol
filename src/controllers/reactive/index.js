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
    subscribe(notifyCb, shouldNotifyImmediately=true){
        const id = this.nextSubscriberId
        this._subscribers[id] = notifyCb
        shouldNotifyImmediately && notifyCb(this.state)
        return () => this.unsubscribe(id)
    }
    set state(newState){
        super.state = newState
        this._subscribers && Object.values(this._subscribers).forEach(
            subscriber => subscriber(newState, this.state)
        )   
    }
}