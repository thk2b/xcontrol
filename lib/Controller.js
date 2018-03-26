'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; };

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Model2 = require('./Model');

var _Model3 = _interopRequireDefault(_Model2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Controller = function (_Model) {
    _inherits(Controller, _Model);

    function Controller(initialState) {
        _classCallCheck(this, Controller);

        var _this = _possibleConstructorReturn(this, (Controller.__proto__ || Object.getPrototypeOf(Controller)).call(this, initialState));

        _this._nextSubscriberId = 0;
        _this._subscribers = {};
        return _this;
    }

    _createClass(Controller, [{
        key: 'unsubscribe',
        value: function unsubscribe(id) {
            return delete this._subscribers[id];
        }
    }, {
        key: 'subscribe',
        value: function subscribe(notifyCb) {
            var _this2 = this;

            var id = this.nextSubscriberId;
            this._subscribers[id] = notifyCb;
            notifyCb(_get(Controller.prototype.__proto__ || Object.getPrototypeOf(Controller.prototype), 'state', this));
            return function () {
                return _this2.unsubscribe(id);
            };
        }
    }, {
        key: 'nextSubscriberId',
        get: function get() {
            return ++this._nextSubscriberId;
        }
    }, {
        key: 'state',
        set: function set(newState) {
            var _this3 = this;

            Object.values(this._subscribers).forEach(function (subscriber) {
                return subscriber(newState, _this3.state);
            });
            _set(Controller.prototype.__proto__ || Object.getPrototypeOf(Controller.prototype), 'state', newState, this);
        }
    }]);

    return Controller;
}(_Model3.default);

exports.default = Controller;