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