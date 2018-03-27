import Model from '../Model'

export default class Value extends Model {
    Set(value){
        this.state = value
    }
    Delete(){
        this.state = null
    }
}