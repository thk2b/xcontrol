export default (Super=null) => class extends Super {
    constructor(initialState){
        super(initialState)
        this.store = initialState
    }
    get store(){
        return this._store
    }
    set store(nextState){
        this._store = nextState
    }
    delete(){
        this.store = null
    }
}