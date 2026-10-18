const { test } = require('node:test');
const assert = require('node:assert/strict');
const { load } = require('./helpers.cjs');

const {
  ARTICLE_EXCERPT_MAX_LENGTH,
  compactPaginationItems,
  displayArticleExcerpt,
  withoutLegacyArticleWidgets,
} = load('src/features/content/lib/article-content.ts');

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
