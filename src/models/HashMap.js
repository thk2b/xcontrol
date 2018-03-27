import Model from '../Model'

export default class HashMap extends Model {
    //QUESTION: do I need to manually pass to super ?
    // if yes, consider doing it in Model instead
    constructor(initialState){
        super(initialState)
    }
    get state(){
        return super.state
    }
    set state(newState){
        return super.state = newState
    }

    // CONVENTION: KebabCase for pure actions
    Set(object){
        this.state = {
            ...this.state,
            ...object
        }
    }
    Get(key){
        return this.state[key] || null
    }
    Delete(keys){
        return Array.isArray(keys)
            ? keys.forEach( key => {
                delete this.state[key]
            })
            : delete this.state[keys]            
    }
}