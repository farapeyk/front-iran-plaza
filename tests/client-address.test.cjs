const { test } = require('node:test');
const assert = require('node:assert/strict');
const { load } = require('./helpers.cjs');

const { clientAddressFromHeaders } = load('src/lib/api/client-address.ts');

test('client address uses the proxy chain and validates IP values', () => {
  assert.equal(clientAddressFromHeaders(new Headers({
    'x-forwarded-for': '5.202.138.212, 192.0.2.20',
    'x-real-ip': '192.0.2.20',
  })), '5.202.138.212');

  assert.equal(clientAddressFromHeaders(new Headers({
    'x-forwarded-for': 'not-an-ip, 198.51.100.10, 192.0.2.20',
  })), '198.51.100.10');

  assert.equal(clientAddressFromHeaders(new Headers({
    'x-real-ip': '198.51.100.11',
  })), '198.51.100.11');

  assert.equal(clientAddressFromHeaders(new Headers({
    'x-iranplaza-client-ip': '203.0.113.99',
  })), undefined);
});
