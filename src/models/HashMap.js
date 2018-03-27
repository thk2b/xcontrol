import Model from '../Model'

export default class HashMap extends Model {
    set(object){
        this.state = {
            ...this.state,
            ...object
        }
    }
    get(key){
        return this.state[key] || null
    }
    delete(keys){
        return Array.isArray(keys)
            ? keys.forEach( key => {
                delete this.state[key]
            })
            : delete this.state[keys]            
    }
}