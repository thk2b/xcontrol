'use strict';

var _tape = require('tape');

var _tape2 = _interopRequireDefault(_tape);

var _sinon = require('sinon');

var _sinon2 = _interopRequireDefault(_sinon);

var _ = require('../');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _tape2.default)('constructor', function (t) {
    var c = new _.Controller();
    t.ok(typeof c.subscribe === 'function');
    t.end();
});

(0, _tape2.default)('getting the state', function (t) {
    var value = 'test';
    var c = new _.Controller(value);
    t.equal(c._state, value);

    t.end();
});

(0, _tape2.default)('subscribing to state updates', function (t) {
    var c = new _.Controller();
    var callback1 = _sinon2.default.spy();
    c.subscribe(callback1);
    var callback2 = _sinon2.default.spy();
    c.subscribe(callback2);

    var other = new _.Controller();
    var innocentCallback = _sinon2.default.spy();
    other.subscribe(innocentCallback);

    var value = 'test';

    c.state = value;
    t.ok(callback1.calledWith(value) && callback2.calledWith(value), 'should have notified subscribers with the new state');
    t.ok(!innocentCallback.called, 'should not have notified other controllers');
    t.end();
});

(0, _tape2.default)('unsubscribing from state updates', function (t) {
    var c = new _.Controller();
    var value = 'test';
    var newValue = 'new test';

    var callback = _sinon2.default.spy();

    var unsubscribe = c.subscribe(callback);
    t.ok(typeof unsubscribe === 'function', 'should return a function');

    c.state = value;

    var didUnsubscribe = unsubscribe();
    t.ok(didUnsubscribe, 'should return true when the subscriber is removed');

    c.state = newValue;
    t.ok(callback.calledOnce);
    t.end();
});