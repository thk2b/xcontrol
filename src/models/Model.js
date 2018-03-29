import Controller from '../controllers/Controller'
import Reactive from '../controllers/Reactive'
/**
 * A Model is a reactive controller.
 */

export default class Model extends ( Reactive ( Controller())){ }