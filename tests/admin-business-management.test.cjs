const { test } = require('node:test');
const assert = require('node:assert/strict');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { load } = require('./helpers.cjs');

test('manual registration validates category, city, phone and registration source', () => {
  const { validateMutation } = load('src/lib/api/mutation-validation.ts');
  const valid = { ownerPhone: '09120000000', name: 'Manual Shop', phone: '07112345678', categoryIds: ['category'], city: 'Shiraz', registrationType: 'IN_PERSON' };
  assert.equal(validateMutation('/api/admin/businesses', 'POST', valid), null);
  for (const invalid of [{ categoryIds: [] }, { city: '' }, { phone: '12' }, { registrationType: 'USER_SELF' }, { ownerPhone: '12' }]) {
    assert.ok(validateMutation('/api/admin/businesses', 'POST', { ...valid, ...invalid }));
  }
});

test('suspension revalidates admin and owner views only after a successful operation', async () => {
  const paths = [];
  const requests = [];
  let status = 200;
  const actions = load('src/features/admin/actions/moderation.action.ts', {
    '@/lib/auth/action-access-token': { getActionAccessToken: async () => 'admin-token' },
    '@/lib/api/action-fetch': { actionFetch: async (url, init) => { requests.push({ url, init }); return new Response('{}', { status }); } },
    'next/cache': { revalidatePath: (...args) => paths.push(args) },
  });
  assert.deepEqual(await actions.suspendBusinessAction('business', ' Reason '), { success: true });
  assert.equal(JSON.parse(requests[0].init.body).reason, 'Reason');
  assert.ok(paths.some(([path]) => path === '/admin/businesses/business'));
  assert.ok(paths.some(([path]) => path === '/dashboard'));
  assert.ok(paths.some(([path]) => path === '/businesses'));
  paths.length = 0;
  status = 403;
  assert.equal((await actions.suspendBusinessAction('business', 'Reason')).success, false);
  assert.equal(paths.length, 0);
});

test('the owner notification page accepts the API data wrapper and repository items shape', async () => {
  const notification = { id: 'notification', title: 'Suspended', message: 'Reason', isRead: false };
  let response = { data: [notification], total: 1 };
  const Page = load('src/app/(dashboard)/dashboard/notifications/page.tsx', {
    '@/lib/auth/cookies': { getAccessTokenCookie: async () => 'owner-token' },
    '@/lib/api/backend-get': { backendGet: async () => response },
    '@/features/notifications/components/notification-row': { NotificationRow: ({ notification: item }) => React.createElement('p', null, item.title, ': ', item.message) },
    '@/design/components/dashboard-account-layout': { DashboardAccountLayout: ({ children }) => children },
  }).default;
  assert.match(renderToStaticMarkup(await Page()), /Suspended: Reason/);
  response = { items: [notification], total: 1 };
  assert.match(renderToStaticMarkup(await Page()), /Suspended: Reason/);
});

test('all suspended businesses show their reason in the owner account layout', async () => {
  const Layout = load('src/app/(dashboard)/layout.tsx', {
    '@/lib/auth/get-current-user': { getCurrentUser: async () => ({ userType: 'BUSINESS_OWNER' }) },
    '@/design/api/generated/server': { businessControllerGetMine: async () => [
      { id: 'approved', name: 'Public shop', status: 'APPROVED' },
      { id: 'suspended', name: 'Hidden shop', status: 'SUSPENDED', suspendedReason: 'Owner visible reason' },
    ] },
    '@/design/provider': { DesignProvider: ({ children }) => children },
    'next/navigation': { redirect: () => { throw new Error('unexpected redirect'); } },
  }).default;
  const html = renderToStaticMarkup(await Layout({ children: 'Dashboard' }));
  assert.match(html, /role="alert"/);
  assert.match(html, /Hidden shop/);
  assert.match(html, /Owner visible reason/);
  assert.doesNotMatch(html, /Public shop/);
});

test('manual registration preserves the new business when a separate plan grant fails', async () => {
  const calls = [];
  const { createManualBusinessAction } = load('src/features/admin/actions/manual-business.action.ts', {
    '@/features/business/actions/authed-fetch': { authedFetch: async (...args) => {
      calls.push(args);
      return calls.length === 1 ? { success: true, data: { id: 'created-business' } } : { success: false, message: 'Plan unavailable' };
    } },
  });
  const result = await createManualBusinessAction({ categoryIds: ['category'], city: 'Shiraz' }, 'plan');
  assert.equal(result.success, true);
  assert.equal(result.businessId, 'created-business');
  assert.match(result.planWarning, /Plan unavailable/);
  assert.equal(calls.length, 2);
});
