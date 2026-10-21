import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';

const load = async (file) => import(`data:text/javascript;base64,${Buffer.from(readFileSync(new URL(file, import.meta.url), 'utf8')).toString('base64')}`);
const { taskView, areaSummary, customerTasks } = await load('../utils/demo.js');
const { mapDocument, mapUpdateScript } = await load('../utils/mapDocument.js');
const profile = { latitude: 55.68, longitude: 12.53 };

test('customer filters distinguish joined tasks from open, nearby tasks the household can join', () => {
    const customer = { ...profile, id: 'maja', radiusMeters: 1500 };
    function task(id, changes = {}, participants = {}) {
        return taskView(id, {
            details: { ...profile, radiusMeters: 1000, status: 'open', deadlineAt: 2000, ...changes },
            participants,
        }, customer);
    }
    const available = task('available');
    const tasks = [
        available,
        task('joined', {}, { maja: { name: 'Maja' } }),
        task('joined-closed', { status: 'closed' }, { maja: { name: 'Maja' } }),
        task('closed', { status: 'closed' }),
        task('expired', { deadlineAt: 500 }),
        task('outside-task-radius', { latitude: 55.6855, radiusMeters: 100 }),
        task('outside-search-radius', { latitude: 55.71, radiusMeters: 5000 }),
    ];
    assert.deepEqual(customerTasks(tasks, customer, 'available', 1000).map((task) => task.id), ['available']);
    assert.deepEqual(customerTasks(tasks, customer, 'joined', 1000).map((task) => task.id), ['joined', 'joined-closed']);
    available.participants.maja = { name: 'Maja' };
    assert.equal(customerTasks(tasks, customer, 'available', 1000).length, 0);
    assert.equal(customerTasks(tasks, customer, 'joined', 1000).length, 3);
});

test('participant and offer counts come from data; price remains per household after a join', () => {
    const record = {
        details: { ...profile, status: 'open', deadlineAt: 2000 },
        participants: { a: { name: 'Maja' } },
        offers: { company: { pricePerHousehold: 299.95, description: 'Inkl. moms' } },
    };
    const before = taskView('one', record, profile);
    record.participants.b = { name: 'Ida' };
    const after = taskView('one', record, profile);
    assert.equal(before.participantCount, 1);
    assert.equal(after.participantCount, 2);
    assert.equal(after.offerCount, 1);
    assert.equal(after.offerList[0].priceLabel, '299,95 kr.');
    assert.equal(after.offerList[0].priceLabel, before.offerList[0].priceLabel);
    assert.equal(after.offerList[0].pricePerHousehold, 299.95);
    assert.equal(after.participantList[1].name, 'Ida');
    assert.equal(after.distance, 0);
});

test('area overview counts participation across tasks, including households in several tasks', () => {
    const first = taskView('a', { details: { status: 'open', deadlineAt: 2000 }, participants: { a: { name: 'Maja' } } });
    const second = taskView('b', { details: { status: 'closed', deadlineAt: 2000 }, participants: { a: { name: 'Maja' } } });
    const empty = taskView('c', { details: { status: 'open', deadlineAt: 500 } });
    assert.deepEqual(areaSummary([first, second, empty], 1000), { openCount: 1, participantCount: 2, offerCount: 0 });
    assert.deepEqual(empty.offerList, []);
    assert.deepEqual(empty.participantList, []);
});

test('database text crosses the map bridge as plain data, even if it contains script-like text', () => {
    const data = { tasks: [{ id: 'a', title: '</script><script>throw 1</script>"\u2028\u2029' }] };
    let received;
    const script = mapUpdateScript(data);
    assert.equal(script.includes('</script>'), false);
    runInNewContext(script, { window: { renderMap: (value) => { received = value; } } });
    assert.equal(received.tasks[0].title, data.tasks[0].title);
});

test('map initializes, displays every supplied task and sends the selected task ID back to the app', () => {
    const html = mapDocument('');
    const script = html.match(/<script>\s*([\s\S]*?)<\/script>/)[1];
    const messages = [];
    const markers = [];
    let fittedPoints;
    const layer = { addTo() { return this; }, clearLayers() {} };
    const map = { fitBounds(points) { fittedPoints = points; }, invalidateSize() {} };
    const tiles = { ...layer, on() { return this; } };
    const context = {
        window: { ReactNativeWebView: { postMessage: (text) => messages.push(JSON.parse(text)) }, addEventListener() {} },
        document: { createElement: () => ({ textContent: '' }) },
        L: {
            map: () => map, control: { zoom: () => layer }, layerGroup: () => layer,
            tileLayer: () => tiles, circle: () => layer, divIcon: (options) => options,
            marker: (position, options) => {
                const marker = { ...layer, options, bindTooltip() { return this; }, on(event, callback) { this.click = callback; return this; } };
                markers.push(marker); return marker;
            },
        },
    };
    context.window.L = context.L;
    runInNewContext(script, context);
    context.window.renderMap({
        profile: { ...profile, radiusMeters: 1500 },
        profiles: { customer: { ...profile, name: 'Maja' }, company: { ...profile, name: 'NaboService' } },
        tasks: [{ ...profile, id: 'task-1', title: 'Vinduer', radiusMeters: 1000 },
            { latitude: 55.68, longitude: 12.55, id: 'task-2', title: 'Hæk', radiusMeters: 1000 }],
        selectedId: 'task-2',
    });
    assert.equal(fittedPoints.length, 5);
    assert.equal(markers.length, 4);
    markers[3].click();
    assert.deepEqual(messages, [{ type: 'mounted' }, { type: 'select', id: 'task-2' }]);
});

test('map reports a resource failure instead of silently leaving the screen blank', () => {
    const script = mapDocument('').match(/<script>\s*([\s\S]*?)<\/script>/)[1];
    const messages = [];
    runInNewContext(script, { window: { ReactNativeWebView: { postMessage: (text) => messages.push(JSON.parse(text)) } } });
    assert.deepEqual(messages, [{ type: 'error' }]);
});
