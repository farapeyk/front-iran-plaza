const { test } = require('node:test');
const assert = require('node:assert/strict');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { load } = require('./helpers.cjs');
const { BackendError } = load('src/lib/api/backend-get.ts');
const id = 'cmsfz4qtl00027msz3yr5z4nl';
const primary = { id, name: 'کسب‌وکار آزمایشی', phone: '09120000000', status: 'PENDING', planType: 'FREE' };

function detailLoader(get) {
  return load('src/features/admin/lib/get-business-detail.ts', { '@/lib/api/backend-get': { backendGet: get, BackendError } });
}

test('missing plans does not turn a valid admin business into a 404', async () => {
  const calls = [];
  const { getAdminBusinessDetail } = detailLoader(async (path, token) => {
    calls.push({ path, token });
    if (path === '/api/businesses/' + id) return primary;
    if (path === '/api/plans') throw new BackendError(404);
    if (path.endsWith('/installment-plan')) return null;
    return [];
  });
  const result = await getAdminBusinessDetail(id, 'admin-token');
  assert.equal(result.business.id, id);
  assert.ok(result.unavailable.includes('plans'));
  assert.deepEqual(result.plans, []);
  assert.ok(calls.every(call => call.token === 'admin-token'));
});

test('primary 404 remains a 404 and does not request ancillary sections', async () => {
  let calls = 0;
  const { getAdminBusinessDetail } = detailLoader(async () => { calls++; throw new BackendError(404); });
  await assert.rejects(() => getAdminBusinessDetail(id, 'admin-token'), error => error instanceof BackendError && error.status === 404);
  assert.equal(calls, 1);
});

test('admin reads pending-business extras directly without requiring an approved public profile', async () => {
  const records = {
    documents: [{ id: 'doc_1', fileId: 'file_1', type: 'NATIONAL_ID_FRONT', status: 'PENDING' }],
    gallery: [{ id: 'gallery_1', fileId: 'file_2' }],
    features: [{ id: 'feature_1', label: 'پارکینگ', isActive: true }],
    branches: [{ id: 'branch_1', title: 'شعبه دوم', address: 'آدرس آزمایشی' }],
    services: [{ id: 'service_1', name: 'خدمت آزمایشی', priceFrom: '1000.00', priceTo: '2000.00', durationMin: 30 }],
    'product-categories': [{ id: 'category_1', name: 'دسته آزمایشی' }],
    products: [{ id: 'product_1', name: 'محصول آزمایشی', price: '2000.00', productCategoryId: 'category_1', discountPercent: 10 }],
    'working-hours': [{ weekday: 'SATURDAY', openTime1: '09:00', closeTime1: '17:00' }],
    'installment-plan': { minDownPaymentPercent: 20, monthlyInterestPercent: '2.5', repaymentPeriodsMonths: [3, 6], guaranteeNote: 'ضمانت آزمایشی', isActive: true },
  };
  const calls = [];
  const { getAdminBusinessDetail } = detailLoader(async path => {
    calls.push(path);
    if (path === '/api/businesses/' + id) return primary;
    if (path === '/api/plans') return [];
    return records[path.split('/').at(-1)];
  });
  const result = await getAdminBusinessDetail(id, 'admin-token');
  assert.equal(result.business.status, 'PENDING');
  assert.equal(result.business.documents[0].id, 'doc_1');
  assert.deepEqual(result.unavailable, []);
  assert.ok(!calls.some(path => path.endsWith('/full')));
  const { BusinessProfileOverview } = load('src/features/admin/components/business-profile-overview.tsx', {
    'next/image': { default: props => React.createElement('img', { src: props.src, alt: props.alt }) },
    '@/features/business/types/business-profile': load('src/features/business/types/business-profile.ts'),
    '@/features/public/components/business-location-map': { BusinessLocationMap: () => React.createElement('div') },
  });
  const html = renderToStaticMarkup(React.createElement(BusinessProfileOverview, { business: result.business, unavailable: result.unavailable }));
  for (const text of ['پارکینگ', 'شعبه دوم', 'خدمت آزمایشی', 'محصول آزمایشی', 'دسته آزمایشی', '09:00', 'ضمانت آزمایشی']) assert.ok(html.includes(text), text);
  assert.ok(html.includes('/api/backend/files/file_2'));
});

test('unavailable extras are marked as failed, but forbidden private data is not silently replaced', async () => {
  const get = async path => {
    if (path === '/api/businesses/' + id) return primary;
    if (path.endsWith('/gallery')) throw new BackendError(503);
    if (path.endsWith('/installment-plan')) return null;
    return [];
  };
  const { getAdminBusinessDetail } = detailLoader(get);
  const result = await getAdminBusinessDetail(id, 'admin-token');
  assert.ok(result.unavailable.includes('gallery'));
  const forbidden = detailLoader(async path => {
    if (path.endsWith('/documents')) throw new BackendError(403);
    return get(path);
  });
  await assert.rejects(() => forbidden.getAdminBusinessDetail(id, 'admin-token'), error => error.status === 403);
});
