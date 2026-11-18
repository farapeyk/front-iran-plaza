const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const read = relative => fs.readFileSync(path.join(__dirname, '..', relative), 'utf8');

test('business category URLs use Latin slugs and legacy categoryId links still resolve', () => {
  const route = read('src/app/(public)/businesses/category/[slug]/page.tsx');
  const listing = read('src/design/pages/search.tsx');
  const catalog = read('src/design/api/catalog.ts');

  assert.match(route, /export default BusinessesPage/);
  assert.match(catalog, /\/businesses\/category\/.*encodeURIComponent\(c\.slug\)/);
  assert.match(listing, /categories\.find\(c=>c\.slug===routeCategorySlug\)/);
  assert.match(listing, /categories\.find\(c=>c\.id===params\.get\('categoryId'\)\)/);
  assert.match(listing, /categoryId:categoryId\|\|query\.get\('categoryId'\)/);
  assert.doesNotMatch(listing, /\['city','neighborhood'\] as const/);
});
