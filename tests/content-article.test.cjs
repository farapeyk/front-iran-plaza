const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { load } = require('./helpers.cjs');

const {
  ARTICLE_EXCERPT_MAX_LENGTH,
  compactPaginationItems,
  displayArticleExcerpt,
  withoutDuplicateLeadingExcerpt,
  withoutLegacyArticleWidgets,
} = load('src/features/content/lib/article-content.ts');
const { canEditPublicArticle, editorArticleToPreview } = load('src/features/content/lib/article-preview.ts');
const { articlePreviewPath } = load('src/features/content/lib/public-paths.ts');

test('legacy WordPress TOC and rating blocks are hidden while article content remains', () => {
  const blocks = [
    { id: 'wp-1', type: 'paragraph', text: 'در این مطلب می خوانیم :' },
    { id: 'wp-2', type: 'paragraph', text: 'Toggle' },
    { id: 'wp-3', type: 'paragraph', text: 'جدول مقایسه مراکزبهترین آموزشگاه تدوین فیلمرتبه 1: استودیو هنری' },
    { id: 'wp-4', type: 'paragraph', text: '5/5 - (2 امتیاز)' },
    { id: 'intro-1', type: 'paragraph', text: 'پاراگراف اول مقدمه کامل است.' },
    { id: 'intro-2', type: 'paragraph', text: 'پاراگراف دوم مقدمه کامل است.' },
    { id: 'heading-1', type: 'heading', text: 'جدول مقایسه مراکز', level: 2 },
    { id: 'heading-2', type: 'heading', text: 'بهترین آموزشگاه تدوین فیلم', level: 2 },
    { id: 'heading-3', type: 'heading', text: 'رتبه 1: استودیو هنری', level: 3 },
  ];

  const visible = withoutLegacyArticleWidgets(blocks);
  assert.deepEqual(visible.map(block => block.id), ['intro-1', 'intro-2', 'heading-1', 'heading-2', 'heading-3']);
});

test('a stored read-more snippet is replaced with the complete imported introduction', () => {
  const blocks = [
    { id: 'intro-1', type: 'paragraph', text: 'پاراگراف اول مقدمه کامل است.' },
    { id: 'intro-2', type: 'paragraph', text: 'پاراگراف دوم مقدمه کامل است.' },
    { id: 'body', type: 'heading', text: 'ادامه مقاله', level: 2 },
  ];

  assert.equal(
    displayArticleExcerpt('پاراگراف اول … ادامه مطلب', blocks),
    'پاراگراف اول مقدمه کامل است.\n\nپاراگراف دوم مقدمه کامل است.',
  );
  assert.equal(displayArticleExcerpt('خلاصه دستی و کامل مقاله', blocks), 'خلاصه دستی و کامل مقاله');
  assert.equal(ARTICLE_EXCERPT_MAX_LENGTH, 5000);
});

test('an imported introduction rendered as the excerpt is removed once from the leading body', () => {
  const introduction = 'ناخن‌‌های مرتب و سالم همیشه جلب توجه‌ کرده اند و این متن مقدمه مقاله است.';
  const blocks = [
    { id: 'intro', type: 'paragraph', text: introduction },
    { id: 'heading', type: 'heading', text: 'بهترین آموزشگاه‌ها', level: 2 },
    { id: 'body', type: 'paragraph', text: 'ادامه مقاله' },
  ];

  assert.deepEqual(
    withoutDuplicateLeadingExcerpt(introduction, blocks).map(block => block.id),
    ['heading', 'body'],
  );
  assert.equal(withoutDuplicateLeadingExcerpt('خلاصه مستقل مقاله', blocks), blocks);
});

test('all consecutive introduction paragraphs are removed when together they exactly match the excerpt', () => {
  const blocks = [
    { id: 'intro-1', type: 'paragraph', text: 'پاراگراف اول مقدمه.' },
    { id: 'intro-2', type: 'paragraph', text: 'پاراگراف دوم مقدمه.' },
    { id: 'heading', type: 'heading', text: 'ادامه مقاله', level: 2 },
  ];

  assert.deepEqual(
    withoutDuplicateLeadingExcerpt('پاراگراف اول مقدمه.\n\nپاراگراف دوم مقدمه.', blocks).map(block => block.id),
    ['heading'],
  );
});

test('article pagination stays compact across long archives', () => {
  assert.deepEqual(compactPaginationItems(3, 6), [1, 2, 3, 4, 5, 6]);
  assert.deepEqual(compactPaginationItems(1, 20), [1, 2, 3, 4, 5, 'ellipsis-end', 20]);
  assert.deepEqual(compactPaginationItems(10, 20), [1, 'ellipsis-start', 9, 10, 11, 'ellipsis-end', 20]);
  assert.deepEqual(compactPaginationItems(20, 20), [1, 'ellipsis-start', 16, 17, 18, 19, 20]);
});

test('article pagination clamps invalid page boundaries', () => {
  assert.deepEqual(compactPaginationItems(0, 20), compactPaginationItems(1, 20));
  assert.deepEqual(compactPaginationItems(99, 20), compactPaginationItems(20, 20));
  assert.deepEqual(compactPaginationItems(Number.NaN, Number.NaN), [1]);
});

test('saved editorial articles can be rendered as private public-layout previews', () => {
  const article = {
    id: 'article-1', slug: 'preview-me', status: 'DRAFT', publishedAt: null,
    updatedAt: '2026-10-28T10:00:00.000Z', author: { id: 'author-1', fullName: 'نویسنده' },
  };
  const preview = editorArticleToPreview(article);
  assert.equal(preview.status, 'PUBLISHED');
  assert.equal(preview.publishedAt, article.updatedAt);
  assert.deepEqual(preview.feedback, []);
  assert.deepEqual(preview.banners, []);
  assert.equal(articlePreviewPath(article.slug, article.id), '/preview-me/?preview=article-1');
});

test('public article edit access matches editorial ownership and publish permission', () => {
  assert.equal(canEditPublicArticle(null, 'author-1'), false);
  assert.equal(canEditPublicArticle({ id: 'author-1', canWrite: true, canPublish: false }, 'author-1'), true);
  assert.equal(canEditPublicArticle({ id: 'author-2', canWrite: true, canPublish: false }, 'author-1'), false);
  assert.equal(canEditPublicArticle({ id: 'manager-1', canWrite: true, canPublish: true }, 'author-1'), true);
});

test('article preview and edit controls are wired to authenticated editorial data', () => {
  const root = path.join(__dirname, '..');
  const publicRoute = fs.readFileSync(path.join(root, 'src/app/(public)/[slug]/page.tsx'), 'utf8');
  const publicPage = fs.readFileSync(path.join(root, 'src/features/content/components/article-public-page.tsx'), 'utf8');
  const editor = fs.readFileSync(path.join(root, 'src/features/content/components/article-editor-form.tsx'), 'utf8');

  assert.match(publicRoute, /getEditorArticle\(previewId, token\)/u);
  assert.match(publicRoute, /backendGet<ContentIdentity>\("\/api\/content\/me", token\)/u);
  assert.match(publicPage, /!preview \? <ArticleFeedbackForm/u);
  assert.match(publicPage, /ویرایش این مقاله/u);
  assert.match(editor, /پیش‌نمایش قالب اصلی/u);
});
