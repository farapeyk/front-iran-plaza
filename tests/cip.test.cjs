const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const read = relative => fs.readFileSync(path.join(__dirname, '..', relative), 'utf8');

test('CIP badge keeps the requested black and gold treatment', () => {
  const badge = read('src/design/components/cip-badge.tsx');
  assert.match(badge, /bg-black/);
  assert.match(badge, /text-\[#d4af37\]/);
  assert.match(badge, />\s*CIP\s*</);
});

test('CIP renders independently of VIP on profiles and editorial business lists', () => {
  const card = read('src/design/components/business-list-card.tsx');
  const article = read('src/features/content/components/article-public-page.tsx');
  const profile = read('src/features/public/components/business-profile-summary.tsx');
  assert.ok((card.match(/business\.isCip\s*&&\s*<CipBadge/g) || []).length >= 4);
  assert.match(article, /isCip:\s*business\.isCip/);
  assert.match(profile, /isCip\s*&&\s*<CipBadge/);
});

test('admin CIP control sends an explicit boolean to the dedicated endpoint', () => {
  const action = read('src/features/admin/actions/cip.action.ts');
  const control = read('src/features/admin/components/cip-status-control.tsx');
  assert.match(action, /\/api\/admin\/businesses\/\$\{encodeURIComponent\(businessId\)\}\/cip/);
  assert.match(action, /\{ isCip \}/);
  assert.match(control, /role="switch"/);
  assert.match(control, /aria-checked=\{isCip\}/);
});
