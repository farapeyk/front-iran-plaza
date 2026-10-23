const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('review form accepts text without requiring a score and keeps scores optional in the API action', () => {
  const form = fs.readFileSync(path.join(__dirname, '../src/features/public/components/review-form.tsx'), 'utf8');
  const action = fs.readFileSync(path.join(__dirname, '../src/features/public/actions/reviews.action.ts'), 'utf8');
  const livePage = fs.readFileSync(path.join(__dirname, '../src/design/pages/business-live.tsx'), 'utf8');
  const catalog = fs.readFileSync(path.join(__dirname, '../src/design/api/catalog.ts'), 'utf8');

  assert.match(form, /rating === 0 && !comment\.trim\(\)/);
  assert.match(form, /rating: rating \|\| undefined/);
  assert.match(action, /input: \{ rating\?: number; comment\?: string \}/);
  assert.match(livePage, /ratedReviews=reviews\.filter\(review=>review\.rating!=null\)/);
  assert.match(livePage, /r\.rating==null\?'بدون امتیاز'/);
  assert.match(catalog, /businessControllerListPublic\(\{page:1,limit:12,categoryId\}/);
  assert.match(catalog, /item=>item\.id!==excludeBusinessId/);
});
