import { defineConfig } from 'orval';
export default defineConfig({
  browser: {
    input: './contracts/openapi.json',
    output: { target: './src/design/api/generated/browser.ts', schemas: './src/design/api/generated/models', client: 'fetch', mode: 'single', urlEncodeParameters: true, override: { mutator: { path: './src/design/api/browser.ts', name: 'browserFetch' }, fetch: { includeHttpResponseReturnType: false }, useDates: false } },
  },
  server: {
    input: './contracts/openapi.json',
    output: { target: './src/design/api/generated/server.ts', client: 'fetch', mode: 'single', schemas: './src/design/api/generated/models', urlEncodeParameters: true, override: { mutator: { path: './src/design/api/server.ts', name: 'serverFetch' }, fetch: { includeHttpResponseReturnType: false }, useDates: false } },
  },
});
