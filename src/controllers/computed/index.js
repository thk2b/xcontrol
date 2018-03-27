/** 
 * Returns a Model whose state is set to the result of calling mapState whenever the controllers update.
 * When any controller update, the Model's state is updated.
 * If the Model is reactive, then all its subscribers will be notified.
 */
export default controllers => mapState => Model => {
    return class extends Model {
        constructor(initialState){
            super(initialState)
            this._subscriptions = {}
            
            this._initializing = true
            Object.entries(controllers).forEach(
                ([ name, controller ]) => {
                    this._subscriptions[name] = controller.subscribe(
                        state => this.updateMappedState(name, state)
                    )
                }
            )
        }
        updateMappedState(controllerName, nextState){
            if(this._initializing) return
            this.state = mapState({
                ...this.state,
                [controllerName]: nextState
            })
        }
        unsubscribe(){
            Object.values(this._subscriptions).forEach(
                unsubscribe => unsubscribe()
            )
        }
    }
}