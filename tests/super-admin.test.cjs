const { test } = require('node:test');
const assert = require('node:assert/strict');
const { load } = require('./helpers.cjs');

function loadAction(user, requests = [], revalidated = []) {
  return load('src/features/admin/actions/super-admin.action.ts', {
    '@/lib/auth/get-current-user': { getCurrentUser: async () => user },
    '@/features/business/actions/authed-fetch': { authedFetch: async (path, method, body) => {
      requests.push({ path, method, body });
      return { success: true, data: { data: { id: 'user_1', phone: body.phone, fullName: body.fullName } } };
    } },
    'next/cache': { revalidatePath: path => revalidated.push(path) },
  }).createSuperAdminAction;
}

test('super-admin creation re-authorizes the caller before contacting the API', async () => {
  const requests = [];
  const action = loadAction({ userType: 'ADMIN' }, requests);
  const result = await action({ phone: '09121234567', fullName: 'Admin User', password: 'secure-password-123' });
  assert.equal(result.success, false);
  assert.equal(requests.length, 0);
});

test('super-admin creation validates byte length and sends normalized minimal input', async () => {
  const requests = [];
  const revalidated = [];
  const action = loadAction({ userType: 'SUPER_ADMIN' }, requests, revalidated);
  const invalid = await action({ phone: '09121234567', fullName: 'Admin User', password: '😀'.repeat(19) });
  assert.equal(invalid.success, false);
  assert.equal(requests.length, 0);

  const result = await action({ phone: ' 09121234567 ', fullName: '  Admin User  ', password: 'secure-password-123' });
  assert.deepEqual(result, { success: true, user: { id: 'user_1', phone: '09121234567', fullName: 'Admin User' } });
  assert.deepEqual(requests[0], { path: '/api/admin/users/super-admin', method: 'POST', body: { phone: '09121234567', fullName: 'Admin User', password: 'secure-password-123' } });
  assert.deepEqual(revalidated, ['/admin/users']);
});

test('the mutation allowlist accepts only valid super-admin creation payloads', () => {
  const { validateMutation } = load('src/lib/api/mutation-validation.ts');
  const valid = { phone: '09121234567', fullName: 'Admin User', password: 'secure-password-123' };
  assert.equal(validateMutation('/api/admin/users/super-admin', 'POST', valid), null);
  assert.ok(validateMutation('/api/admin/users/super-admin', 'POST', { ...valid, password: '😀'.repeat(19) }));
  assert.ok(validateMutation('/api/admin/users/attacker', 'POST', valid));
  assert.ok(validateMutation('/api/admin/users/super-admin', 'POST', { ...valid, userType: 'SUPER_ADMIN' }));
});
