import invariant from '../../lib/invariant'

const defaultMapState = state => state

/** 
 * Returns a Model whose store is set to the result of calling mapState whenever the controllers update.
 * When any controller update, the Model's store is updated.
 * If the Model is reactive, then all its subscribers will be notified.
 */
// export default controllers => (mapState=defaultMapState) => Model => {
export default Model => (controllers, mapState=defaultMapState) => {
    return class extends Model {
        constructor(initialState){
            super(initialState)
            this._subscriptions = {}
            
            const combinedState = {}
            Object.entries(controllers).forEach(
                ([ name, controller ]) => {
                    invariant(controller.subscribe, 
                        `Can't subscribe to a non-reactive controller instance.` + 
                        `You tried subscribing to a controller named ${name} in computed(${Model.name}),` +
                        `But the ${name} controller is not reactive.` +
                        `To solve the issue, wrap the controller's class in a 'reactive' call`
                    )
                    this._subscriptions[name] = controller.subscribe(
                        nextState => {
                            combinedState[name] = nextState
                            this.store = mapState(combinedState)
                        }
                    , false )
                    combinedState[name] = controller.store
                }
            )
            this.store = mapState(combinedState)
        }
        unsubscribe(){
            Object.values(this._subscriptions).forEach(
                unsubscribe => unsubscribe()
            )
        }
    }
}