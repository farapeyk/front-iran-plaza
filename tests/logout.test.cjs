const { test } = require('node:test');
const assert = require('node:assert/strict');
const { load } = require('./helpers.cjs');

test('logout clears local cookies before best-effort backend revocation', async () => {
  const events = [];
  const originalFetch = global.fetch;
  global.fetch = async (url, options) => {
    events.push(['fetch', url, options]);
    throw new Error('backend unavailable');
  };

  try {
    const { endAuthSession } = load('src/lib/auth/logout.ts', {
      '@/lib/auth/cookies': {
        getAccessTokenCookie: async () => 'access-token',
        clearAuthCookies: async () => events.push(['clear']),
      },
      '@/lib/api/backend-url': { getBackendUrl: path => 'http://backend.invalid' + path },
    });

    await endAuthSession();
    assert.equal(events[0][0], 'clear');
    assert.equal(events[1][0], 'fetch');
    assert.equal(events[1][1], 'http://backend.invalid/api/auth/logout');
    assert.equal(events[1][2].headers.Authorization, 'Bearer access-token');
    assert.ok(events[1][2].signal instanceof AbortSignal);
  } finally {
    global.fetch = originalFetch;
  }
});

test('logout actions clear the session and redirect each role to its login page', async () => {
  for (const [file, actionName, destination] of [
    ['src/features/auth/actions/logout.action.ts', 'logoutAction', '/login'],
    ['src/features/admin/actions/admin-auth.action.ts', 'adminLogoutAction', '/admin/login'],
  ]) {
    let ended = false;
    const action = load(file, {
      '@/lib/auth/logout': { endAuthSession: async () => { ended = true; } },
      'next/navigation': { redirect: path => { throw new Error('REDIRECT:' + path); } },
      '@/lib/auth/validate-auth-response': { validateAuthResponse: async value => value },
      '@/lib/auth/roles': { isAdminUser: () => true },
      '@/lib/auth/cookies': { setAuthCookies: async () => {} },
      '@/lib/api/backend-url': { getBackendUrl: () => '' },
    });
    await assert.rejects(action[actionName](), { message: 'REDIRECT:' + destination });
    assert.equal(ended, true);
  }
});
