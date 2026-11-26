// Exercises the real React/TipTap editor in Edge. Only uploads and Next Image are
// replaced; no authenticated session, database or production service is used.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('@playwright/test');
const { webpack } = require('next/dist/compiled/webpack/webpack');

async function main() {
  const root = path.resolve(__dirname, '..');
  const output = fs.mkdtempSync(path.join(os.tmpdir(), 'iranplaza-editor-'));
  let browser, server;
  try {
    await new Promise((resolve, reject) => {
      const compiler = webpack({
        mode: 'development', devtool: false, context: root,
        entry: path.join(__dirname, 'fixtures/rich-text-editor.tsx'),
        output: { path: output, filename: 'editor.js' },
        resolve: { extensions: ['.tsx', '.ts', '.js', '.cjs'], alias: {
          'next/image$': path.join(__dirname, 'fixtures/editor-runtime.cjs'),
          '@/features/business/actions/upload-file.action$': path.join(__dirname, 'fixtures/editor-runtime.cjs'),
          '@': path.join(root, 'src'),
        } },
        module: { rules: [{ test: /\.tsx?$/, exclude: /node_modules/, use: path.join(__dirname, 'fixtures/editor-typescript-loader.cjs') }] },
      });
      compiler.run((error, stats) => compiler.close(() => error || stats.hasErrors() ? reject(error || new Error(stats.toString({ all: false, errors: true }))) : resolve()));
    });
    const cssRoot = path.join(root, '.next/static');
    const css = fs.existsSync(cssRoot) ? fs.readdirSync(cssRoot, { recursive: true }).filter(file => String(file).endsWith('.css')).map(file => fs.readFileSync(path.join(cssRoot, file), 'utf8')).join('\n') : '';
    server = http.createServer((req, res) => {
      res.setHeader('Content-Type', req.url === '/editor.js' ? 'application/javascript' : 'text/html; charset=utf-8');
      res.end(req.url === '/editor.js' ? fs.readFileSync(path.join(output, 'editor.js')) : `<!doctype html><html dir="rtl" lang="fa"><meta charset="utf-8"><style>${css}</style><body><main id="root" style="max-width:960px;margin:auto"></main><script src="/editor.js"></script></body></html>`);
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    browser = await chromium.launch({ channel: 'msedge', headless: true });
    const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
    const errors = [];
    page.on('pageerror', error => { errors.push(error.message); console.error('Editor browser error:', error.message); });
    await page.goto(`http://127.0.0.1:${server.address().port}`);
    await page.locator('.tiptap').waitFor();
    const button = label => page.getByRole('button', { name: label, exact: true });
    const activeColors = await button('حالت متن').evaluate(element => ({ background: getComputedStyle(element).backgroundColor, color: getComputedStyle(element).color, classes: element.className }));
    assert.notEqual(activeColors.background, activeColors.color, JSON.stringify(activeColors));
    assert.notEqual(activeColors.background, 'rgba(0, 0, 0, 0)', JSON.stringify(activeColors));
    await page.locator('.tiptap').click();
    await page.keyboard.press('Control+End');
    await button('درج پرسش متداول در متن').click();
    assert.equal(await page.locator('.tiptap [data-faq]').count(), 1);
    assert.equal(await page.locator('.tiptap [data-faq-question]').textContent(), 'پرسش متداول');
    await page.locator('.tiptap [data-faq-question]').click();
    await button('فعال یا غیرفعال کردن پرسش').click();
    assert.equal(await page.locator('.tiptap [data-faq]').getAttribute('data-active'), 'false');
    await button('فعال یا غیرفعال کردن پرسش').click();
    await page.locator('.tiptap [data-faq-question]').fill('پرسش تازه درباره مقاله چیست؟');
    await button('درج معرفی کسب‌وکار در متن').click();
    await page.getByRole('button', { name: /مجموعه نمونه/ }).click();
    await button('ویرایش HTML').click();
    const html = page.getByRole('textbox', { name: 'کد HTML محتوا', exact: true });
    const source = await html.inputValue();
    assert.match(source, /data-faq/);
    assert.match(source, /data-business-ids="business-1"/);
    await html.fill(source.replace('پرسش تازه درباره مقاله چیست؟', 'پرسش ویرایش‌شده در HTML چیست؟'));
    assert.equal(await page.evaluate(() => window.editorValid), true);
    assert.match(JSON.stringify(await page.evaluate(() => window.editorDocument)), /پرسش ویرایش‌شده در HTML چیست؟/);
    await button('حالت متن').click();
    await page.locator('.tiptap').click();
    await page.keyboard.press('Control+End');
    await button('درج HTML و CSS سفارشی در متن').click();
    await page.getByRole('textbox', { name: 'HTML سفارشی برای درج' }).fill('<style>.custom{color:#166534}</style><div class="custom">متن اختصاصی میانی</div>');
    await button('درج باکس HTML').click();
    await button('ویرایش HTML').click();
    const mixedSource = await html.inputValue();
    assert.match(mixedSource, /data-rich-html/);
    await html.fill(mixedSource + '<p>پایان مقاله</p>');
    assert.equal(await page.evaluate(() => window.editorValid), true);
    await button('حالت متن').click();
    assert.ok(JSON.stringify(await page.evaluate(() => window.editorDocument)).includes('متن اختصاصی میانی'));
    if (await page.locator('.tiptap [data-faq]').count() !== 1) console.error('Round-trip document:', JSON.stringify(await page.evaluate(() => window.editorDocument)), 'source:', source);
    assert.equal(await page.locator('.tiptap [data-faq]').count(), 1);
    assert.equal(await page.locator('.tiptap [data-faq-question]').textContent(), 'پرسش ویرایش‌شده در HTML چیست؟');
    await page.locator('.tiptap').click();
    await page.keyboard.press('Control+End');
    await button('درج جدول').click();
    await button('درج جدول').last().click();
    await page.locator('.tiptap td').first().click();
    await button('افزودن سطر بعد').click();
    assert.equal(await page.locator('.tiptap tr').count(), 4);
    await button('ویرایش HTML').click();
    const tableSource = await html.inputValue();
    await html.fill(tableSource + '<aside data-callout="true"><p>نکته میانی مقاله</p></aside>');
    if (!await page.evaluate(() => window.editorValid)) console.error('HTML validation error:', await page.getByRole('alert').allTextContents(), tableSource);
    assert.equal(await page.evaluate(() => window.editorValid), true);
    await button('حالت متن').click();
    assert.equal(await page.locator('.tiptap [data-callout]').count(), 1);
    assert.equal(await page.locator('.tiptap tr').count(), 4);
    await button('ویرایش HTML').click();
    await html.fill('<p>');
    assert.equal(await page.evaluate(() => window.editorValid), false);
    await html.fill(tableSource);
    assert.equal(await page.evaluate(() => window.editorValid), true);
    await button('حالت متن').click();
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
    fs.mkdirSync(path.join(root, 'test-results'), { recursive: true });
    await page.screenshot({ path: path.join(root, 'test-results/rich-text-editor-mobile.png'), fullPage: true });
    assert.deepEqual(errors, []);
    console.log('PASS: real editor insertion, business selection, live HTML sync, editable round trips, table operations, invalid HTML and mobile overflow');
  } finally {
    await browser?.close();
    if (server) await new Promise(resolve => server.close(resolve));
    // Only remove the exact directory returned by mkdtemp under the OS temp root.
    if (path.dirname(output) === os.tmpdir() && path.basename(output).startsWith('iranplaza-editor-')) fs.rmSync(output, { recursive: true, force: true });
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
