const { test } = require('node:test');
const assert = require('node:assert/strict');
const { load } = require('./helpers.cjs');

const {
  appendEditorialTag,
  MAX_EDITORIAL_TAGS,
  shouldCommitEditorialTag,
} = load('src/features/content/lib/editorial-tags.ts');

test('editorial tags are committed by Enter and normalized one at a time', () => {
  assert.equal(shouldCommitEditorialTag('Enter', false), true);
  assert.equal(shouldCommitEditorialTag(',', false), false);
  assert.equal(shouldCommitEditorialTag('Enter', true), false);

  assert.deepEqual(appendEditorialTag([], '  #شیراز  '), ['شیراز']);
  assert.deepEqual(appendEditorialTag(['شیراز'], 'شیراز'), ['شیراز']);
  assert.deepEqual(appendEditorialTag(['شیراز'], 'راهنمای انتخاب'), ['شیراز', 'راهنمای انتخاب']);
});

test('editorial tags respect the backend limits', () => {
  const tags = Array.from({ length: MAX_EDITORIAL_TAGS }, (_, index) => `tag-${index}`);
  assert.equal(appendEditorialTag(tags, 'extra'), tags);
  assert.equal(appendEditorialTag([], 'a'.repeat(61))[0].length, 60);
});
