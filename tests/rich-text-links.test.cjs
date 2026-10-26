const { test } = require('node:test');
const assert = require('node:assert/strict');
const { load } = require('./helpers.cjs');

const { canonicalizeRichTextDocument, normalizeRichTextLinkHref } = load('src/features/content/lib/rich-text-links.ts');
const origin = 'https://iran-plaza.ir';

test('rich-text links accept absolute, domain-only and internal addresses', () => {
  assert.equal(normalizeRichTextLinkHref('https://example.com/page', origin), 'https://example.com/page');
  assert.equal(normalizeRichTextLinkHref('iran-plaza.ir/articles/', origin), 'https://iran-plaza.ir/articles/');
  assert.equal(normalizeRichTextLinkHref('/articles/', origin), 'https://iran-plaza.ir/articles/');
  assert.equal(normalizeRichTextLinkHref('#section', origin), 'https://iran-plaza.ir/#section');
  assert.equal(normalizeRichTextLinkHref('\u200fhttps://dr115.ir/\u200e', origin), 'https://dr115.ir/');
});

test('rich-text links reject unsafe or malformed protocols', () => {
  assert.equal(normalizeRichTextLinkHref('javascript:alert(1)', origin), null);
  assert.equal(normalizeRichTextLinkHref('data:text/html,test', origin), null);
  assert.equal(normalizeRichTextLinkHref('', origin), null);
});

test('rich-text documents strip TipTap defaults while preserving selected links', () => {
  assert.deepEqual(canonicalizeRichTextDocument({
    type: 'doc',
    content: [{
      type: 'paragraph',
      attrs: { textAlign: null },
      content: [{
        type: 'text',
        text: 'متن لینک‌شده',
        marks: [
          { type: 'link', attrs: { href: 'https://dr115.ir/', target: '_blank', rel: 'noopener noreferrer nofollow', class: null, title: null } },
          { type: 'textStyle', attrs: { color: null, fontFamily: null, fontSize: null } },
        ],
      }],
    }],
  }, origin), {
    type: 'doc',
    content: [{
      type: 'paragraph',
      content: [{ type: 'text', text: 'متن لینک‌شده', marks: [{ type: 'link', attrs: { href: 'https://dr115.ir/' } }] }],
    }],
  });
});

test('rich-text document canonicalization drops unsafe links but keeps their text', () => {
  assert.deepEqual(canonicalizeRichTextDocument({
    type: 'doc',
    content: [{ type: 'paragraph', content: [{ type: 'text', text: 'متن', marks: [{ type: 'link', attrs: { href: 'javascript:alert(1)' } }] }] }],
  }, origin), {
    type: 'doc',
    content: [{ type: 'paragraph', content: [{ type: 'text', text: 'متن' }] }],
  });
});
