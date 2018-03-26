export default class Model {
    constructor(initialState){
        this._state = initialState
    }
    get state(){
        return this._state
    }
    set state(newState){
        this._state = newState
    }
}