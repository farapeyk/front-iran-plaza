const { test } = require('node:test');
const assert = require('node:assert/strict');
const { load } = require('./helpers.cjs');

test('business events use a stable session and fall back from beacon to fetch', async () => {
  const originalWindow = global.window;
  const originalNavigator = Object.getOwnPropertyDescriptor(global, 'navigator');
  const originalFetch = global.fetch;
  const values = new Map();
  const beacons = [];
  const fetches = [];
  try {
    global.window = { sessionStorage: {
      getItem: key => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, value),
    } };
    Object.defineProperty(global, 'navigator', { configurable: true, value: {
      sendBeacon: (url, body) => { beacons.push({ url, body }); return true; },
    } });
    global.fetch = async (url, options) => { fetches.push({ url, options }); return Response.json({ queued: true }); };
    const { trackBusinessEvent } = load('src/features/analytics/business-events.ts');

    trackBusinessEvent('business-1', 'CLICK_PHONE', { placement: 'contact_sheet' });
    assert.equal(beacons[0].url, '/api/backend/tracking/events');
    const first = JSON.parse(await beacons[0].body.text());
    assert.deepEqual({ businessId: first.businessId, type: first.type, metadata: first.metadata },
      { businessId: 'business-1', type: 'CLICK_PHONE', metadata: { placement: 'contact_sheet' } });
    assert.ok(first.sessionId);
    assert.equal(fetches.length, 0);

    Object.defineProperty(global, 'navigator', { configurable: true, value: { sendBeacon: () => false } });
    trackBusinessEvent('business-1', 'SHARE_BUSINESS');
    assert.equal(fetches[0].url, '/api/backend/tracking/events');
    assert.equal(fetches[0].options.keepalive, true);
    assert.equal(fetches[0].options.credentials, 'same-origin');
    assert.equal(JSON.parse(fetches[0].options.body).sessionId, first.sessionId);
  } finally {
    if (originalWindow === undefined) delete global.window; else global.window = originalWindow;
    if (originalNavigator) Object.defineProperty(global, 'navigator', originalNavigator); else delete global.navigator;
    global.fetch = originalFetch;
  }
});
