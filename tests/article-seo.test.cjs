const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { load } = require('./helpers.cjs');

const articleContent = load('src/features/content/lib/article-content.ts');
const seo = load('src/features/seo/article-seo.ts', {
  '@/features/content/lib/article-content': articleContent,
  '@/features/content/lib/public-paths': { articlePath: slug => `/${slug}/` },
});
function article() {
  return {
    id: 'article-1',
    title: 'بهترین رستوران‌های شیراز',
    slug: 'best-restaurants-shiraz',
    excerpt: 'راهنمای کامل انتخاب رستوران در شیراز',
    bodyBlocks: [{
      id: 'restaurants',
      type: 'business-list',
      listTitle: 'برگزیده‌های شیراز',
      businessIds: ['business-2', 'business-1'],
    }],
    category: { id: 'category-1', name: 'رستوران‌ها', slug: 'restaurants' },
    coverImageId: 'cover image',
    coverImageAlt: 'تصویر رستوران',
    seoTitle: 'رستوران‌های برتر شیراز',
    seoDescription: 'توضیحات متای مقاله',
    canonicalUrl: null,
    robotsIndex: true,
    robotsFollow: true,
    publishedAt: '2026-10-18T10:00:00+03:30',
    updatedAt: '2026-10-20T12:00:00+03:30',
    author: { fullName: 'نویسنده آزمایشی' },
    faqs: [
      { question: 'پرسش فعال چیست؟', answer: 'این پاسخ فعال است.', isActive: true },
      { question: 'پرسش غیرفعال چیست؟', answer: 'این پاسخ نباید منتشر شود.', isActive: false },
    ],
    businesses: [
      { business: { id: 'business-1', slug: 'first', name: 'اول', description: null, phone: '0711', city: 'شیراز', neighborhood: null, address: null } },
      { business: { id: 'business-2', slug: 'second', name: 'دوم', description: 'توضیح', phone: '0712', city: 'شیراز', neighborhood: 'معالی‌آباد', address: 'خیابان نمونه' } },
    ],
  };
}

test('article metadata emits absolute canonical, Open Graph, Twitter and Googlebot controls', () => {
  const metadata = seo.buildArticleMetadata(article(), 'https://preview.example/base');
  assert.equal(metadata.alternates.canonical, 'https://preview.example/best-restaurants-shiraz/');
  assert.equal(metadata.openGraph.url, metadata.alternates.canonical);
  assert.equal(metadata.openGraph.images[0].url, 'https://preview.example/api/backend/files/cover%20image');
  assert.equal(metadata.twitter.card, 'summary_large_image');
  assert.equal(metadata.twitter.images[0].url, metadata.openGraph.images[0].url);
  assert.equal(metadata.robots.googleBot['max-image-preview'], 'large');
  assert.deepEqual(metadata.authors, [{ name: 'نویسنده آزمایشی' }]);
});
test('article metadata replaces a legacy read-more snippet with the visible introduction', () => {
  const input = article();
  input.seoDescription = null;
  input.excerpt = 'متن ناقص… ادامه مطلب';
  input.bodyBlocks = [{ id: 'intro', type: 'paragraph', text: 'این مقدمه کامل و قابل مشاهده مقاله است.' }];
  assert.equal(
    seo.buildArticleMetadata(input, 'https://iran-plaza.ir').description,
    'این مقدمه کامل و قابل مشاهده مقاله است.',
  );
});
test('article JSON-LD publishes only visible FAQs and preserves each managed list order', () => {
  const data = seo.buildArticleStructuredData(article(), '/category/restaurants/', 'https://iran-plaza.ir');
  const byType = type => data['@graph'].filter(node => node['@type'] === type);
  const posting = byType('BlogPosting')[0];
  assert.equal(posting.image.url, 'https://iran-plaza.ir/api/backend/files/cover%20image');
  assert.equal(posting.articleSection, 'رستوران‌ها');

  const faq = byType('FAQPage')[0];
  assert.equal(faq.mainEntity.length, 1);
  assert.equal(faq.mainEntity[0].name, 'پرسش فعال چیست؟');

  const list = byType('ItemList')[0];
  assert.equal(list.name, 'برگزیده‌های شیراز');
  assert.deepEqual(list.itemListElement.map(item => item.item.name), ['دوم', 'اول']);
  assert.deepEqual(list.itemListElement.map(item => item.position), [1, 2]);
  assert.equal(list.itemListElement[0].item.url, 'https://iran-plaza.ir/businesses/second');
});

test('article collection JSON-LD uses stable absolute URLs and paginated positions', () => {
  const item = article();
  const data = seo.buildArticleListStructuredData([item], 'مقالات', '/articles/?page=2', 13, 'https://iran-plaza.ir');
  assert.equal(data.url, 'https://iran-plaza.ir/articles/?page=2');
  assert.equal(data.itemListElement[0].position, 13);
  assert.equal(data.itemListElement[0].item.url, 'https://iran-plaza.ir/best-restaurants-shiraz/');
});

test('content editor exposes FAQ visibility and ItemList title controls', () => {
  const source = fs.readFileSync(path.join(__dirname, '../src/features/content/components/article-editor-form.tsx'), 'utf8');
  assert.match(source, /isActive: item\.isActive !== false/);
  assert.match(source, /checked=\{faq\.isActive !== false\}/);
  assert.match(source, /block\.listTitle/);
  assert.match(source, /اسکیمای ItemList/);
});

test('frontend mutation boundary accepts only typed FAQ and list SEO controls', () => {
  const { validateMutation } = load('src/lib/api/mutation-validation.ts');
  const payload = {
    title: 'عنوان مقاله',
    slug: 'article-slug',
    excerpt: 'این یک خلاصه معتبر برای مقاله است.',
    bodyBlocks: [{ id: 'list-1', type: 'business-list', listTitle: 'بهترین‌ها', businessIds: ['business-1'] }],
    faqs: [{ question: 'پرسش معتبر چیست؟', answer: 'این پاسخ معتبر و کامل است.', isActive: false }],
  };
  assert.equal(validateMutation('/api/content/articles', 'POST', payload), null);
  assert.match(validateMutation('/api/content/articles', 'POST', {
    ...payload,
    faqs: [{ ...payload.faqs[0], isActive: 'خیر' }],
  }), /قابل انتشار|نوع درست/);
});
