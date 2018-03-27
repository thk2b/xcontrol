import test from 'tape'
import sinon from 'sinon'

import reactive from '../reactive'
import Model from '../../models/Model'

class Controller extends reactive(Model){

}

test('reactive(Model)', main => {
    main.test('constructor', t => {
        const c = new Controller()
        t.ok(typeof c.subscribe === 'function')
        t.end()
    })
    main.test('subscribing to state updates', t => {
        const initialState = 'initial state'
        const c = new Controller(initialState)
        const callback1 = sinon.spy()    
        c.subscribe(callback1)
        const callback2 = sinon.spy()    
        c.subscribe(callback2)
    
        t.ok(callback1.calledOnceWith(initialState) &&
            callback2.calledOnceWith(initialState),
            'should immediately notify subscribers'
        )
    
        const other = new Controller()
        const innocentCallback = sinon.spy()
        other.subscribe(innocentCallback)
        
        const value = 'test'
    
        c.state = value
        t.ok(callback1.calledWith(value) && callback2.calledWith(value), 'should have notified subscribers with the new state')
        t.ok(innocentCallback.callCount === 1, 'should not have notified other controllers')
        t.end()
    })
    main.test('unsubscribing from state updates', t => {
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
    
        t.ok(callback.calledTwice)
        t.ok(callback1.calledThrice)
        t.ok(callback2.calledTwice)
        t.ok(callback3.calledThrice)
        t.ok(callback4.calledTwice)
        t.end()
    })
    main.test('extending Controller with custom actions', t => {
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
    main.test('extending Controller with custom selectors', t => {
        class Counter extends Controller {
            increment(by = 1){
                this.state = this.state + by
            }
            isGreaterThan(n){
                return this.state > n
            }
        }
        const counter = new Counter(0)
    
        const cb = sinon.spy()
        counter.subscribe(cb)
        t.ok(cb.calledWith(0), 'state should be initial state')
        t.ok(!counter.isGreaterThan(1), 'selector should be false')
    
        counter.increment(10)
        t.ok(cb.calledWith(10), 'state should have been updated')
        t.ok(counter.isGreaterThan(1), 'selector should be true')
        t.end()
    })
    main.test('extending Controller with async actions', t => {
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
    main.test('causing actions asynchronously', t => {
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
            t.ok(callback.callCount === 2)
            t.ok(callback.calledWith(value))
            t.end()
        }, 1)
    
    })
    main.test('calling another controller\'s actions', t => {
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
})