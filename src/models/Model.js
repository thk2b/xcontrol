import Controller from '../controllers/Controller'
import Reactive from '../controllers/Reactive'
/**
 * A Model is a pure Controller with no side effects.
 */

export default class Model extends ( Reactive ( Controller())){ }