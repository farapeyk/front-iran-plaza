const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
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

test('rich-text document canonicalization preserves a bounded custom HTML block for backend sanitization', () => {
  const html = '<style>.card{color:#166534}</style><div class="card">محتوای سفارشی</div>';
  assert.deepEqual(canonicalizeRichTextDocument({
    type: 'doc', content: [{ type: 'rawHtml', attrs: { html, ignored: 'value' } }],
  }, origin), {
    type: 'doc', content: [{ type: 'rawHtml', attrs: { html } }],
  });
});

test('custom HTML is rendered only from the backend-sanitized rich-text node', () => {
  const editor = fs.readFileSync(path.join(__dirname, '../src/features/content/components/rich-text-editor.tsx'), 'utf8');
  const renderer = fs.readFileSync(path.join(__dirname, '../src/features/content/components/rich-text-renderer.tsx'), 'utf8');

  assert.match(editor, /sandbox/u);
  assert.match(editor, /customHtmlDocument\(trimmedHtml\)/u);
  assert.match(renderer, /node\.type === "rawHtml"/u);
  assert.match(renderer, /dangerouslySetInnerHTML/u);
});

test('rich-text links render without an underline in the editor and public article', () => {
  const editor = fs.readFileSync(path.join(__dirname, '../src/features/content/components/rich-text-editor.tsx'), 'utf8');
  const renderer = fs.readFileSync(path.join(__dirname, '../src/features/content/components/rich-text-renderer.tsx'), 'utf8');

  assert.match(editor, /\[&_a\]:no-underline/u);
  assert.match(renderer, /text-emerald-800 no-underline/u);
  assert.doesNotMatch(editor, /\[&_a\]:underline/u);
  assert.doesNotMatch(renderer, /text-emerald-800 underline/u);
});
