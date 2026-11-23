const { test } = require('node:test');
const assert = require('node:assert/strict');
const { load } = require('./helpers.cjs');

const seo = load('src/features/seo/business-seo.ts', {
  '@/features/seo/article-seo': {
    siteOrigin: () => 'https://iran-plaza.ir',
    absoluteSiteUrl: value => new URL(value, 'https://iran-plaza.ir').href,
  },
});

test('business profile JSON-LD contains LocalBusiness and its breadcrumb from profile data', () => {
  const data = seo.buildBusinessStructuredData({
    slug: 'sample-shop', name: 'فروشگاه نمونه', description: 'توضیح کسب‌وکار', phone: '+982100000000',
    website: null, socialMedia: null, logoId: null, address: 'خیابان نمونه', neighborhood: 'مرکز', city: 'تهران',
    latitude: 35.7, longitude: 51.4,
    workingHours: [{ weekday: 'SATURDAY', openTime1: '09:00', closeTime1: '13:00', openTime2: '16:00', closeTime2: '20:00', isTwoShift: true }],
  });
  const [business, breadcrumb] = data['@graph'];
  assert.equal(business['@type'], 'LocalBusiness');
  assert.equal(business.telephone, '+982100000000');
  assert.equal(business.address.addressLocality, 'تهران');
  assert.equal(business.geo.latitude, 35.7);
  assert.equal(business.openingHoursSpecification.length, 2);
  assert.equal(breadcrumb['@type'], 'BreadcrumbList');
  assert.deepEqual(breadcrumb.itemListElement.map(item => item.position), [1, 2, 3]);
  assert.equal(breadcrumb.itemListElement[2].item, 'https://iran-plaza.ir/businesses/sample-shop');
});
