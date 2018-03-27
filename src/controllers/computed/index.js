const defaultMapState = state => state

/** 
 * Returns a Model whose state is set to the result of calling mapState whenever the controllers update.
 * When any controller update, the Model's state is updated.
 * If the Model is reactive, then all its subscribers will be notified.
 */
export default controllers => (mapState=defaultMapState) => Model => {
    return class extends Model {
        constructor(initialState){
            super(initialState)
            this._subscriptions = {}
            
            const combinedState = {}
            Object.entries(controllers).forEach(
                ([ name, controller ]) => {
                    if(!controller.subscribe) throw { 
                        message: `can't subscribe to a non-reactive Controller: ${name}`
                    }
                    this._subscriptions[name] = controller.subscribe(
                        nextState => this.state = mapState({
                            /* get the current state of all controllers */
                            // TODO: consider refactoring. Maybe keep a copy of the combined state
                            ...Object.keys(controllers).reduce(
                                (obj, name) => ({...obj, [name]: controllers[name].state })
                            , {}),
                            [name]: nextState
                        })
                    , false)
                    combinedState[name] = controller.state
                }
            )
            this.state = mapState(combinedState)
        }
        unsubscribe(){
            Object.values(this._subscriptions).forEach(
                unsubscribe => unsubscribe()
            )
        }
    }
}