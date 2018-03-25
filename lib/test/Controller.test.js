import test from 'tape';
import { Controller } from '../';

test('constructor', t => {
    const c = new Controller('test');
    t.ok(typeof c.subscribe === 'function');
    t.end();
});

test('subscribing to state updates', t => {
    const _ = new Controller();
    const c = new Controller();
    const value = 'test';

    _.subscribe(() => t.fail('should not notify other controllers'));
    c.subscribe(state => {
        t.ok(state === value);
        t.end();
    });

    c.state = value;
});
test('unsubscribing from state updates', t => {});

test('getting the state', t => {
    const value = 'test';
    const c = new Controller(value);

    t.ok(c.state === 'test');

    t.end();
});