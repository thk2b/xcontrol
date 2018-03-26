import test from 'tape'
import sinon from 'sinon'

import { Controller } from '../'

test('constructor', t => {
    const c = new Controller()
    t.ok(typeof c.subscribe === 'function')
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
    /* In this test, we subscribe 5 times. 
    ** The first 4 times, we catch the first state update.
    ** We then unsubscribe 2 subscribers and subscribe a fith one.
    ** We cause a final state update for the remaining 3 subscribers. 
    */
    const c = new Controller()
    const value = 'test'
    const newValue = 'new test'

    const callback = sinon.spy()
    const callback1 = sinon.spy()
    const callback2 = sinon.spy()
    const callback3 = sinon.spy()
    const callback4 = sinon.spy()
    
    const unsubscribe = c.subscribe(callback)
    t.ok(typeof unsubscribe === 'function', 'should return a function')
    const unsubscribe1 = c.subscribe(callback1)
    const unsubscribe2 = c.subscribe(callback2)
    const unsubscribe3 = c.subscribe(callback3)
    
    c.state = value
    
    const didUnsubscribe = unsubscribe()
    t.ok(didUnsubscribe, 'should return true when the subscriber is removed')
    unsubscribe2()

    const unsubscribe4 = c.subscribe(callback4)    

    c.state = newValue

    t.ok(callback.calledOnce)
    t.ok(callback1.calledTwice)
    t.ok(callback2.calledOnce)
    t.ok(callback3.calledTwice)
    t.ok(callback4.calledOnce)
    t.end()
})

test('extending Controller with custom actions', t => {
    class Value extends Controller {
        set(val){
            this.state = val
        }
    }
    const v = new Value('initial')

    const cb = sinon.spy()
    v.subscribe(cb)

    const newValue = 'new'
    v.set(newValue)

    t.ok(cb.calledWith(newValue))
    t.end()
})

test('extending Controller with async actions', t => {
    class Value extends Controller {
        set(val){
            setTimeout(() => this.state = val, 0)
        }
    }
    const v = new Value('initial')

    const cb = sinon.spy()
    v.subscribe(cb)

    const newValue = 'new'
    v.set(newValue)

    setTimeout(() => {
        t.ok(cb.calledWith(newValue), 'should have notified the subscriber asynchronously')
        t.end()
    }, 1)
})

test('causing actions asynchronously', t => {
    class Value extends Controller {
        set(val){
            this.state = val
        }
    }
    const v = new Value()
    const callback = sinon.spy()
    v.subscribe(callback)

    const value = 'new value'
    setTimeout(() => v.set(value), 0)

    setTimeout(() => {
        t.ok(callback.calledOnceWith(value))
        t.end()
    }, 1)

})

test('calling another controller\'s actions', t => {
    class Value extends Controller {
        set(val){
            this.state = val
        }
    }
    const value = new Value()
    const valueCb = sinon.spy()
    value.subscribe(valueCb)

    class UpperCaseValue extends Controller {
        setToUpperCaseAndHaveSideEffects(val){
            value.set(val)
            this.state = val.toUpperCase()
        }
    }
    const upperValue = new UpperCaseValue()
    const upperValueCb = sinon.spy()
    upperValue.subscribe(upperValueCb)

    const testValue = 'test value'
    upperValue.setToUpperCaseAndHaveSideEffects(testValue)

    t.ok(upperValueCb.calledWith(testValue.toUpperCase()), 'should notify subscriber with own state')
    t.ok(valueCb.calledWith(testValue), 'should have notified the other controller\'s subscribers')
    t.end()
})