import test from 'tape'
import sinon from 'sinon'
import { Controller } from '../'

test('constructor', t => {
    const c = new Controller()
    t.ok(typeof c.subscribe === 'function')
    t.end()
})

test('getting the state', t => {
    const value = 'test'
    const c = new Controller(value)
    t.equal(c._state, value)

    t.end()
})

test('subscribing to state updates', t => {
    const c = new Controller()
    const callback1 = sinon.spy()    
    c.subscribe(callback1)
    const callback2 = sinon.spy()    
    c.subscribe(callback2)

    const other = new Controller()
    const innocentCallback = sinon.spy()
    other.subscribe(innocentCallback)
    
    const value = 'test'

    c.state = value
    t.ok(callback1.calledWith(value) && callback2.calledWith(value), 'should have notified subscribers with the new state')
    t.ok(!innocentCallback.called, 'should not have notified other controllers')
    t.end()
})

test('unsubscribing from state updates', t => {
    const c = new Controller()
    const value = 'test'
    const newValue = 'new test'

    const callback = sinon.spy()
    
    const unsubscribe = c.subscribe(callback)
    t.ok(typeof unsubscribe === 'function', 'should return a function')
    
    c.state = value
    
    const didUnsubscribe = unsubscribe()
    t.ok(didUnsubscribe, 'should return true when the subscriber is removed')

    c.state = newValue
    t.ok(callback.calledOnce)
    t.end()
})