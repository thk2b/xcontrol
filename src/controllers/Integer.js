import { assert, and } from 'duck-check'

import typed from './typed'
import Value from './Value'

export default typed(
    assert(
        Number,
        n => n % 1 === 0
    )
)( Value )