import test from 'tape'
import sinon from 'sinon'

import Reactive from '../'
import Model from '../../../models/Model'
import Value from '../../../models/Value'
import HashMap from '../../../models/HashMap';

Object.entries({
    'Model': Model,
    'Value': Value,
    'HashMap': HashMap
}).forEach(runTestSuite)

function runTestSuite([name, ReactiveModel]){
    /* This test suite ensures that all models can be made reactive.
    ** This suite ignores actions specific to each model.
    ** Instead, it ensures they all have basic reactive properties.
    */
    name = `Reactive(${name})`
    test(name, main => {
        main.test('constructor', t => {
            const assert = c => {
                t.ok(typeof c.subscribe === 'function')
            }
            t.test('extending ' + name, t => {
                const c = new ReactiveModel()
                assert(c)
                t.end()
            }) 
        })
        main.test('subscribing to store updates', t => {
            const initialState = 'initial state'
            const c = new ReactiveModel(initialState)
            const callback1 = sinon.spy()    
            const callback2 = sinon.spy()    
            c.subscribe(callback1)
            c.subscribe(callback2)
        
            t.ok(callback1.calledOnceWith(initialState) &&
                callback2.calledOnceWith(initialState),
                'should immediately notify subscribers'
            )
        
            const other = new ReactiveModel()
            const innocentCallback = sinon.spy()
            other.subscribe(innocentCallback)
            
            const value = 'test'
        
            c.store = value
            t.ok(callback1.calledWith(value) && callback2.calledWith(value), 'should have notified subscribers with the new state')
            t.ok(innocentCallback.callCount === 1, 'should not have notified other ReactiveModels')
            t.end()
        })
        main.test('subscribing without initial notification', t => {
            const initialState = 'initial state'
            const c = new ReactiveModel(initialState)
            const callback = sinon.spy()

            c.subscribe(callback, false)
            t.ok(callback.notCalled, 'should not have been notified upon subscribing')
            
            const nextState = 'next state'
            c.store = nextState
            t.ok(callback.calledWith(nextState), 'should receive notifications')
            t.end()
        })
        main.test('unsubscribing from store updates', t => {
            /* In this test, we subscribe 5 times. 
            ** The first 4 times, we catch the first store update.
            ** We then unsubscribe 2 subscribers and subscribe a fith one.
            ** We cause a final store update for the remaining 3 subscribers. 
            */
            const c = new ReactiveModel()
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
            
            c.store = value
            
            const didUnsubscribe = unsubscribe()
            t.ok(didUnsubscribe, 'should return true when the subscriber is removed')
            unsubscribe2()
        
            const unsubscribe4 = c.subscribe(callback4)    
        
            c.store = newValue
        
            t.ok(callback.calledTwice)
            t.ok(callback1.calledThrice)
            t.ok(callback2.calledTwice)
            t.ok(callback3.calledThrice)
            t.ok(callback4.calledTwice)
            t.end()
        })
    })
}

test('advanced Model reactivity', main => {
    /** This test suite guarantees that Models with custom actions
     ** are still reactive.
     ** These actions can be pure, async or cause actions in other models
     ** In sum, this suite guarantees that reactivity is preserved on any compliant Model.
     */
    
    class AsyncReactiveValue extends Value {
        set(value){
            setTimeout(() => super.set(value), 0)
        }
    }
    main.test('reactive Model with custom actions', t => {
        const v = new Value('initial')
    
        const cb = sinon.spy()
        v.subscribe(cb)
    
        const newValue = 'new'
        v.set(newValue)
    
        t.ok(cb.calledWith(newValue))
        t.end()
    })
    main.test('reactive Model with custom selectors', t => {
        class Counter extends Reactive(Model) {
            increment(by = 1){
                this.store = this.store + by
            }
            isGreaterThan(n){
                return this.store > n
            }
        }
        const counter = new Counter(0)
    
        const cb = sinon.spy()
        counter.subscribe(cb)
        t.ok(cb.calledWith(0), 'store should be initial state')
        t.ok(!counter.isGreaterThan(1), 'selector should be false')
    
        counter.increment(10)
        t.ok(cb.calledWith(10), 'store should have been updated')
        t.ok(counter.isGreaterThan(1), 'selector should be true')
        t.end()
    })
    main.test('extending reactive Models with async actions', t => {
        const initialState = 'initial state'
        const v = new AsyncReactiveValue(initialState)
    
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
    main.test('calling another reactive model\'s actions', t => {
        const value = new Value()
        const valueCb = sinon.spy()
        value.subscribe(valueCb)
    
        class UpperCaseValue extends Value {
            setToUpperCaseAndHaveSideEffects(val){
                value.set(val)
                this.store = val.toUpperCase()
            }
        }
        const upperValue = new UpperCaseValue()
        const upperValueCb = sinon.spy()
        upperValue.subscribe(upperValueCb)
    
        const testValue = 'test value'
        upperValue.setToUpperCaseAndHaveSideEffects(testValue)
    
        t.ok(upperValueCb.calledWith(testValue.toUpperCase()), 'should have notified subscriber with own state')
        t.ok(valueCb.calledWith(testValue), 'should have notified the other controller\'s subscribers')

        const nextValue = 'next value'
        setTimeout(() => upperValue.setToUpperCaseAndHaveSideEffects(nextValue), 0)
        setTimeout(() => {
            t.ok(upperValueCb.calledWith(nextValue.toUpperCase()), 'should have notified subscriber with own state async')
            t.ok(valueCb.calledWith(nextValue), 'should have notified the other controller\'s subscribers async')
            t.end()
        }, 1)
    })
    main.test('subscribing to another reactive model', t => {
        class A extends Value { }
        class B extends Value { }

        const initialState = 'initial state'
        const a = new A(initialState)
        const b = new B()

        a.subscribe( aState => b.set(aState))
        t.equal(a.store, initialState, 'should have causes an initial store update')
        
        const nextState = 'next state'
        setTimeout(() => a.set(nextState), 0)
        setTimeout(() => {
            t.end()
            t.equal(b.store, nextState)
        }, 1)
    })
})