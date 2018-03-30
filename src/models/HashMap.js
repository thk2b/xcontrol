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
    delete = keys => Array.isArray(keys)
        ? keys.forEach( key => {
            delete this.store[key]
        })
        : delete this.store[keys]            
}