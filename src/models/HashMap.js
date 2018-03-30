import Model from './Model'

export default class HashMap extends Model {
    constructor(initialState = {}){
        super(initialState)
    }
    set(object){
        this.store = {
            ...this.store,
            ...object
        }
    }
    get = key => this.store[key] || null
    delete = keys => {
        if(! Array.isArray(keys)){
            keys = [keys]
        }
        this.store = Object.keys(this.store).reduce(
            (nextState, key) => keys.includes(key)
                ? nextState
                : { ...nextState, [key]: this.store[key] }
        , { })
    }       
}