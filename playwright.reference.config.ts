import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  testMatch: 'reference-layout.spec.ts',
  timeout: 90000,
  workers: 1,
  use: {
    baseURL: 'http://127.0.0.1:3002',
    channel: 'msedge',
    headless: true,
    trace: 'retain-on-failure',
  },
  reporter: [['list']],
  webServer: {
    command: process.env.REFERENCE_REVIEW_DEV==='true'
      ? 'node node_modules/next/dist/bin/next dev --webpack -p 3002 -H 127.0.0.1'
      : 'node node_modules/next/dist/bin/next start -p 3002 -H 127.0.0.1',
    url: 'http://127.0.0.1:3002/favicon.ico',
    reuseExistingServer: false,
    timeout: 180000,
    env: {
      BACKEND_INTERNAL_URL: 'http://127.0.0.1:3102',
      SITE_URL: 'http://127.0.0.1:3002',
      JWT_ACCESS_SECRET: 'reference-layout-isolated-fixture-only',
    },
  },
});
