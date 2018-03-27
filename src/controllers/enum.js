import typed from './typed'
import { assert, either } from 'duck-check'

const defaultCompare = a => b => a === b

const warn 

/**
 * exports a Higher order model whose value 
 * must be in a set of values
 */
export default (enumeration, compare=defaultCompare) => typed(
    state => enumeration.find(compare(state)),
    { 
        $warn: (state, name) => {
            console.warn(`invalid value in enum(${name}):`, state)
        }
    }
)

// export default enum(
//     ['A', 'B', 'C']
// )(Value)