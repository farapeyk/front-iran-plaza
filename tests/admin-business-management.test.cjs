const { test } = require('node:test');
const assert = require('node:assert/strict');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { load } = require('./helpers.cjs');

test('admin business list sends normalized search filters to the paginated API', async () => {
  const requests = [];
  const list = load('src/features/admin/lib/get-business-page.ts', {
    '@/lib/api/backend-get': { backendGet: async (url, token) => {
      requests.push({ url, token });
      return { data: [], total: 0 };
    } },
  });

  assert.equal(list.businessSearch('  بازار  '), 'بازار');
  assert.equal(list.businessSearch(['invalid']), '');
  assert.equal(list.businessStatus('APPROVED'), 'APPROVED');
  assert.equal(list.businessStatus('UNKNOWN'), undefined);
  assert.equal(list.businessRegistrationType('TELEPHONE'), 'TELEPHONE');
  assert.equal(list.businessRegistrationType('ADMIN_MANUAL'), 'ADMIN_MANUAL');
  assert.equal(list.businessRegistrationType('UNKNOWN'), undefined);

  await list.getBusinessPage('admin-token', 2, {
    search: 'بازار', status: 'PENDING', registrationType: 'IN_PERSON',
  });
  assert.deepEqual(requests, [{
    token: 'admin-token',
    url: '/api/businesses/admin?skip=20&take=20&status=PENDING&search=%D8%A8%D8%A7%D8%B2%D8%A7%D8%B1&registrationType=IN_PERSON',
  }]);
});

test('admin business filter form and pagination preserve active filters', () => {
  const Form = ({ action, children, ...props }) => React.createElement('form', { action, ...props }, children);
  const Link = ({ href, children, ...props }) => React.createElement('a', { href, ...props }, children);
  const { BusinessListFilters } = load('src/features/admin/components/business-list-filters.tsx', {
    'next/form': { __esModule: true, default: Form },
    'next/link': { __esModule: true, default: Link },
  });
  const { Pagination } = load('src/components/pagination.tsx', {
    'next/link': { __esModule: true, default: Link },
  });

  const form = renderToStaticMarkup(React.createElement(BusinessListFilters, {
    action: '/admin/businesses', search: 'بازار', status: 'PENDING', registrationType: 'IN_PERSON', showStatus: true,
  }));
  assert.match(form, /name="search"/);
  assert.match(form, /نام یا شماره تماس کسب‌وکار/);
  assert.match(form, /name="status"/);
  assert.match(form, /name="registrationType"/);
  assert.match(form, /پاک‌کردن/);

  const pagination = renderToStaticMarkup(React.createElement(Pagination, {
    base: '/admin/businesses', page: 2, total: 60, take: 20,
    query: { search: 'بازار', status: 'PENDING', registrationType: 'IN_PERSON' },
  }));
  assert.match(pagination, /search=%D8%A8%D8%A7%D8%B2%D8%A7%D8%B1&amp;status=PENDING&amp;registrationType=IN_PERSON&amp;page=1/);
  assert.match(pagination, /page=3/);
});

test('rejected reviews can return to pending moderation', async () => {
  const requests = [];
  const paths = [];
  const actions = load('src/features/admin/actions/reviews.action.ts', {
    '@/features/business/actions/authed-fetch': { authedFetch: async (...args) => { requests.push(args); return { success: true }; } },
    'next/cache': { revalidatePath: path => paths.push(path) },
  });
  await actions.updateReviewStatusAction('review-1', 'PENDING');
  assert.deepEqual(requests[0], ['/api/admin/reviews/review-1', 'PATCH', { status: 'PENDING' }]);
  assert.deepEqual(paths, ['/admin/reviews']);

  const { ReviewRow } = load('src/features/admin/components/review-row.tsx', {
    '@/features/admin/actions/reviews.action': actions,
    'lucide-react': { Star: () => React.createElement('span') },
    sonner: { toast: { success() {}, error() {} } },
  });
  const html = renderToStaticMarkup(React.createElement(ReviewRow, { review: {
    id: 'review-1', rating: 3, comment: 'متن نظر', status: 'REJECTED', createdAt: '',
    business: { id: 'business-1', name: 'کسب‌وکار' }, user: { fullName: 'کاربر', phone: '09120000000' },
  } }));
  assert.match(html, /بازگشت به در انتظار/);
});

test('working-hours editor renders ending time on the right before starting time in RTL grids', () => {
  const source = require('node:fs').readFileSync(require('node:path').join(__dirname, '../src/features/business/components/profile/working-hours-form.tsx'), 'utf8');
  assert.ok(source.indexOf('پایان شیفت اول') < source.indexOf('شروع شیفت اول'));
  assert.ok(source.indexOf('پایان شیفت دوم') < source.indexOf('شروع شیفت دوم'));
});

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
