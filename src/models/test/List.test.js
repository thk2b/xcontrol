import test from 'tape'

import Model from '../Model'
import List from '../List'


test('List', main => {
    const initialState = [1,2,3]
    main.test('constructor', t => {
        const l = new List(initialState)
        t.ok(l instanceof Model, 'should extend Model')
        t.deepEqual(l.store, initialState, 'should set initial state')
        t.end()
    })
    main.test('insert', t => {
        t.test('insert out of bounds', t => {
            const l = new List(initialState)
            l.insert(10, 9)
            t.deepEqual(l.store, initialState.concat(9), 'should set at last available location')
            t.end()
        })
        t.test('insert negative index', t => {
            const l = new List(initialState)
            l.insert(-1, 9)
            t.deepEqual(l.store, [1,2,9,3], 'should insert from end')
            t.end()
        })
        t.test('insert element', t => {
            const l = new List(initialState)
            l.insert(1, 9)
            t.deepEqual(l.store, [1,9,2,3], 'should insert at the right position')
            t.end()
        })
        t.test('insert multiple elements', t => {
            const l = new List(initialState)
            const items = [9, 99, 999]
            l.insert(2, items )
            t.deepEqual(l.store, [1,2,...items, 3], 'should insert at the right position')
            t.end()
        })
    })
    main.test('add', t => {
        const l = new List(initialState)
        l.add(initialState)
        l.add(9)
        t.deepEqual(l.store, [...initialState, ...initialState, 9], 'should add the list and element at the end')
        t.end()
    })
    main.test('remove', t => {
        t.test('remove an element', t => {
            const l = new List(initialState)
            l.remove(0)
            t.deepEqual(l.store, [2,3])
            t.end() 
        })
        t.test('remove multiple elements', t => {
            const l = new List(initialState)
            const didRemove = l.remove([0, 2])
            t.equal(didRemove, true, 'should return true')
            t.deepEqual(l.store, [2])
            t.end() 
        })
        t.test('remove an invalid index', t => {
            const l = new List(initialState)
            const didRemove = l.remove()
            t.equal(didRemove, false, 'should return false')
            t.deepEqual(l.store, initialState)
            t.end()
        })
    })
    main.test('pop', t => {
        t.test('pop with default args', t => {
            const l = new List(initialState)
            const item = l.pop()
            t.equal(item, 3, 'should return the popped item')
            t.deepEqual(l.store, [1,2], 'shold remove the item')
            t.end()
        })
        t.test('pop index', t => {
            const l = new List(initialState)
            const item = l.pop(1)
            t.equal(item, 2, 'should return the popped item')
            t.deepEqual(l.store, [1,3], 'shold remove the item')
            t.end()
        })
    })
    main.test('shift', t => {
        const l = new List(initialState)
        const item = l.shift()
        t.equal(item, 1, 'should return the first item')
        t.deepEqual(l.store, [2,3], 'shold remove the first item')
        t.end()
    })
})