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
    class C1 extends Controller {
        set(value){
            this.state = value
        }
    }
    const c1 = new C1()
    const c1Cb = sinon.spy()
    c1.subscribe(c1Cb)

    class C2 extends Controller {
        setAndHaveSideEffects(value){
            c1.set(value)
            this.state = value
        }
    }
    const c2 = new C2()
    const c2Cb = sinon.spy()
    c2.subscribe(c2Cb)

    const value = 'test value'
    c2.setAndHaveSideEffects(value)

    t.ok(c2Cb.calledWith(value))
    t.ok(c1Cb.calledWith(value))
    t.end()
})