const { test } = require('node:test');
const assert = require('node:assert/strict');
const { load } = require('./helpers.cjs');

const {
  ARTICLE_SEARCH_DEBOUNCE_MS,
  ARTICLE_SEARCH_MIN_QUERY_LENGTH,
  ARTICLE_SEARCH_SUGGESTION_LIMIT,
  ArticleSuggestionCache,
  articleSearchSuggestionsUrl,
} = load('src/features/content/lib/article-search.ts');

function suggestion(id) {
  return { id, title: `Article ${id}`, slug: `article-${id}`, excerpt: 'Summary', category: null };
}

test('public article suggestions use one bounded, encoded endpoint request and retain category scope', () => {
  const url = new URL(articleSearchSuggestionsUrl(' طلای زرد ', 'jewelry'), 'https://iran-plaza.test');
  assert.equal(url.pathname, '/api/backend/articles');
  assert.equal(url.searchParams.get('search'), 'طلای زرد');
  assert.equal(url.searchParams.get('category'), 'jewelry');
  assert.equal(url.searchParams.get('page'), '1');
  assert.equal(url.searchParams.get('limit'), String(ARTICLE_SEARCH_SUGGESTION_LIMIT));
  assert.equal(ARTICLE_SEARCH_MIN_QUERY_LENGTH, 2);
  assert.equal(ARTICLE_SEARCH_DEBOUNCE_MS, 400);
});

test('suggestion cache separates categories, caches empty results, refreshes used entries, and stays bounded', () => {
  const cache = new ArticleSuggestionCache();
  cache.set('طلا', undefined, [suggestion('public')]);
  cache.set('طلا', 'jewelry', [suggestion('jewelry')]);
  cache.set('none', undefined, []);

  assert.equal(cache.get('طلا')[0].id, 'public');
  assert.equal(cache.get('طلا', 'jewelry')[0].id, 'jewelry');
  assert.deepEqual(cache.get('none'), []);

  for (let index = 0; index < 101; index += 1) cache.set(`query-${index}`, undefined, []);

  assert.equal(cache.get('طلا'), undefined);
  assert.deepEqual(cache.get('query-100'), []);
});
