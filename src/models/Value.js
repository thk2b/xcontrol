import Model from './Model'

export default class Value extends Model {
    set(value){
        this.state = value
    }
}