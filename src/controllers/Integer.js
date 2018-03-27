import { assert, and } from 'duck-check'

import typed from './typed'

export default typed(
    assert(
        Number,
        n => n % 1 === 0
    )
)