import test from 'tape'
import sinon from 'sinon'

import HashMap from '../HashMap'
import Model from '../Model'

test('HashMap', main => {
    const initialState = {
        a: 1, b: 2
    }
    main.test('constructor', t => {
        const hm = new HashMap(initialState)
        t.ok(hm instanceof Model, 'should extend Model')
        t.deepEqual(hm.store, initialState, 'should set initial state')
        t.end()
    })
    main.test('get', t => {
        const hm = new HashMap(initialState)
        const key = 'a'
        t.equal(hm.get(key), initialState[key], 'should get the value')
        t.end()
    })
    main.test('set', t => {
        const hm = new HashMap(initialState)
        const nextState = { c: 3 }
        const nextState1 = { c: 4 }
        const nextState2 = { d: 4, e: 5 }

        t.test('should set a new key', t => {
            hm.set(nextState)
            const key = 'c'
            t.equal(hm.get(key), nextState[key])
            t.deepEqual(hm.store, {...initialState, ...nextState })
            t.end()
        })
        t.test('should override existing values when key is already set', t => {
            hm.set(nextState1)
            const key = 'c'
            t.equal(hm.get(key), nextState1[key])
            t.deepEqual(hm.store, {...initialState, ...nextState1 })
            t.end()
        })
        t.test('should set multiple keys', t => {
            hm.set(nextState2)
            const key = 'e'
            t.equal(hm.get(key), nextState2[key])
            t.deepEqual(hm.store, {...initialState, ...nextState1, ...nextState2 })
            t.end()
        })        
    })
    main.test('delete', t => {        
        t.test('should remove the value at key', t => {
            const hm = new HashMap(initialState)
            const key = 'a'
            hm.delete(key)
            t.equal(hm.get(key), null)
            const expectedState = initialState
            delete expectedState[key]
            t.deepEqual(hm.store, expectedState)
            t.end()
        })
        t.test('should remove several keys', t => {
            const hm = new HashMap({ a: 1, b: 2, c: 3 })
            const keys = ['a', 'b']
            hm.delete(keys)
            t.deepEqual(hm.store, { c: 3 }, 'should have deleted keys')
            t.end()
        })
        t.test('should notify subscribers', t => {
            const hm = new HashMap({ a: 1, b: 2, c: 3 })
            const keys = ['a', 'b']
            const spy = sinon.spy()
            
            hm.subscribe(spy, false)
            hm.delete(keys)
            t.ok(spy.calledOnceWith({ c: 3 }), 'should notify subscribers')
            t.end()
        })
    })
})
