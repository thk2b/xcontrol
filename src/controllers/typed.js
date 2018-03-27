import Model from '../Model'

const $defaultWarn = (state, name='Model') => console.warn(
    `failed type check in typed(${name}):`, newState
)

export default function typed(check,
    { $warn=$defaultWarn }
){
    return Model => class Typed extends Model {
        constructor(initialState){
            super(initialState)
            this.state = initialState //Q: needeed ?
        }
        set state(newState){
            this.check(newState)
                ? super.state = newState
                : $warn(newState, this.name)
        }
    }
}

// const $throw = value => { throw value }

// const check = assert({ [Number]: String })

// export default class extends typed(check, {
//     $warn: $throw,
// })(HashMap)