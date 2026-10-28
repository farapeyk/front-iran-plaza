const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { load } = require('./helpers.cjs');

const { canonicalizeRichTextDocument, normalizeRichTextLinkHref, normalizeTelephoneHref } = load('src/features/content/lib/rich-text-links.ts');
const { hasCustomHtmlChanged } = load('src/features/content/lib/rich-text-html.ts');
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

test('rich-text phone links normalize Persian and English telephone numbers', () => {
  assert.equal(normalizeTelephoneHref('۰۹۱۲ ۱۲۳ ۴۵۶۷'), 'tel:09121234567');
  assert.equal(normalizeTelephoneHref('tel:+98 (912) 123-4567'), 'tel:+989121234567');
  assert.equal(normalizeRichTextLinkHref('09121234567', origin), 'tel:09121234567');
  assert.equal(normalizeRichTextLinkHref('tel:021-12345678', origin), 'tel:02112345678');
  assert.equal(normalizeTelephoneHref('tel:javascript:alert(1)'), null);
  assert.equal(normalizeTelephoneHref('1234'), null);
});

test('telephone protocols remain forbidden for rich-text media sources', () => {
  assert.deepEqual(canonicalizeRichTextDocument({
    type: 'doc',
    content: [
      { type: 'image', attrs: { src: 'tel:09121234567', alt: 'invalid' } },
      { type: 'youtube', attrs: { src: 'tel:09121234567' } },
    ],
  }, origin), { type: 'doc', content: [] });
});

test('telephone links render as direct call anchors without a new browsing context', () => {
  const React = require('react');
  const { renderToStaticMarkup } = require('react-dom/server');
  const { RichTextRenderer } = load('src/features/content/components/rich-text-renderer.tsx', {
    '@/features/content/lib/rich-text-links': { normalizeTelephoneHref },
    '@/features/content/lib/rich-text-media': load('src/features/content/lib/rich-text-media.ts'),
  });
  const html = renderToStaticMarkup(React.createElement(RichTextRenderer, {
    document: {
      type: 'doc',
      content: [{
        type: 'paragraph',
        content: [{ type: 'text', text: 'تماس', marks: [{ type: 'link', attrs: { href: 'tel:09121234567' } }] }],
      }],
    },
  }));

  assert.match(html, /href="tel:09121234567"/u);
  assert.doesNotMatch(html, /target="_blank"/u);
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

test('switching rich-text modes does not rewrite unchanged content', () => {
  assert.equal(hasCustomHtmlChanged('<p>متن قبلی</p>', '<p>متن قبلی</p>'), false);
  assert.equal(hasCustomHtmlChanged('\r\n<p>متن قبلی</p>\r\n', '<p>متن قبلی</p>'), false);
  assert.equal(hasCustomHtmlChanged('<p>متن قبلی</p><div>HTML تازه</div>', '<p>متن قبلی</p>'), true);

  const editor = fs.readFileSync(path.join(__dirname, '../src/features/content/components/rich-text-editor.tsx'), 'utf8');
  assert.match(editor, /if \(nextMode === mode\) return/u);
  assert.match(editor, /if \(!hasCustomHtmlChanged\(htmlDraft, htmlSnapshotRef\.current\)\)/u);
});

test('rich-text links render without an underline in the editor and public article', () => {
  const editor = fs.readFileSync(path.join(__dirname, '../src/features/content/components/rich-text-editor.tsx'), 'utf8');
  const renderer = fs.readFileSync(path.join(__dirname, '../src/features/content/components/rich-text-renderer.tsx'), 'utf8');

  assert.match(editor, /\[&_a\]:no-underline/u);
  assert.match(renderer, /text-emerald-800 no-underline/u);
  assert.doesNotMatch(editor, /\[&_a\]:underline/u);
  assert.doesNotMatch(renderer, /text-emerald-800 underline/u);
  assert.match(editor, /لینک تماس برای متن انتخابی/u);
  assert.match(editor, /openLinkEditor\(true\)/u);
});
