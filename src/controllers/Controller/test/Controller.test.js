import test from 'tape'

import Controller from '../'

test('Controller', main => {
    const initialState = 'initial state'
    main.test('default base class', t => {
        const c = new ( Controller() )(initialState)
        t.equal(c.store, initialState)
        t.end()
    })
    main.test('custom super class', t => {
        const value = 'test value'
        class Test {
            someMethod(){
                return value
            }
        }
        class TestController extends Controller(Test){}
        const c = new TestController(initialState)
        t.equal(c.someMethod(), value)
        t.equal(c.store, initialState)
        t.end()
    })
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