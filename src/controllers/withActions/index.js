export default Controller => (controllers, actions) => {
    class WithActions extends Controller {}
    
    Object.entries(actions).forEach(
        ([name, action]) => {
            WithActions.prototype[name] = action      
        }
    )

    return WithActions
}