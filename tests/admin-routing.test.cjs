const { test } = require('node:test');
const assert = require('node:assert/strict');
const { NextRequest } = require('next/server');
const { load } = require('./helpers.cjs');
const roles = load('src/lib/auth/roles.ts');

test('public desktop and mobile navigation use admin panel and manual registration links for admins', () => {
  const React = require('react');
  const { renderToStaticMarkup } = require('react-dom/server');
  const container = ({ children }) => React.createElement('div', null, children);
  const mocks = {
    '@/lib/auth/roles': roles,
    'next/link': { default: ({ children, ...props }) => React.createElement('a', props, children) },
    '@/components/ui/button': { Button: container },
    '@/components/ui/sheet': { Sheet: container, SheetTrigger: container, SheetContent: container, SheetHeader: container, SheetTitle: container },
  };
  const { MobileDrawer } = load('src/features/home/components/mobile-drawer.tsx', mocks);
  const { Navbar } = load('src/features/home/components/navbar.tsx', { ...mocks, './mobile-drawer': { MobileDrawer } });
  const { SiteHeader } = load('src/features/public/components/site-header.tsx', mocks);
  for (const userType of ['ADMIN', 'SUPER_ADMIN', 'CUSTOMER', 'BUSINESS_OWNER']) {
    for (const Component of [Navbar, SiteHeader]) {
      const html = renderToStaticMarkup(React.createElement(Component, { user: { fullName: 'Example', phone: '09120000000', userType } }));
      const admin = roles.isAdminUser(userType);
      assert.ok(html.includes('href="' + (admin ? '/admin' : '/dashboard') + '"'));
      assert.ok(html.includes('href="' + (admin ? '/admin/businesses/new' : '/dashboard/business/new') + '"'));
      if (admin) assert.ok(!html.includes('href="/dashboard'));
    }
  }
});

test('admin sessions bypass ordinary-user pages and login screens without redirect loops', async () => {
  const proxy = load('src/proxy.ts', {
    '@/lib/auth/roles': roles,
    '@/lib/constants/auth': { ACCESS_TOKEN_COOKIE: 'access_token' },
    '@/lib/auth/verify-access-token': { verifyAccessToken: async token => token ? { userType: token } : null },
  }).default;
  const request = (route, role) => proxy(new NextRequest('http://frontend.invalid' + route, {
    headers: role ? { cookie: 'access_token=' + role } : {},
  }));
  for (const role of ['ADMIN', 'SUPER_ADMIN']) {
    for (const route of ['/dashboard', '/dashboard/business/new?step=1', '/dashboard/account', '/complete-profile', '/complete-profile/extra', '/login', '/admin/login']) {
      const response = await request(route, role);
      assert.equal(response.status, 307, role + route);
      assert.equal(response.headers.get('location'), 'http://frontend.invalid/admin');
    }
    for (const route of ['/admin', '/admin/businesses/business_1', '/businesses', '/dashboardish']) {
      assert.equal((await request(route, role)).status, 200, role + route);
    }
  }
  for (const role of ['CUSTOMER', 'BUSINESS_OWNER']) {
    assert.equal((await request('/dashboard', role)).status, 200);
    assert.equal((await request('/complete-profile', role)).status, 200);
    assert.equal((await request('/admin', role)).headers.get('location'), 'http://frontend.invalid/dashboard');
  }
  assert.equal((await request('/login')).status, 200);
  assert.equal((await request('/admin/login')).status, 200);
  assert.ok((await request('/dashboard')).headers.get('location').includes('/api/auth/silent-refresh'));
});

test('OTP and password login send both admin roles straight to admin, including incomplete profiles', async () => {
  const originalFetch = global.fetch;
  let response;
  let writes = 0;
  const mocks = {
    '@/lib/auth/roles': roles,
    '@/lib/auth/validate-auth-response': { validateAuthResponse: async value => value },
    '@/lib/auth/cookies': { setAuthCookies: async () => { writes++; }, clearAuthCookies: async () => {} },
    'next/navigation': { redirect: destination => { throw new Error('REDIRECT:' + destination); } },
    '@/features/auth/schemas/otp.schema': load('src/features/auth/schemas/otp.schema.ts'),
  };
  const { verifyOtpAction } = load('src/features/auth/actions/verify-otp.action.ts', mocks);
  const { adminLoginPasswordAction } = load('src/features/admin/actions/admin-auth.action.ts', mocks);
  global.fetch = async () => Response.json(response);
  try {
    for (const userType of ['ADMIN', 'SUPER_ADMIN', 'CUSTOMER', 'BUSINESS_OWNER']) {
      for (const incomplete of [true, false]) {
        response = { accessToken: 'fixture', refreshToken: 'fixture', isNewUser: incomplete,
          user: { id: 'fixture', phone: '09120000000', userType, fullName: incomplete ? null : 'Example Name' } };
        const destination = roles.isAdminUser(userType) ? '/admin' : incomplete ? '/complete-profile' : '/dashboard';
        await assert.rejects(verifyOtpAction({ phone: '09120000000', code: '12345' }), { message: 'REDIRECT:' + destination });
        const previousWrites = writes;
        if (roles.isAdminUser(userType)) {
          await assert.rejects(adminLoginPasswordAction({ phone: '09120000000', password: 'fixture' }), { message: 'REDIRECT:/admin' });
          assert.equal(writes, previousWrites + 1);
        } else {
          assert.equal((await adminLoginPasswordAction({ phone: '09120000000', password: 'fixture' })).success, false);
          assert.equal(writes, previousWrites);
        }
      }
    }
  } finally { global.fetch = originalFetch; }
});
