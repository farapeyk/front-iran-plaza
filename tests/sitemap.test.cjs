const { test } = require('node:test');
const assert = require('node:assert/strict');
const { load } = require('./helpers.cjs');

const {
  absoluteSiteUrl,
  renderSitemapIndex,
  renderUrlSet,
  siteOrigin,
} = load('src/features/seo/sitemap-xml.ts');

test('sitemap index uses canonical absolute URLs and escapes XML values', () => {
  assert.equal(siteOrigin('https://iran-plaza.ir/nested?ignored=1'), 'https://iran-plaza.ir');
  assert.equal(absoluteSiteUrl('/post-sitemap.xml', 'https://iran-plaza.ir'), 'https://iran-plaza.ir/post-sitemap.xml');

  const xml = renderSitemapIndex([
    { loc: 'https://iran-plaza.ir/post-sitemap.xml?kind=post&lang=fa', lastModified: '2026-10-18T14:17:45+00:00' },
  ]);
  assert.match(xml, /<sitemapindex xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
  assert.match(xml, /kind=post&amp;lang=fa/);
  assert.match(xml, /<lastmod>2026-10-18T14:17:45\.000Z<\/lastmod>/);
});

test('URL sitemap emits image namespace, images and valid last-modified dates', () => {
  const xml = renderUrlSet([
    {
      loc: 'https://iran-plaza.ir/example/',
      lastModified: '2026-10-18T14:17:45Z',
      images: ['https://iran-plaza.ir/api/backend/files/cover?a=1&b=2'],
    },
    { loc: 'https://iran-plaza.ir/no-date/', lastModified: 'not-a-date' },
  ]);

  assert.match(xml, /xmlns:image="http:\/\/www\.google\.com\/schemas\/sitemap-image\/1\.1"/);
  assert.match(xml, /<image:loc>https:\/\/iran-plaza\.ir\/api\/backend\/files\/cover\?a=1&amp;b=2<\/image:loc>/);
  assert.equal((xml.match(/<lastmod>/g) || []).length, 1);
});

test('robots points crawlers to the sitemap index and allows sitemap images', () => {
  const previous = process.env.SITE_URL;
  process.env.SITE_URL = 'https://iran-plaza.ir';
  try {
    const { default: robots } = load('src/app/robots.ts');
    const result = robots();
    assert.equal(result.sitemap, 'https://iran-plaza.ir/sitemap_index.xml');
    assert.deepEqual(result.rules.allow, ['/', '/api/backend/files/']);
    assert.ok(result.rules.disallow.includes('/api/'));
  } finally {
    if (previous === undefined) delete process.env.SITE_URL;
    else process.env.SITE_URL = previous;
  }
});

test('dynamic sitemap data follows API pagination', async () => {
  const previousUrl = process.env.BACKEND_INTERNAL_URL;
  const previousFetch = global.fetch;
  const calls = [];
  process.env.BACKEND_INTERNAL_URL = 'http://backend.invalid/';
  global.fetch = async url => {
    calls.push(String(url));
    const page = new URL(String(url)).searchParams.get('page');
    const data = page === '1'
      ? [{ id: '1', slug: 'first' }]
      : [{ id: '2', slug: 'second' }];
    return new Response(JSON.stringify({ data, total: 2 }), {
      headers: { 'Content-Type': 'application/json' },
    });
  };

  try {
    const { loadPublishedArticles } = load('src/features/seo/sitemap-data.ts');
    const articles = await loadPublishedArticles();
    assert.deepEqual(articles.map(article => article.slug), ['first', 'second']);
    assert.deepEqual(calls, [
      'http://backend.invalid/api/articles?page=1&limit=50',
      'http://backend.invalid/api/articles?page=2&limit=50',
    ]);
  } finally {
    global.fetch = previousFetch;
    if (previousUrl === undefined) delete process.env.BACKEND_INTERNAL_URL;
    else process.env.BACKEND_INTERNAL_URL = previousUrl;
  }
});
