const { test } = require('node:test');
const assert = require('node:assert/strict');
const { load } = require('./helpers.cjs');

const { normalizeRichTextLinkHref } = load('src/features/content/lib/rich-text-links.ts');
const origin = 'https://iran-plaza.ir';

test('rich-text links accept absolute, domain-only and internal addresses', () => {
  assert.equal(normalizeRichTextLinkHref('https://example.com/page', origin), 'https://example.com/page');
  assert.equal(normalizeRichTextLinkHref('iran-plaza.ir/articles/', origin), 'https://iran-plaza.ir/articles/');
  assert.equal(normalizeRichTextLinkHref('/articles/', origin), 'https://iran-plaza.ir/articles/');
  assert.equal(normalizeRichTextLinkHref('#section', origin), 'https://iran-plaza.ir/#section');
});

test('rich-text links reject unsafe or malformed protocols', () => {
  assert.equal(normalizeRichTextLinkHref('javascript:alert(1)', origin), null);
  assert.equal(normalizeRichTextLinkHref('data:text/html,test', origin), null);
  assert.equal(normalizeRichTextLinkHref('', origin), null);
});
