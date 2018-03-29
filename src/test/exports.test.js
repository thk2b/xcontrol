import test from 'tape'
import { Controller, Model, Computed, Reactive } from '../'

test('public exports', t => {
    t.ok(Controller, 'Controller should be exported')
    t.ok(Model, 'Model should be exported')
    t.ok(Computed, 'Computed should be exported')
    t.ok(Reactive, 'Reactive should be exported')
    t.end()
})