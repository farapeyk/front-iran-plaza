const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { load } = require('./helpers.cjs');

function memoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
}

test('mobile search history validates, de-duplicates, and caps local entries', () => {
  const { prependSearchHistory, readSearchHistory, SEARCH_HISTORY_KEY } = load('src/design/lib/search-history.ts');
  const storage = memoryStorage({
    [SEARCH_HISTORY_KEY]: JSON.stringify([
      { label: 'ناامن', subtitle: '', icon: 'https://evil.invalid/icon.svg', href: 'javascript:alert(1)' },
      { label: 'رستوران', subtitle: 'جستجوی کسب و کار', icon: '/design/icons/categories.svg', href: '/businesses?search=old' },
    ]),
  });

  assert.equal(readSearchHistory(storage).length, 1);
  for (let index = 0; index < 8; index += 1) {
    prependSearchHistory(storage, {
      label: `جستجو ${index}`,
      subtitle: 'جستجوی کسب و کار',
      icon: '/design/icons/categories.svg',
      href: `/businesses?search=${index}`,
    });
  }
  const history = readSearchHistory(storage);
  assert.equal(history.length, 6);
  assert.equal(history[0].label, 'جستجو 7');
  assert.equal(history.at(-1).label, 'جستجو 2');
});

test('mobile bottom navigation uses visible green icons on its light surface', () => {
  const source = fs.readFileSync(path.join(__dirname, '../src/design/components/bottom-nav.tsx'), 'utf8');
  assert.match(source, /icons\/home\.svg/);
  assert.match(source, /icons\/categories\.svg/);
  assert.doesNotMatch(source, /icons\/(?:home-2|element-3)\.svg/);
});

test('mobile menu exposes a visible close control inside the drawer', () => {
  const source = fs.readFileSync(path.join(__dirname, '../src/design/components/mobile-side-menu.tsx'), 'utf8');
  assert.match(source, /close-x\.svg/);
  assert.match(source, /aria-label="بستن منو"/);
  assert.match(source, /onClick=\{onClose\}/);
});

test('mobile category search does not invent business or subcategory totals', () => {
  const source = fs.readFileSync(path.join(__dirname, '../src/design/pages/search.tsx'), 'utf8');
  assert.doesNotMatch(source, /(?:63|64) کسب و کار/);
  assert.doesNotMatch(source, /\|\|8/);
  assert.match(source, /childCount>0/);
  assert.match(source, /مشاهده کسب‌وکارهای این دسته/);
});

test('business profile separates checked features from tabbed priced services', () => {
  const source = fs.readFileSync(path.join(__dirname, '../src/design/pages/business-live.tsx'), 'utf8');
  assert.match(source, /tick-circle\.svg/);
  assert.match(source, /aria-label="محصولات و خدمات"/);
  assert.match(source, /role="tab"/);
  assert.match(source, /formatServicePrice/);
  assert.match(source, /business-service-card/);
});

test('every public business profile uses the reusable responsive summary panel', () => {
  const page = fs.readFileSync(path.join(__dirname, '../src/design/pages/business-live.tsx'), 'utf8');
  const panel = fs.readFileSync(path.join(__dirname, '../src/features/public/components/business-profile-summary.tsx'), 'utf8');

  assert.match(page, /<BusinessProfileSummary/);
  assert.match(panel, /business-summary-mobile/);
  assert.match(panel, /business-summary-desktop/);
  assert.match(panel, /business\.name/);
  assert.match(panel, /business\.description/);
  assert.doesNotMatch(panel, /businesses\/123/);
});

test('desktop and mobile footer use the linked official Enamad trust seal', () => {
  const source = fs.readFileSync(path.join(__dirname, '../src/design/components/site-footer.tsx'), 'utf8');

  assert.match(source, /const enamadCode = "nvxOEnp57ndUasGvqyFejdrGnRPqExqe"/);
  assert.ok(source.includes('href={`https://trustseal.enamad.ir/?id=752601&Code=${enamadCode}`}'));
  assert.ok(source.includes('src={`https://trustseal.enamad.ir/logo.aspx?id=752601&Code=${enamadCode}`}'));
  assert.match(source, /referrerPolicy="origin"/);
  assert.match(source, /target="_blank"/);
  assert.doesNotMatch(source, /rel=/);
  assert.equal((source.match(/<EnamadSeal \/>/g) ?? []).length, 2);
  assert.doesNotMatch(source, /src=\{enamad\}/);
});
