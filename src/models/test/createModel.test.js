import test from 'tape'

import createModel from '../createModel'

test('createModel', main => {
    const initialState = 'intial state'
    main.test('default base class', t => {
        class Model extends createModel(){}
        const model = new Model(initialState)
        t.equal(model.store, initialState)
        t.end()
    })
    main.test('custom super class', t => {
        const value = 'test value'
        class Test {
            someMethod(){
                return value
            }
        }
        class TestModel extends createModel(Test){}
        const model = new TestModel(initialState)
        t.equal(model.someMethod(), value)
        t.equal(model.store, initialState)
        t.end()
    })
})