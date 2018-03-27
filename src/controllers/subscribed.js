const defaultMapState = state => state

/**
 * takes name-controller pairs,
 * a mapState function to compute the recieved state,
 * and name-action pairs to bind to the controllers
 */
export default controllers => (mapState=defaultMapState, ...actions) => Model => {
    class Subscribed extends Model {
        constructor(initialState){
            super(initialState)
            this._subscriptions = {}

            Object.entries(controllers).forEach(
                ([ name, controller ]) => {
                    this._subscriptions[name] = controller.subscribe(
                        state => this.state = mapState(state)
                    )
                }
            )
        }
        unsubscribe(name){

        }
    }
    Object.entries(actions).forEach(
        ([ modelName, actionsToBind ]) => {
            Object.entries(actionsToBind).forEach(
                ([ actionName, fn ]) => {
                    Subscribed.prototype[actionName] = fn.bind(controllers[modelName])
                }
            )
        }
    )
    return Subscribed
}

export default subscribed({ users, filter })(
    ({ users, filter }) => ({ filteredUsers: where(users, filter) })
)(Model)

export default subscribed({ users, filter })(
    ({ users, filter }) => ({ filteredUsers: where(users, filter) }),
    {
        users: { addUser: users.add },
        filter: { setFilter: filter.set }
    }
)(Model)

// possible API
// export default class extends subscribed({ users, filter })(
//     ({ users, filter }) => ({ filteredUsers: where(users, filter) })
// ) extends Model { }