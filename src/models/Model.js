export default class Model {
    constructor(initialState){
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