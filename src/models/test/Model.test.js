import test from 'tape'

import Model from '../Model'

test('Model', main => {
    const initialState = 'initial state'
    main.test('create', t => {
        const m = new Model(null)
        m.create(initialState)
        t.equal(m.store, initialState, 'should set the store')
        t.end()
    })
    main.test('get state', t => {
        const m = new Model(initialState)
        t.equal(m.store, initialState, 'should get the state')
        t.end()
    })
    main.test('set state', t => {
        const m = new Model(initialState)
        const nextState = 'next state'
        m.store = nextState
        t.equal(m.store, nextState, 'should have updated the state')
        t.end()
    })
    main.test('delete', t => {
        const m = new Model(initialState)
        m.delete()
        t.equal(m.store, null, 'should have set the state to null')
        t.end()
    })
})