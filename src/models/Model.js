export default class Model {
    constructor(initialState){
        this.create(initialState)
    }
    get state(){
        return this._state
    }
    set state(newState){
        this._state = newState
    }
    create(initialState){
        this.state = initialState
    }
    delete(){
        this.state = null
    }
}