import test from 'tape'

import Controller from '../'

test('Controller', main => {
    const initialState = 'initial state'
    main.test('create', t => {
        const c = new ( Controller() )(null)
        c.create(initialState)
        t.equal(c.store, initialState, 'should set the store')
        t.end()
    })
    main.test('get state', t => {
        const c = new ( Controller() )(initialState)
        t.equal(c.store, initialState, 'should get the state')
        t.end()
    })
    main.test('set state', t => {
        const c = new ( Controller() )(initialState)
        const nextState = 'next state'
        c.store = nextState
        t.equal(c.store, nextState, 'should have updated the store')
        t.end()
    })
    main.test('delete', t => {
        const c = new ( Controller() )(initialState)
        c.delete()
        t.equal(c.store, null, 'should have set the state to null')
        t.end()
    })
})