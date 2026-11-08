const { test } = require('node:test');
const assert = require('node:assert/strict');
const { load } = require('./helpers.cjs');

const { readCustomerDashboardCache, writeCustomerDashboardCache } = load('src/design/lib/customer-dashboard-cache.ts');

function createStorage() {
  const values = new Map();
  return {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
}

const cards = [{ id: 'business-1', name: 'Business 1', description: '', location: '', image: '/logo.png', vip: false, href: '/businesses/one' }];

test('dashboard cache is scoped by user and serves unexpired values', () => {
  const storage = createStorage();
  writeCustomerDashboardCache('user-a', 'favorites', cards, storage, 1000);
  assert.deepEqual(readCustomerDashboardCache('user-a', 'favorites', storage, 2000), cards);
  assert.equal(readCustomerDashboardCache('user-b', 'favorites', storage, 2000), null);
});

test('dashboard cache expires and rejects malformed or invalid values', () => {
  const storage = createStorage();
  writeCustomerDashboardCache('user-a', 'latest', cards, storage, 1000);
  assert.equal(readCustomerDashboardCache('user-a', 'latest', storage, 301001), null);
  storage.setItem('iran-plaza:customer-dashboard:v1:user-a:latest', '{invalid');
  assert.equal(readCustomerDashboardCache('user-a', 'latest', storage, 1001), null);
  storage.setItem('iran-plaza:customer-dashboard:v1:user-a:latest', JSON.stringify({ version: 1, savedAt: 1000, value: [{ id: 'bad' }] }));
  assert.equal(readCustomerDashboardCache('user-a', 'latest', storage, 1001), null);
});

test('dashboard cache tolerates unavailable session storage', () => {
  const storage = { getItem() { throw new Error('disabled'); }, setItem() { throw new Error('disabled'); } };
  assert.equal(readCustomerDashboardCache('user-a', 'latest', storage, 1000), null);
  assert.doesNotThrow(() => writeCustomerDashboardCache('user-a', 'latest', cards, storage, 1000));
});
