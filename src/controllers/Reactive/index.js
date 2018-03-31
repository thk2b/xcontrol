export default Controller => class Reactive extends Controller {
    constructor(initialState){
        super(initialState)
        this._nextSubscriberId = 0
        this._subscribers = {}
    }
    get store(){
        return super.store
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
        shouldNotifyImmediately && notifyCb(this.store)
        return () => this.unsubscribe(id)
    }
    set store(newState){
        super.store = newState
        this._subscribers && Object.values(this._subscribers).forEach(
            subscriber => subscriber(newState, this.store)
        )
    }
}