/** Creates a Model that extends the provided super class.
 * 
 */

export default (SuperClass=class{}) => class Model extends SuperClass {
    constructor(initialState){
        super(initialState)

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