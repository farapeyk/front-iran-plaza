const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const read = path => fs.readFileSync(path, 'utf8');

test('public VIP UI uses real contract fields and active listing filters', () => {
  const listing = read('src/design/pages/search.tsx');
  const profile = read('src/design/pages/business-live.tsx');
  const cardMapper = read('src/design/api/business.ts');
  assert.match(listing, /vipOnly:query\.get\('vipOnly'\)==='true'/);
  assert.match(listing, /hasMedia:query\.get\('hasMedia'\)==='true'/);
  assert.doesNotMatch(listing, /aria-label="فقط VIP ها" disabled/);
  assert.match(profile, /planType==='VIP'.*planExpiryDate/s);
  assert.match(profile, /activeVip&&<VipBadge/);
  assert.match(cardMapper, /item\.planType === 'VIP'.*planExpiryDate/s);
});

test('VIP administration is manual and exposes every configurable entitlement', () => {
  const manager = read('src/features/admin/components/plan-manager.tsx');
  const billing = read('src/design/pages/billing-live.tsx');
  for (const feature of ['map', 'introVideo', 'branches', 'workingHours', 'installments', 'socialMedia', 'customFeatures', 'analytics']) {
    assert.match(manager, new RegExp(`\\["${feature}"`));
  }
  for (const limit of ['galleryLimit', 'productLimit', 'serviceLimit', 'discountLimit']) assert.match(manager, new RegExp(limit));
  assert.match(manager, /durationDays: 30/);
  assert.doesNotMatch(billing, /beginPaymentAction|subscriptionControllerStartFreeTrial/);
  assert.match(billing, /توسط ادمین/);
});
