const { test } = require('node:test');
const assert = require('node:assert/strict');
const { load } = require('./helpers.cjs');

const { readRecentBusinesses, rememberRecentBusiness } = load('src/design/lib/recent-businesses.ts');

function createStorage() {
  const values = new Map();
  return {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
}

function business(id, overrides = {}) {
  return {
    id,
    slug: `business-${id}`,
    name: `Business ${id}`,
    description: '',
    location: '',
    logoId: null,
    vip: false,
    ...overrides,
  };
}

test('recent businesses are most-recent-first, deduplicated, capped, and user-scoped', () => {
  const storage = createStorage();
  for (let index = 1; index <= 9; index += 1) {
    rememberRecentBusiness('user-a', business(String(index)), storage);
  }
  rememberRecentBusiness('user-a', business('4', { name: 'Updated business' }), storage);

  const recent = readRecentBusinesses('user-a', storage);
  assert.equal(recent.length, 8);
  assert.equal(recent[0].id, '4');
  assert.equal(recent[0].name, 'Updated business');
  assert.equal(recent.filter(item => item.id === '4').length, 1);
  assert.deepEqual(readRecentBusinesses('user-b', storage), []);
});

test('recent-business history ignores malformed storage and tolerates unavailable storage', () => {
  const storage = createStorage();
  storage.setItem('iran-plaza:recent-businesses:user-a', '{invalid');
  assert.deepEqual(readRecentBusinesses('user-a', storage), []);

  const unavailableStorage = {
    getItem() { throw new Error('storage disabled'); },
    setItem() { throw new Error('storage disabled'); },
  };
  assert.deepEqual(readRecentBusinesses('user-a', unavailableStorage), []);
  assert.doesNotThrow(() => rememberRecentBusiness('user-a', business('1'), unavailableStorage));
});
