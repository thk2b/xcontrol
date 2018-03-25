import test from 'tape'
import sinon from 'sinon'
import { Controller } from '../'

test('constructor', t => {
    const c = new Controller('test')
    t.ok(typeof c.subscribe === 'function')
    t.end()
})

test('subscribing to state updates', t => {
    const _ = new Controller()
    const c = new Controller()
    const value = 'test'

    _.subscribe(() => t.fail('should not notify other controllers'))
    const callback = sinon.spy()
    c.subscribe(callback)
    
    c.state = value
    t.ok(callback.called)
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

test('getting the state', t => {
    const value = 'test'
    const c = new Controller(value)

    t.ok(c.state === 'test')

    t.end()
})