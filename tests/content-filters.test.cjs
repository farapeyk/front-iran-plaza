const { test } = require('node:test');
const assert = require('node:assert/strict');
const { load } = require('./helpers.cjs');

const result = {
  data: [{
    id: 'article_1', title: 'مقاله آزمایشی', slug: 'sample-article', excerpt: 'خلاصه', status: 'DRAFT',
    revision: 1, coverImageId: null, publishedAt: null, updatedAt: '2026-10-18T08:00:00.000Z',
    author: { id: 'user_1', fullName: 'نویسنده' }, category: null,
  }],
  total: 45,
  page: 2,
  limit: 20,
};

function textContent(node) {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textContent).join('');
  if (node?.props) return textContent(node.props.children);
  return '';
}

function linksIn(node, found = []) {
  if (Array.isArray(node)) {
    node.forEach(child => linksIn(child, found));
  } else if (node?.props) {
    if (typeof node.props.href === 'string') {
      found.push({ href: node.props.href, label: textContent(node.props.children), current: node.props['aria-current'] });
    }
    linksIn(node.props.children, found);
  }
  return found;
}

test('content workspace exposes distinct draft/published filters and keeps the active filter during paging', async () => {
  const requests = [];
  const page = load('src/app/content/page.tsx', {
    'next/link': 'a',
    '@/lib/api/backend-get': { backendGet: async url => { requests.push(url); return url === '/api/content/categories' ? [] : result; } },
    '@/lib/auth/cookies': { getAccessTokenCookie: async () => 'token' },
  }).default;

  const tree = await page({ searchParams: Promise.resolve({ page: '2', status: 'DRAFT', q: 'نمونه' }) });
  const links = linksIn(tree);

  assert.equal(requests[0], '/api/content/articles?page=2&limit=20&sort=newest&status=DRAFT&search=%D9%86%D9%85%D9%88%D9%86%D9%87');
  assert.deepEqual(
    links.filter(link => ['همه', 'پیش‌نویس', 'منتشرشده'].includes(link.label)),
    [
      { href: '/content?q=%D9%86%D9%85%D9%88%D9%86%D9%87', label: 'همه', current: undefined },
      { href: '/content?status=DRAFT&q=%D9%86%D9%85%D9%88%D9%86%D9%87', label: 'پیش‌نویس', current: 'page' },
      { href: '/content?status=PUBLISHED&q=%D9%86%D9%85%D9%88%D9%86%D9%87', label: 'منتشرشده', current: undefined },
    ],
  );
  assert.ok(links.some(link => link.label === 'صفحه قبل' && link.href.includes('status=DRAFT')));
  assert.ok(links.some(link => link.label === 'صفحه بعد' && link.href.includes('page=3') && link.href.includes('status=DRAFT')));
});

test('content workspace does not forward an unknown article status to the API', async () => {
  const requests = [];
  const page = load('src/app/content/page.tsx', {
    'next/link': 'a',
    '@/lib/api/backend-get': { backendGet: async url => { requests.push(url); return url === '/api/content/categories' ? [] : { ...result, page: 1, total: 1 }; } },
    '@/lib/auth/cookies': { getAccessTokenCookie: async () => 'token' },
  }).default;

  await page({ searchParams: Promise.resolve({ status: 'NOT_A_STATUS' }) });

  assert.equal(requests[0], '/api/content/articles?page=1&limit=20&sort=newest');
});
