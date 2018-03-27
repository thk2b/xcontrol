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
        t.end()
    })
    main.test('unsubscribing', t => {
        t.test('should unsubscribe from all controllers')
        t.end()
    })
})

test('couputed(reactive(Value))', main => {
    main.test('updating state', t => {
        t.end()
    })
})