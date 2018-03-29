import test from 'tape'

import Model from '../Model'
import Controller from '../../controllers/Controller'

test('Model', main => {
    main.deepEqual(Model.prototype, Controller().prototype)
    main.end()
})