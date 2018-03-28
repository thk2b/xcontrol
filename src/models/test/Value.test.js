import test from 'tape'

import Value from '../Value'
import Model from '../Model'

test('Value', main => {
    const initialState = 'initial state'
    main.test('constructor', t => {
        const v = new Value(initialState)
        t.ok(v instanceof Model, 'should extend Model')
        /* therefore, all the tests from Model must pass for Value */
        t.end()
    })
    main.test('set', t => {
        const v = new Value(initialState)
        const newState = 'new state'
        v.set(newState)
        t.equal(v.store, newState, 'should set the state')
        t.end()
    })
})