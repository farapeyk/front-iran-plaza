import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser', timeout: 90000, workers: 1,
  use: { baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3001', channel: 'msedge', headless: true, trace: 'retain-on-failure' },
  reporter: [['list'], ['html', { open: 'never' }]],
});
