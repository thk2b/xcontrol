import test from 'tape'
import sinon from 'sinon'

import computed from '../'

import reactive from '../../reactive'
import Value from '../../../models/Value'

class ReactiveValue extends reactive(Value){}
const initialState0 = 'initial state 0'
const initialState1 = 'initial state 1'
const combinedInitialStates = { initialState0, initialState1}

test('computed(Value)', main => {
    main.test('contructor', t => {  
        const controller = new ReactiveValue(initialState0)
        class ComputedValue extends computed({ controller })()(Value){}
        const c = new ComputedValue()
        t.ok(c instanceof Value, 'should return an instance of the decorated class')
        t.end()
    })
    main.test('mapping state', t => {
        const controller0 = new ReactiveValue(initialState0)
        const controller1 = new ReactiveValue(initialState1)
        const BoundComputed = computed({ controller0, controller1 })
        const combinedInitialStates = {
            controller0: initialState0, controller1: initialState1
        }
        t.test('default mapState', t => {
            class ComputedValue extends BoundComputed()(ReactiveValue){}
            const c = new ComputedValue()
            t.deepEqual(c.state, combinedInitialStates , 'should set the state to the combined state')
            t.end()
        })
        t.test('custom mapState', t => {
            t.test('is given the correct arguments', t => {
                const spy = sinon.spy()
                class ComputedValue extends BoundComputed(spy)(ReactiveValue){}
                const c = new ComputedValue()
                t.ok(spy.calledOnceWith(combinedInitialStates), 'should be passed the combined state')
                t.end()
            })
            t.test('should set the state to the result of mapState', t => {
                const mapState = ({ controller0, controller1 }) => (
                    controller0 + controller1
                )
                class ComputedValue extends BoundComputed(mapState)(ReactiveValue){}
                const c = new ComputedValue()

                t.deepEqual(c.state, initialState0 + initialState1)
                t.end()
            })
        })
    })
    main.test('updating state', t => {
        const controller0 = new ReactiveValue(initialState0)
        const controller1 = new ReactiveValue(initialState1)
        const mapState = ({ controller0, controller1 }) => (
            controller0 + controller1
        )
        class ComputedValue extends computed({ controller0, controller1 })
            (mapState)
        (Value){ }
        const c = new ComputedValue()

        t.equal(c.state, initialState0 + initialState1)

        const nextState0 = 'next state 0'
        controller0.set(nextState0)
        
        t.equal(c.state, nextState0 + initialState1, 'should update the computed state')
        
        const nextState1 = 'next state 1'
        setTimeout(() => controller1.set(nextState1), 0)
        setTimeout(() => {
            t.equal(c.state, nextState0 + nextState1, 'should update the computed state async')
            t.end()
        }, 1)
    })
    main.test('unsubscribing', t => {
        const controller0 = new ReactiveValue(initialState0)
        const controller1 = new ReactiveValue(initialState1)
        class ComputedValue extends computed({ controller0, controller1 })
            ()
        (Value){ }
        const c = new ComputedValue()
        c.unsubscribe()
        controller0.set('lost in the void')
        controller1.set('lost in the void too')

        t.deepEqual(c.state, {
            controller0: initialState0,
            controller1: initialState1
        }, 'should unsubscribe from all controllers')
        t.end()
    })
})

test('couputed(reactive(Value))', main => {
    main.test('updating state', t => {
        const controller0 = new ReactiveValue(initialState0)
        const controller1 = new ReactiveValue(initialState1)
        const mapState = ({ controller0, controller1 }) => (
            controller0 + controller1
        )
        class ReactiveComputedValue extends reactive(computed({ controller0, controller1 })
            (mapState)
        (Value)){ }
        const c = new ReactiveComputedValue()
        t.equal(c.state, initialState0 + initialState1)

        const nextState0 = 'next state 0'
        const spy = sinon.spy()
        c.subscribe(spy, false)
        controller0.set(nextState0)
        
        t.ok(spy.calledOnce)
        t.ok(spy.calledOnceWith( nextState0 + initialState1 ))
        t.end()
    })
})

test('invariants', main => {
    main.test('subscribing to a non-reactive controller', t => {
        const controller = new Value()
        class ComputedValue extends computed({ controller })
            ()
        (Value){ }
        try {
            new ComputedValue()
        } catch(e) {
            t.equal(e.message,
                `Invariant Violation: Can't subscribe to a non-reactive controller instance.` + 
                `You tried subscribing to a controller named controller in computed(Value),` +
                `But the controller controller is not reactive.` +
                `To solve the issue, wrap the controller's class in a 'reactive' call`
            )
            t.end()
        }
    })
})