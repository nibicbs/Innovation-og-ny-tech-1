import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { after, before, beforeEach, test } from 'node:test';
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';

const projectId = 'demo-sambud-tests';
let env;
const task = (ownerId = 'alice', extra = {}) => ({
    title: 'Fælles vinduespudsning', location: 'Solvænget', description: '',
    deadlineAt: Date.now() + 86400000, status: 'Åben for bud', ownerId,
    createdAt: { '.sv': 'timestamp' }, updatedAt: { '.sv': 'timestamp' }, isDemo: false, ...extra,
});
const stamp = () => ({ joinedAt: { '.sv': 'timestamp' } });
const db = (uid) => env.authenticatedContext(uid).database();
const seed = async (data) => env.withSecurityRulesDisabled((context) => context.database().ref().set(data));

before(async () => {
    env = await initializeTestEnvironment({ projectId, database: {
        host: '127.0.0.1', port: 9000,
        rules: readFileSync(new URL('../database/database.rules.json', import.meta.url), 'utf8'),
    } });
});
beforeEach(async () => { await env.clearDatabase(); });
after(async () => { await env?.cleanup(); });

test('signed-out users cannot read or write; signed-in users can read app data', async () => {
    const guest = env.unauthenticatedContext().database();
    for (const path of ['opportunities', 'participants', 'offers', 'demoParticipants']) {
        await assertFails(guest.ref(path).get());
        await assertSucceeds(db('alice').ref(path).get());
    }
    await assertFails(guest.ref('opportunities/test').set(task()));
});

test('creation and owner participation succeed atomically', async () => {
    await assertSucceeds(db('alice').ref().update({ 'opportunities/test': task(), 'participants/test/alice': stamp() }));
    assert.equal((await db('alice').ref('participants/test/alice').get()).exists(), true);
});

test('a foreign participation in the creation batch rejects the entire batch', async () => {
    await assertFails(db('alice').ref().update({ 'opportunities/test': task(), 'participants/test/bob': stamp() }));
    assert.equal((await db('alice').ref('opportunities/test').get()).exists(), false);
});

test('only owner may edit; ownership and createdAt cannot be changed', async () => {
    await seed({ opportunities: { test: task('alice', { createdAt: 1000 }) } });
    await assertSucceeds(db('alice').ref('opportunities/test').update({ title: 'Ny titel', updatedAt: { '.sv': 'timestamp' } }));
    await assertFails(db('bob').ref('opportunities/test').update({ title: 'Andens titel', updatedAt: { '.sv': 'timestamp' } }));
    await assertFails(db('alice').ref('opportunities/test').update({ ownerId: 'bob', updatedAt: { '.sv': 'timestamp' } }));
    await assertFails(db('alice').ref('opportunities/test').update({ createdAt: 5000, updatedAt: { '.sv': 'timestamp' } }));
    await assertFails(db('alice').ref('opportunities/test').remove());
});

test('invalid records, unknown fields, demo impersonation and invented owners fail', async () => {
    for (const extra of [{ title: '' }, { title: '   ' }, { location: '' }, { deadlineAt: 1 }, { status: 'Ukendt' }, { ownerId: 'bob' }, { isDemo: true }, { expectedCost: 1 }, { title: 'x'.repeat(121) }]) {
        await assertFails(db('alice').ref('opportunities/test').set(task('alice', extra)));
    }
});

test('two users can join simultaneously without lost or duplicate participants', async () => {
    await seed({ opportunities: { test: task() } });
    await Promise.all([
        assertSucceeds(db('alice').ref('participants/test/alice').set(stamp())),
        assertSucceeds(db('bob').ref('participants/test/bob').set(stamp())),
    ]);
    await assertSucceeds(db('alice').ref('participants/test/alice').set(stamp()));
    assert.equal((await db('alice').ref('participants/test').get()).numChildren(), 2);
});

test('users cannot enroll or remove another user, including the task owner', async () => {
    await seed({ opportunities: { test: task() }, participants: { test: { bob: { joinedAt: 1000 } } } });
    await assertFails(db('alice').ref('participants/test/bob').set(stamp()));
    await assertFails(db('alice').ref('participants/test/bob').remove());
    await assertSucceeds(db('bob').ref('participants/test/bob').remove());
});

test('joining closed, expired or missing tasks fails; leaving is still allowed', async () => {
    await seed({ opportunities: { closed: task('alice', { status: 'Lukket' }), expired: task('alice', { deadlineAt: 1 }) }, participants: { closed: { bob: { joinedAt: 1000 } } } });
    for (const id of ['closed', 'expired', 'missing']) await assertFails(db('bob').ref(`participants/${id}/bob`).set(stamp()));
    await assertSucceeds(db('bob').ref('participants/closed/bob').remove());
});

test('owner may close a task and reopen it with a future deadline', async () => {
    await seed({ opportunities: { test: task('alice', { deadlineAt: 1 }) } });
    await assertSucceeds(db('alice').ref('opportunities/test').update({ status: 'Lukket', updatedAt: { '.sv': 'timestamp' } }));
    await assertFails(db('alice').ref('opportunities/test').update({ status: 'Åben for bud', updatedAt: { '.sv': 'timestamp' } }));
    await assertSucceeds(db('alice').ref('opportunities/test').update({ status: 'Åben for bud', deadlineAt: Date.now() + 86400000, updatedAt: { '.sv': 'timestamp' } }));
});

test('clients cannot change prices, company offers or fictional participants', async () => {
    for (const path of ['offers/test', 'demoParticipants/test', 'other']) await assertFails(db('alice').ref(path).set({ manipulated: true }));
});

test('realtime listeners on a second client receive joins and leaves', async () => {
    await seed({ opportunities: { test: task() } });
    const observer = db('alice').ref('participants/test');
    const waitForCount = (count) => new Promise((resolve, reject) => {
        const timer = setTimeout(() => { observer.off('value', listener); reject(new Error('Realtime update timed out')); }, 5000);
        const listener = observer.on('value', (snapshot) => {
            if (snapshot.numChildren() === count) { clearTimeout(timer); observer.off('value', listener); resolve(); }
        }, reject);
    });
    const joined = waitForCount(1);
    await db('bob').ref('participants/test/bob').set(stamp());
    await joined;
    const left = waitForCount(0);
    await db('bob').ref('participants/test/bob').remove();
    await left;
});

test('view model distinguishes real membership from fictional neighbors and keeps demo prices', async () => {
    const source = readFileSync(new URL('../utils/opportunities.js', import.meta.url), 'utf8');
    const { combineOpportunities, parseDeadline, validateOpportunityForm } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
    const result = combineOpportunities({ opportunities: { test: task() }, participants: { test: { alice: { joinedAt: 1 } } }, demoParticipants: { test: { fake: { label: 'Nabo 1' } } }, offers: { test: { expectedCost: 2400, items: { one: { discountedPrice: 2400 } } } } }, 'bob')[0];
    assert.equal(result.isUserParticipating, false);
    assert.equal(result.participants.length, 2);
    assert.equal(result.realParticipantCount, 1);
    assert.equal(result.expectedCost, 2400);
    assert.ok(Number.isNaN(parseDeadline('2026-02-30')));
    assert.ok(validateOpportunityForm({ title: 'Opgave', location: 'Vej', description: '', deadline: '2020-01-01', status: 'Åben for bud' }));
});
