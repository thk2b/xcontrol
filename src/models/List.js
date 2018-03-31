import Model from './Model'

export default class List extends Model {
    constructor(initialState=[]){
        super(initialState)
    }
    insert(index, elements){
        if(!(elements && index)) return false
        if(!Array.isArray(elements)) elements = [elements]
        
        this.store = [
            ...this.store.slice(0, index),
            ...elements,
            ...this.store.slice(index, this.store.length)
        ]
        return true
    }
    add(elements){
        return this.insert(this.store.length, elements)
    }
    remove(indices){
        if(!Array.isArray(indices)){
            indices = [ indices ]
        }
        const { length } = this.store
        this.store = this.store.filter(
            (el, i) => !indices.includes(i)
        )
        return length !== this.store.length
    }
    pop(index=this.store.length-1){
        const { store } = this
        this.remove(index)
        return store[index]
    }
    shift(){
        return this.pop(0)
    }
}