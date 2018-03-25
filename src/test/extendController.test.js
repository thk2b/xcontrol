import test from 'tape'
import sinon from 'sinon'

import { Controller } from '../'

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