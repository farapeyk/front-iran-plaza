const test = require('node:test');
const assert = require('node:assert/strict');
const { load } = require('./helpers.cjs');

test('category icon catalog uses unique API-safe lucide names', () => {
  const { categoryIconOptions, getCategoryIcon, isCategoryIconName } = load('src/lib/category-icons.ts');
  const names = categoryIconOptions.map(option => option.name);

  assert.ok(names.length >= 40);
  assert.equal(new Set(names).size, names.length);
  assert.ok(names.every(name => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)));
  assert.equal(isCategoryIconName('coffee'), true);
  assert.equal(isCategoryIconName('not-a-real-category-icon'), false);
  assert.ok(getCategoryIcon('coffee'));
});
