const { test } = require('node:test');
const assert = require('node:assert/strict');
const { load } = require('./helpers.cjs');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const content = load('src/features/content/lib/article-content.ts');
const links = load('src/features/content/lib/rich-text-links.ts');
const { RichTextRenderer } = load('src/features/content/components/rich-text-renderer.tsx', {
  '@/features/content/lib/rich-text-links': links,
  '@/features/content/lib/rich-text-media': load('src/features/content/lib/rich-text-media.ts'),
});
const text = text => ({ type: 'text', text });
const paragraph = value => ({ type: 'paragraph', content: [text(value)] });
const faq = (isActive = true) => ({ type: 'faq', attrs: { isActive }, content: [
  { type: 'faqQuestion', content: [text('پرسش متداول چیست؟')] },
  { type: 'faqAnswer', content: [paragraph('پاسخ کامل به پرسش متداول')] },
] });
const business = { type: 'businessList', attrs: { businessIds: ['business-1'], listTitle: 'منتخب‌ها' } };
const blocks = [{ id: 'body', type: 'paragraph', richText: { type: 'doc', content: [paragraph('قبل'), faq(), business, paragraph('بعد')] } }];

test('embedded nodes survive canonicalization without editor-only attributes', () => {
  const normalized = links.canonicalizeRichTextDocument(blocks[0].richText, 'https://iran-plaza.ir');
  assert.deepEqual(normalized, blocks[0].richText);
  assert.deepEqual(content.articleVisibleFaqs(blocks, []), [{ question: 'پرسش متداول چیست؟', answer: 'پاسخ کامل به پرسش متداول' }]);
  assert.deepEqual(content.articleStructuredBlocks(blocks).find(item => item.type === 'business-list').businessIds, ['business-1']);
});

test('FAQ schema includes active inline questions and deduplicates standalone questions', () => {
  const withInactive = [...blocks, { id: 'hidden', type: 'paragraph', richText: { type: 'doc', content: [faq(false)] } }];
  assert.equal(content.articleVisibleFaqs(withInactive, [{ question: 'پرسش متداول چیست؟', answer: 'پاسخ جداگانه' }]).length, 1);
  assert.equal(content.articleVisibleFaqs([withInactive[1]], []).length, 0);
});

test('public renderer keeps inserted components between surrounding text', () => {
  const html = renderToStaticMarkup(React.createElement(RichTextRenderer, {
    document: blocks[0].richText,
    renderBusinessList: (ids, title) => React.createElement('section', { 'data-ids': ids.join(',') }, title),
  }));
  assert.ok(html.indexOf('قبل') < html.indexOf('<details'));
  assert.ok(html.indexOf('<details') < html.indexOf('data-ids="business-1"'));
  assert.ok(html.indexOf('data-ids="business-1"') < html.indexOf('بعد'));
  const hidden = renderToStaticMarkup(React.createElement(RichTextRenderer, { document: { type: 'doc', content: [faq(false)] } }));
  assert.doesNotMatch(hidden, /<details/);
});

test('inline tables supply listing rows and retain merged cell spans in public HTML', () => {
  const table = { type: 'table', content: [
    { type: 'tableRow', content: [{ type: 'tableHeader', content: [paragraph('نام')] }] },
    { type: 'tableRow', content: [{ type: 'tableCell', attrs: { colspan: 2, rowspan: 2 }, content: [paragraph('مجموعه نمونه')] }] },
  ] };
  const doc = { type: 'doc', content: [table] };
  const structured = content.articleStructuredBlocks([{ id: 't', type: 'paragraph', richText: doc }]);
  assert.deepEqual(structured[1].table, { headers: ['نام'], rows: [{ cells: ['مجموعه نمونه'] }] });
  const html = renderToStaticMarkup(React.createElement(RichTextRenderer, { document: doc }));
  assert.match(html, /<tbody>/);
  assert.match(html, /colSpan="2" rowSpan="2"/i);
});

test('article JSON-LD derives FAQ and LocalBusiness data from inline content', () => {
  const seo = load('src/features/seo/article-seo.ts', {
    '@/features/content/lib/article-content': content,
    '@/features/content/lib/public-paths': { articlePath: slug => `/${slug}/` },
  });
  const article = { title: 'مقاله', slug: 'example', excerpt: 'خلاصه', bodyBlocks: blocks, faqs: [], schemaType: 'ARTICLE', author: {}, tags: [], businesses: [{ business: { id: 'business-1', slug: 'example', name: 'کسب‌وکار نمونه', phone: '09121234567', city: 'شیراز' } }] };
  const graph = seo.buildArticleStructuredData(article, undefined, 'https://iran-plaza.ir')['@graph'];
  assert.equal(graph.find(item => item['@type'] === 'FAQPage').mainEntity[0].name, 'پرسش متداول چیست؟');
  assert.equal(graph.find(item => item['@type'] === 'BlogPosting').mentions[0].name, 'کسب‌وکار نمونه');
  assert.ok(!graph.some(item => item['@type'] === 'ItemList'));
  const listing = seo.buildArticleStructuredData({ ...article, schemaType: 'LISTING' }, undefined, 'https://iran-plaza.ir')['@graph'].find(item => item['@type'] === 'ItemList');
  assert.equal(listing.name, 'منتخب‌ها');
  assert.equal(listing.itemListElement[0].item['@type'], 'LocalBusiness');
  assert.equal(listing.itemListElement[0].item.name, 'کسب‌وکار نمونه');
});
