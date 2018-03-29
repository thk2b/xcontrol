export default (Super=null) => class extends Super {
    constructor(initialState){
        super(initialState)
        this._store = null
        this.create(initialState)
    }
    get store(){
        return this._store
    }
    set store(nextState){
        this._store = nextState
    }
    create(initialState){
        this.store = initialState
    }
    delete(){
        this.store = null
    }
}