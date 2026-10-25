const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { load } = require('./helpers.cjs');

test('user deletion action sends only a normalized reason with DELETE and revalidates the list', async () => {
  const calls = [];
  const revalidated = [];
  const { deleteUserAction } = load('src/features/admin/actions/users.action.ts', {
    '@/lib/api/action-fetch': {
      actionFetch: async (url, options) => {
        calls.push({ url, options });
        return new Response(null, { status: 204 });
      },
    },
    '@/lib/auth/action-access-token': { getActionAccessToken: async () => 'access-token' },
    'next/cache': { revalidatePath: value => revalidated.push(value) },
  });
  const previous = process.env.BACKEND_INTERNAL_URL;
  process.env.BACKEND_INTERNAL_URL = 'http://backend.internal';
  try {
    const result = await deleteUserAction('user_1', '  درخواست پشتیبانی  ');
    assert.deepEqual(result, { success: true });
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, 'http://backend.internal/api/admin/users/user_1');
    assert.equal(calls[0].options.method, 'DELETE');
    assert.deepEqual(JSON.parse(calls[0].options.body), { reason: 'درخواست پشتیبانی' });
    assert.deepEqual(revalidated, ['/admin/users']);
  } finally {
    if (previous === undefined) delete process.env.BACKEND_INTERNAL_URL;
    else process.env.BACKEND_INTERNAL_URL = previous;
  }
});

test('user editing action normalizes optional identity values, patches the user, and revalidates both views', async () => {
  const calls = [];
  const revalidated = [];
  const { updateUserAction } = load('src/features/admin/actions/users.action.ts', {
    '@/lib/api/action-fetch': {
      actionFetch: async (url, options) => {
        calls.push({ url, options });
        return Response.json({ id: 'user_1' });
      },
    },
    '@/lib/auth/action-access-token': { getActionAccessToken: async () => 'access-token' },
    'next/cache': { revalidatePath: value => revalidated.push(value) },
  });
  const previous = process.env.BACKEND_INTERNAL_URL;
  process.env.BACKEND_INTERNAL_URL = 'http://backend.internal';
  try {
    const result = await updateUserAction('user_1', {
      phone: ' 09121234567 ',
      fullName: '  کاربر ویرایش‌شده  ',
      email: ' ',
      nationalCode: ' 1234567890 ',
      userType: 'BUSINESS_OWNER',
    });
    assert.deepEqual(result, { success: true });
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, 'http://backend.internal/api/admin/users/user_1');
    assert.equal(calls[0].options.method, 'PATCH');
    assert.deepEqual(JSON.parse(calls[0].options.body), {
      phone: '09121234567',
      fullName: 'کاربر ویرایش‌شده',
      nationalCode: '1234567890',
      userType: 'BUSINESS_OWNER',
    });
    assert.deepEqual(revalidated, ['/admin/users/user_1', '/admin/users']);
  } finally {
    if (previous === undefined) delete process.env.BACKEND_INTERNAL_URL;
    else process.env.BACKEND_INTERNAL_URL = previous;
  }
});

test('user deletion mutation validation rejects invalid ids, reasons, and extra fields', () => {
  const { validateMutation } = load('src/lib/api/mutation-validation.ts');
  assert.equal(validateMutation('/api/admin/users/user_1', 'DELETE', { reason: 'درخواست معتبر' }), null);
  assert.ok(validateMutation('/api/admin/users/user_1', 'DELETE', { reason: 'کم' }));
  assert.ok(validateMutation('/api/admin/users/user_1', 'DELETE', { reason: 'درخواست معتبر', hardDelete: true }));
  assert.ok(validateMutation('/api/admin/users/../../target', 'DELETE', { reason: 'درخواست معتبر' }));
});

test('user editing mutation validation accepts the complete DTO and rejects malformed or extra fields', () => {
  const { validateMutation } = load('src/lib/api/mutation-validation.ts');
  const valid = { phone: '09121234567', fullName: 'کاربر معتبر', nationalCode: '1234567890', userType: 'CUSTOMER' };
  assert.equal(validateMutation('/api/admin/users/user_1', 'PATCH', valid), null);
  assert.ok(validateMutation('/api/admin/users/user_1', 'PATCH', { ...valid, phone: '123' }));
  assert.ok(validateMutation('/api/admin/users/user_1', 'PATCH', { ...valid, userType: 'ROOT' }));
  assert.ok(validateMutation('/api/admin/users/user_1', 'PATCH', { ...valid, password: 'unexpected' }));
});

test('delete control is limited to another user viewed by a super-admin', () => {
  const page = fs.readFileSync(path.join(__dirname, '../src/app/admin/(panel)/users/[id]/page.tsx'), 'utf8');
  assert.match(page, /currentUser\?\.userType === "SUPER_ADMIN"/);
  assert.match(page, /currentUser\.id !== user\.id/);
  assert.match(page, /<UserDeleteAction/);
});

test('edit and full-delete controls are limited to super-admins and visible from the users list', () => {
  const detail = fs.readFileSync(path.join(__dirname, '../src/app/admin/(panel)/users/[id]/page.tsx'), 'utf8');
  const list = fs.readFileSync(path.join(__dirname, '../src/app/admin/(panel)/users/page.tsx'), 'utf8');
  assert.match(detail, /currentUser\?\.userType === "SUPER_ADMIN"/);
  assert.match(detail, /<UserEditForm/);
  assert.match(list, /#edit-user/);
  assert.match(list, /#delete-user/);
  assert.match(list, /حذف کامل/);
});
