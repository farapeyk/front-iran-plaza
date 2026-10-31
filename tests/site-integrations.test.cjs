const { test } = require('node:test');
const assert = require('node:assert/strict');
const { load } = require('./helpers.cjs');

const integrations = load('src/features/analytics/site-integrations.ts');

test('site integrations remain disabled when their environment values are absent', () => {
  const result = integrations.readSiteIntegrations({});
  assert.deepEqual(result, {
    ga4MeasurementId: undefined,
    clarityProjectId: undefined,
    yandexVerification: undefined,
    baiduVerification: undefined,
  });
  assert.equal(integrations.buildSiteVerification(result), undefined);
});

test('site integration values are trimmed and mapped to webmaster metadata', () => {
  const result = integrations.readSiteIntegrations({
    NEXT_PUBLIC_GA4_MEASUREMENT_ID: ' G-ABC1234567 ',
    NEXT_PUBLIC_CLARITY_PROJECT_ID: ' clarity123 ',
    NEXT_PUBLIC_YANDEX_SITE_VERIFICATION: ' yandex_token-123 ',
    NEXT_PUBLIC_BAIDU_SITE_VERIFICATION: ' codeva-baidu_123 ',
  });

  assert.deepEqual(result, {
    ga4MeasurementId: 'G-ABC1234567',
    clarityProjectId: 'clarity123',
    yandexVerification: 'yandex_token-123',
    baiduVerification: 'codeva-baidu_123',
  });
  assert.deepEqual(integrations.buildSiteVerification(result), {
    yandex: 'yandex_token-123',
    other: { 'baidu-site-verification': 'codeva-baidu_123' },
  });
});

test('invalid integration values fail before they can reach generated scripts or metadata', () => {
  for (const [name, value] of [
    ['NEXT_PUBLIC_GA4_MEASUREMENT_ID', 'UA-legacy-id'],
    ['NEXT_PUBLIC_CLARITY_PROJECT_ID', 'bad<script>'],
    ['NEXT_PUBLIC_YANDEX_SITE_VERIFICATION', 'bad token'],
    ['NEXT_PUBLIC_BAIDU_SITE_VERIFICATION', '" onload="alert(1)'],
  ]) {
    assert.throws(() => integrations.readSiteIntegrations({ [name]: value }), new RegExp(name));
  }
});
