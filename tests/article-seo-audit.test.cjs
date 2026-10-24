const { test } = require('node:test');
const assert = require('node:assert/strict');
const { load } = require('./helpers.cjs');

const { auditArticleSeo } = load('src/features/content/lib/article-seo-audit.ts');

test('editor SEO audit rewards complete listing data and flags missing listing sources', () => {
  const input = {
    title: 'راهنمای بهترین رستوران شیراز برای انتخاب مطمئن', slug: 'best-restaurants-shiraz',
    excerpt: 'بهترین رستوران شیراز را با مقایسه اطلاعات واقعی، آدرس، خدمات و ویژگی‌های هر مجموعه در این راهنمای کامل و به‌روز انتخاب کنید.',
    seoTitle: 'بهترین رستوران شیراز؛ مقایسه و راهنمای انتخاب',
    seoDescription: 'بهترین رستوران شیراز را با مقایسه اطلاعات واقعی، آدرس، خدمات و ویژگی‌های هر مجموعه در این راهنمای کامل و به‌روز انتخاب کنید.',
    primaryKeyword: 'بهترین رستوران شیراز', coverImageAlt: 'تصویر بهترین رستوران شیراز', robotsIndex: true,
    schemaType: 'LISTING',
    blocks: [{ id: 'list', type: 'business-list', businessIds: ['business-1'], listTitle: 'بهترین‌ها' }, { id: 'intro', type: 'paragraph', text: 'بهترین رستوران شیراز را بررسی می‌کنیم.' }],
  };
  const complete = auditArticleSeo(input);
  assert.ok(complete.score >= 80);
  const missing = auditArticleSeo({ ...input, title: '', slug: '', excerpt: '', seoTitle: '', seoDescription: '', primaryKeyword: '', coverImageAlt: '', blocks: [] });
  assert.ok(missing.score < complete.score);
  assert.equal(missing.checks.find(check => /ItemList/.test(check.label)).passed, false);
});
