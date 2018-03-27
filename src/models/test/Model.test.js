import test from 'tape'

import Model from '../Model'

test('Model', main => {
    const initialState = 'initial state'
    const nextState = 'next state'
    const m = new Model(initialState)
    main.test('get state', t => {
        t.equal(initialState, m.state, 'should get the state')
        t.end()
    })

    main.test('set state', t => {
        m.state = nextState
        t.equal(m.state, nextState, 'should have updated the state')
        t.end()
    })
})