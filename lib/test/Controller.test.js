'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _tape = require('tape');

var _tape2 = _interopRequireDefault(_tape);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _ = require('../');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(0, _tape2.default)('constructor', function (t) {
    var c = new _.Controller();
    t.ok(typeof c.subscribe === 'function');
    t.end();
});

(0, _tape2.default)('subscribing to state updates', function (t) {
    var initialState = 'initial state';
    var c = new _.Controller(initialState);
    var callback1 = _sinon2.default.spy();
    c.subscribe(callback1);
    var callback2 = _sinon2.default.spy();
    c.subscribe(callback2);

    t.ok(callback1.calledOnceWith(initialState) && callback2.calledOnceWith(initialState), 'should immediately notify subscribers');

    var other = new _.Controller();
    var innocentCallback = _sinon2.default.spy();
    other.subscribe(innocentCallback);

    var value = 'test';

    c.state = value;
    t.ok(callback1.calledWith(value) && callback2.calledWith(value), 'should have notified subscribers with the new state');
    t.ok(innocentCallback.callCount === 1, 'should not have notified other controllers');
    t.end();
});

(0, _tape2.default)('unsubscribing from state updates', function (t) {
    /* In this test, we subscribe 5 times. 
    ** The first 4 times, we catch the first state update.
    ** We then unsubscribe 2 subscribers and subscribe a fith one.
    ** We cause a final state update for the remaining 3 subscribers. 
    */
    var c = new _.Controller();
    var value = 'test';
    var newValue = 'new test';

    var callback = _sinon2.default.spy();
    var callback1 = _sinon2.default.spy();
    var callback2 = _sinon2.default.spy();
    var callback3 = _sinon2.default.spy();
    var callback4 = _sinon2.default.spy();

    var unsubscribe = c.subscribe(callback);
    t.ok(typeof unsubscribe === 'function', 'should return a function');
    var unsubscribe1 = c.subscribe(callback1);
    var unsubscribe2 = c.subscribe(callback2);
    var unsubscribe3 = c.subscribe(callback3);

    c.state = value;

    var didUnsubscribe = unsubscribe();
    t.ok(didUnsubscribe, 'should return true when the subscriber is removed');
    unsubscribe2();

    var unsubscribe4 = c.subscribe(callback4);

    c.state = newValue;

    t.ok(callback.calledTwice);
    t.ok(callback1.calledThrice);
    t.ok(callback2.calledTwice);
    t.ok(callback3.calledThrice);
    t.ok(callback4.calledTwice);
    t.end();
});

(0, _tape2.default)('extending Controller with custom actions', function (t) {
    var Value = function (_Controller) {
        _inherits(Value, _Controller);

        function Value() {
            _classCallCheck(this, Value);

            return _possibleConstructorReturn(this, (Value.__proto__ || Object.getPrototypeOf(Value)).apply(this, arguments));
        }

        _createClass(Value, [{
            key: 'set',
            value: function set(val) {
                this.state = val;
            }
        }]);

        return Value;
    }(_.Controller);

    var v = new Value('initial');

    var cb = _sinon2.default.spy();
    v.subscribe(cb);

    var newValue = 'new';
    v.set(newValue);

    t.ok(cb.calledWith(newValue));
    t.end();
});
(0, _tape2.default)('extending Controller with custom selectors', function (t) {
    var Counter = function (_Controller2) {
        _inherits(Counter, _Controller2);

        function Counter() {
            _classCallCheck(this, Counter);

            return _possibleConstructorReturn(this, (Counter.__proto__ || Object.getPrototypeOf(Counter)).apply(this, arguments));
        }

        _createClass(Counter, [{
            key: 'increment',
            value: function increment() {
                var by = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

                this.state = this.state + by;
            }
        }, {
            key: 'isGreaterThan',
            value: function isGreaterThan(n) {
                return this.state > n;
            }
        }]);

        return Counter;
    }(_.Controller);

    var counter = new Counter(0);

    var cb = _sinon2.default.spy();
    counter.subscribe(cb);
    t.ok(cb.calledWith(0), 'state should be initial state');
    t.ok(!counter.isGreaterThan(1), 'selector should be false');

    counter.increment(10);
    t.ok(cb.calledWith(10), 'state should have been updated');
    t.ok(counter.isGreaterThan(1), 'selector should be true');
    t.end();
});

(0, _tape2.default)('extending Controller with async actions', function (t) {
    var Value = function (_Controller3) {
        _inherits(Value, _Controller3);

        function Value() {
            _classCallCheck(this, Value);

            return _possibleConstructorReturn(this, (Value.__proto__ || Object.getPrototypeOf(Value)).apply(this, arguments));
        }

        _createClass(Value, [{
            key: 'set',
            value: function set(val) {
                var _this4 = this;

                setTimeout(function () {
                    return _this4.state = val;
                }, 0);
            }
        }]);

        return Value;
    }(_.Controller);

    var v = new Value('initial');

    var cb = _sinon2.default.spy();
    v.subscribe(cb);

    var newValue = 'new';
    v.set(newValue);

    setTimeout(function () {
        t.ok(cb.calledWith(newValue), 'should have notified the subscriber asynchronously');
        t.end();
    }, 1);
});

(0, _tape2.default)('causing actions asynchronously', function (t) {
    var Value = function (_Controller4) {
        _inherits(Value, _Controller4);

        function Value() {
            _classCallCheck(this, Value);

            return _possibleConstructorReturn(this, (Value.__proto__ || Object.getPrototypeOf(Value)).apply(this, arguments));
        }

        _createClass(Value, [{
            key: 'set',
            value: function set(val) {
                this.state = val;
            }
        }]);

        return Value;
    }(_.Controller);

    var v = new Value();
    var callback = _sinon2.default.spy();
    v.subscribe(callback);

    var value = 'new value';
    setTimeout(function () {
        return v.set(value);
    }, 0);

    setTimeout(function () {
        t.ok(callback.callCount === 2);
        t.ok(callback.calledWith(value));
        t.end();
    }, 1);
});

(0, _tape2.default)('calling another controller\'s actions', function (t) {
    var Value = function (_Controller5) {
        _inherits(Value, _Controller5);

        function Value() {
            _classCallCheck(this, Value);

            return _possibleConstructorReturn(this, (Value.__proto__ || Object.getPrototypeOf(Value)).apply(this, arguments));
        }

        _createClass(Value, [{
            key: 'set',
            value: function set(val) {
                this.state = val;
            }
        }]);

        return Value;
    }(_.Controller);

    var value = new Value();
    var valueCb = _sinon2.default.spy();
    value.subscribe(valueCb);

    var UpperCaseValue = function (_Controller6) {
        _inherits(UpperCaseValue, _Controller6);

        function UpperCaseValue() {
            _classCallCheck(this, UpperCaseValue);

            return _possibleConstructorReturn(this, (UpperCaseValue.__proto__ || Object.getPrototypeOf(UpperCaseValue)).apply(this, arguments));
        }

        _createClass(UpperCaseValue, [{
            key: 'setToUpperCaseAndHaveSideEffects',
            value: function setToUpperCaseAndHaveSideEffects(val) {
                value.set(val);
                this.state = val.toUpperCase();
            }
        }]);

        return UpperCaseValue;
    }(_.Controller);

    var upperValue = new UpperCaseValue();
    var upperValueCb = _sinon2.default.spy();
    upperValue.subscribe(upperValueCb);

    var testValue = 'test value';
    upperValue.setToUpperCaseAndHaveSideEffects(testValue);

    t.ok(upperValueCb.calledWith(testValue.toUpperCase()), 'should notify subscriber with own state');
    t.ok(valueCb.calledWith(testValue), 'should have notified the other controller\'s subscribers');
    t.end();
});