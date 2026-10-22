import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { after, before, beforeEach, test } from 'node:test';
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';

// Testene bruger en lokal Firebase-emulator og fiktive data, ikke den aktive database.
const seedData = JSON.parse(readFileSync(new URL('../database/demo-seed.json', import.meta.url), 'utf8'));
const source = readFileSync(new URL('../utils/demo.js', import.meta.url), 'utf8');
const { canJoin, distanceMeters, parseDate, parsePrice, nearbyTasks } =
    await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
let env;
const db = () => env.unauthenticatedContext().database();
const stamp = { '.sv': 'timestamp' };
const offer = (extra = {}) => ({ pricePerHousehold: 350, description: 'Inkl. moms og oprydning.', updatedAt: stamp, ...extra });
const details = (extra = {}) => ({
    title: 'Fælles opgave', description: 'En praktisk opgave for naboerne.',
    ownerId: 'customer-demo', ownerName: 'Maja Jensen', location: 'Frederiksberg',
    latitude: 55.6815, longitude: 12.531, radiusMeters: 1500,
    status: 'open', deadlineAt: Date.now() + 86400000,
    createdAt: stamp, updatedAt: stamp, ...extra,
});
const admin = (action) => env.withSecurityRulesDisabled((context) => action(context.database()));

// Start testmiljøet med de samme databaseregler, som appen bruger.
before(async () => {
    env = await initializeTestEnvironment({ projectId: 'demo-sambud-tests', database: {
        host: '127.0.0.1', port: 9000,
        rules: readFileSync(new URL('../database/database.rules.json', import.meta.url), 'utf8'),
    } });
});
// Nulstil data før hver test, så testene ikke påvirker hinanden.
beforeEach(async () => {
    await env.clearDatabase();
    const demo = structuredClone(seedData);
    for (const task of Object.values(demo.tasks)) {
        Object.assign(task.details, { createdAt: 1000, updatedAt: 1000, deadlineAt: Date.now() + 86400000 });
    }
    await admin((database) => database.ref().set({ demo, privateData: { untouched: true } }));
});
after(async () => { await env?.cleanup(); });

// Først kontrolleres, hvad en besøgende må læse og ændre i den fælles demo.
test('no login: demo is readable; root, old data and profiles cannot be changed', async () => {
    const guest = db();
    await assertSucceeds(guest.ref('demo').get());
    for (const path of ['', 'privateData', 'opportunities', 'participants', 'offers']) {
        await assertFails(guest.ref(path || '/').get());
        await assertFails(guest.ref(`${path}/injected`).set(true));
    }
    await assertFails(guest.ref('demo/profiles/customer/name').set('Andet navn'));
    await assertFails(guest.ref('demo').remove());
});

test('create task and enroll demo household atomically', async () => {
    await assertSucceeds(db().ref('demo/tasks/new').update({
        details: details(), 'participants/customer-demo': { name: 'Maja Jensen' },
    }));
    const result = (await db().ref('demo/tasks/new').get()).val();
    assert.equal(result.participants['customer-demo'].name, 'Maja Jensen');
    assert.equal(typeof result.details.createdAt, 'number');
});

test('only demo-owned tasks can be edited; fixed profile and creation time are preserved', async () => {
    const task = db().ref('demo/tasks/vinduer/details');
    await assertSucceeds(task.update({ title: 'Ny titel', updatedAt: stamp }));
    for (const extra of [{ ownerId: 'nabo-1' }, { ownerName: 'Andet navn' }, { createdAt: 5000 }, { latitude: 0 }, { radiusMeters: 100000 }]) {
        await assertFails(task.update({ ...extra, updatedAt: stamp }));
    }
    await assertFails(db().ref('demo/tasks/haek/details').update({ title: 'Ny titel', updatedAt: stamp }));
    await assertFails(task.remove());
});

test('malformed task data and past deadlines fail', async () => {
    for (const extra of [{ title: '' }, { title: '  ' }, { description: ' \n ' }, { title: 'x'.repeat(121) }, { deadlineAt: 1 }, { status: 'other' }, { extra: true }]) {
        await assertFails(db().ref('demo/tasks/new/details').set(details(extra)));
    }
});

// Tilmelding må ikke tælle samme husstand dobbelt eller ændre de fiktive naboer.
test('joining is idempotent and leaving preserves fictional neighbors', async () => {
    const member = db().ref('demo/tasks/haek/participants/customer-demo');
    await assertSucceeds(member.set({ name: 'Maja Jensen' }));
    await assertSucceeds(member.set({ name: 'Maja Jensen' }));
    assert.equal((await db().ref('demo/tasks/haek/participants').get()).numChildren(), 4);
    await assertSucceeds(member.remove());
    assert.equal((await db().ref('demo/tasks/haek/participants').get()).numChildren(), 3);
    await assertFails(db().ref('demo/tasks/haek/participants/nabo-4').remove());
    await assertFails(member.set({ name: 'Falsk navn' }));
    await assertFails(db().ref('demo/tasks/haek/participants/new-person').set({ name: 'Ny person' }));
    await assertFails(db().ref('demo/tasks/vinduer/participants/customer-demo').remove());
});

test('closed, expired and missing tasks reject joins and offers; leaving stays possible', async () => {
    await admin(async (database) => {
        await database.ref('demo/tasks/haek/details/status').set('closed');
        await database.ref('demo/tasks/fliser/details/deadlineAt').set(1);
    });
    for (const id of ['haek', 'fliser', 'missing']) {
        await assertFails(db().ref(`demo/tasks/${id}/participants/customer-demo`).set({ name: 'Maja Jensen' }));
        await assertFails(db().ref(`demo/tasks/${id}/offers/company-demo`).set(offer()));
    }
    await assertSucceeds(db().ref('demo/tasks/fliser/participants/customer-demo').remove());
});

test('demo owner can close and reopen with a future deadline', async () => {
    const task = db().ref('demo/tasks/vinduer/details');
    await assertSucceeds(task.update({ status: 'closed', deadlineAt: 1, updatedAt: stamp }));
    await assertFails(task.update({ status: 'open', updatedAt: stamp }));
    await assertSucceeds(task.update({ status: 'open', deadlineAt: Date.now() + 86400000, updatedAt: stamp }));
});

// Bud skal bevare prisen pr. husstand og opdatere samme post ved redigering.
test('offer price is per household, persists after a join, and edits replace the same offer', async () => {
    const target = db().ref('demo/tasks/haek/offers/company-demo');
    await assertSucceeds(target.set(offer()));
    await assertSucceeds(db().ref('demo/tasks/haek/participants/customer-demo').set({ name: 'Maja Jensen' }));
    assert.equal((await target.get()).val().pricePerHousehold, 350);
    await assertSucceeds(target.set(offer({ pricePerHousehold: 299.95 })));
    assert.equal((await db().ref('demo/tasks/haek/offers').get()).numChildren(), 1);
    assert.equal((await target.get()).val().pricePerHousehold, 299.95);
});

test('invalid prices, descriptions, extra fields and other companies are rejected', async () => {
    const target = db().ref('demo/tasks/haek/offers/company-demo');
    for (const extra of [{ pricePerHousehold: 0 }, { pricePerHousehold: -10 }, { pricePerHousehold: 100001 }, { pricePerHousehold: '350' }, { description: ' \n ' }, { totalPrice: 1000 }]) {
        await assertFails(target.set(offer(extra)));
    }
    await assertFails(db().ref('demo/tasks/haek/offers/other-company').set(offer()));
});

// En anden forbindelse skal kunne se et nyt bud uden at genindlæse appen.
test('a second client receives a new offer in realtime', async () => {
    const observer = db().ref('demo/tasks/haek/offers/company-demo');
    const seen = new Promise((resolve, reject) => {
        const timer = setTimeout(() => { observer.off(); reject(new Error('Realtime timed out')); }, 5000);
        observer.on('value', (snapshot) => {
            if (snapshot.val()?.pricePerHousehold === 350) {
                clearTimeout(timer); observer.off(); resolve();
            }
        }, reject);
    });
    await db().ref('demo/tasks/haek/offers/company-demo').set(offer());
    await seen;
});

// Til sidst kontrolleres afstande samt danske datoer og priser.
test('fixed map positions support nearby joins and block an out-of-radius task in the app', () => {
    const customer = seedData.profiles.customer;
    const tasks = Object.values(seedData.tasks).map((task) => ({ ...task.details, deadlineAt: Date.now() + 86400000 }));
    assert.equal(canJoin(tasks[1], customer), true);
    assert.equal(canJoin(tasks[3], customer), false);
    assert.equal(canJoin({ ...tasks[1], status: 'closed' }, customer), false);
    assert.equal(distanceMeters(customer, customer), 0);
    assert.equal(distanceMeters(null, customer), Infinity);
    assert.equal(nearbyTasks(tasks.map((task) => ({ ...task, distance: distanceMeters(customer, task) })), customer).length, tasks.length);
    for (const task of tasks) assert.ok(distanceMeters(seedData.profiles.company, task) < seedData.profiles.company.radiusMeters);
});

test('Danish prices and calendar dates are parsed without guessing', () => {
    assert.equal(parsePrice('299,95'), 299.95);
    assert.equal(parsePrice('350'), 350);
    for (const invalid of ['350kr', '1.000,00', '', '3,001', '-2']) assert.ok(Number.isNaN(parsePrice(invalid)));
    assert.ok(Number.isNaN(parseDate('2026-02-30')));
    assert.ok(Number.isNaN(parseDate('20/10/2026')));
    assert.equal(new Date(parseDate('2028-02-29')).getDate(), 29);
});
