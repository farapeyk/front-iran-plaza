const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

function load(relative, mocks = {}) {
  const source = fs.readFileSync(path.join(__dirname, '..', relative), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2021 } });
  const loadedModule = { exports: {} };
  new Function('require', 'module', 'exports', compiled.outputText)(name => name in mocks ? mocks[name] : require(name), loadedModule, loadedModule.exports);
  return loadedModule.exports;
}

test('eleven ordered steps lead to the complete editor', () => {
  const { PROFILE_STEPS, profileStepUrl } = load('src/features/business/lib/onboarding-steps.ts');
  assert.deepEqual(PROFILE_STEPS.map(step => step.key), ['basic', 'contact', 'features', 'address', 'gallery', 'social', 'services', 'products', 'about', 'hours', 'installment']);
  assert.equal(PROFILE_STEPS.filter(step => step.important).length, 6);
  assert.equal(profileStepUrl(0), '/dashboard/business/profile/basic');
  assert.equal(profileStepUrl(11), '/dashboard/business/profile');
});

test('category options show parent paths and tolerate orphaned/cyclic data', () => {
  const { categoryOptions } = load('src/features/business/lib/category-options.ts');
  const options = categoryOptions([{ id: 'root', name: 'خوراک' }, { id: 'child', name: 'کافه', parentId: 'root' }, { id: 'orphan', name: 'سایر', parentId: 'missing' }, { id: 'cycle', name: 'حلقه', parentId: 'cycle' }]);
  assert.equal(options.find(item => item.id === 'child').label, 'خوراک / کافه');
  assert.equal(options.length, 4);
});

test('registration sends the selected category to the backend', async () => {
  const originalFetch = global.fetch;
  const originalUrl = process.env.BACKEND_INTERNAL_URL;
  process.env.BACKEND_INTERNAL_URL = 'http://test.invalid';
  let payload;
  global.fetch = async (_url, options) => {
    payload = JSON.parse(options.body);
    return { ok: true, json: async () => ({ id: 'created-business' }) };
  };
  try {
    const { createBusinessAction } = load('src/features/business/actions/create-business.action.ts', {
      '@/features/business/schemas/business-info.schema': load('src/features/business/schemas/business-info.schema.ts'),
      '@/lib/api/error-message': { extractErrorMessage: () => 'error' },
      '@/lib/api/action-fetch': { actionFetch: (...args) => global.fetch(...args) },
      '@/lib/auth/action-access-token': { getActionAccessToken: async () => 'test-token' },
    });
    const result = await createBusinessAction({ name: 'کافه نمونه', phone: '09120000000', categoryId: 'cafe', province: 'فارس', city: 'شیراز' });
    assert.equal(result.success, true);
    assert.deepEqual(payload.categoryIds, ['cafe']);
    assert.equal(payload.city, 'شیراز');
  } finally {
    global.fetch = originalFetch;
    if (originalUrl === undefined) delete process.env.BACKEND_INTERNAL_URL;
    else process.env.BACKEND_INTERNAL_URL = originalUrl;
  }
});
