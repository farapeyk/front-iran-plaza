const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const read = relative => fs.readFileSync(path.join(__dirname, '..', relative), 'utf8');

test('article business list owns its responsive desktop and mobile presentation', () => {
  const component = read('src/features/content/components/article-business-list.tsx');
  const styles = read('src/features/content/components/article-business-list.module.css');

  assert.match(component, /data-slot="article-business-list"/);
  assert.match(component, /data-slot="article-business-card"/);
  assert.match(styles, /grid-template-columns:\s*37% 33% 30%/);
  assert.match(styles, /@media \(width <= 850px\)/);
  assert.match(styles, /grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
});

test('article business list uses live actions and intentionally omits ads', () => {
  const component = read('src/features/content/components/article-business-list.tsx');

  assert.match(component, /href=\{`tel:\$\{phone\}`\}/);
  assert.match(component, /aria-disabled="true"/);
  assert.match(component, /مشاهده پروفایل/);
  assert.doesNotMatch(component, /\bAds\b|business\.ad\b/);
});
