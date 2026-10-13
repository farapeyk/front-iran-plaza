import { test, expect, type Page } from '@playwright/test';
const publicRoutes = ['/', '/login', '/businesses', '/businesses/iran-burger', '/businesses?search=برگر', '/categories', '/business-registration', '/about', '/contact', '/faq', '/terms', '/articles'];
const accountRoutes = ['/dashboard', '/dashboard/profile', '/dashboard/favorites', '/dashboard/notifications', '/dashboard/subscription', '/dashboard/payments', '/dashboard/support', '/dashboard/business/new', '/dashboard/business/documents', '/complete-profile', '/dashboard/business/profile', ...['basic','contact','address','about','features','gallery','hours','services','products','products/new','installment','social'].map(section => '/dashboard/business/profile/'+section)];
let cachedSession: {accessToken:string;refreshToken:string} | undefined;
async function login(page: Page) {
  if (!cachedSession) {
  const requested = await page.request.post('http://127.0.0.1:3100/api/auth/request-otp', { data: { phone: '09120000001' } });
  expect(requested.status()).toBe(200);
  const { debugCode } = await requested.json();
  const verified = await page.request.post('http://127.0.0.1:3100/api/auth/verify-otp', { data: { phone: '09120000001', code: debugCode } });
  expect(verified.status()).toBe(200);
  cachedSession = await verified.json();
  }
  const session=cachedSession!;
  await page.context().addCookies([{ name:'access_token', value:session.accessToken, url:'http://127.0.0.1:3001', httpOnly:true, sameSite:'Lax' }, { name:'refresh_token', value:session.refreshToken, url:'http://127.0.0.1:3001', httpOnly:true, sameSite:'Lax' }]);
}
async function verifyPage(page: Page, route: string, width: number) {
  const errors: string[] = [];
  const listener = (error: Error) => errors.push(error.message);
  page.on('pageerror', listener);
  const response = await page.goto(route, { waitUntil:'networkidle' });
  expect(response?.status(), route).toBeLessThan(400);
  await expect(page.locator('.plaza-design').first()).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.fonts.check('16px IranSans'))).toBe(true);
  expect(await page.locator('.plaza-design').first().evaluate(element => getComputedStyle(element).fontFamily)).toContain('IranSans');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), route+' overflow').toBeLessThanOrEqual(1);
  const broken = await page.locator('img').evaluateAll(images => images.filter(image => image instanceof HTMLImageElement && image.getClientRects().length && image.complete && !image.naturalWidth).map(image => image.getAttribute('src')));
  expect(broken, route+' broken images').toEqual([]);
  expect(errors, route+' browser errors').toEqual([]);
  await page.screenshot({ path:`test-results/design-baseline/${width}/${route.replace(/[^a-z0-9]/gi,'_') || 'home'}.png`, fullPage:true });
  page.off('pageerror', listener);
}
for (const width of [375,768,1024,1440]) {
  test(`public routes, fonts, images and responsive layout at ${width}`, async ({ page }) => {
    test.setTimeout(600000); await page.setViewportSize({width,height:900});
    for (const route of publicRoutes) await test.step(route, () => verifyPage(page,route,width));
  });
  test(`account routes and real backend at ${width}`, async ({ page }) => {
    test.setTimeout(600000); await page.setViewportSize({width,height:900}); await login(page);
    for (const route of accountRoutes) await test.step(route, () => verifyPage(page,route,width));
  });
  test(`all design library pages at ${width}`, async ({ page }) => {
    test.setTimeout(600000); await page.setViewportSize({width,height:900});
    for(const route of ['/cover','/design-system','/design-system/tokens','/design-system/buttons','/design-system/icons','/design-system/components','/design-system/iran-plaza']) await test.step(route,()=>verifyPage(page,route,width));
  });
}
test('mobile profile tabs open actual sections; contact modal closes and restores focus', async ({ page }) => {
  await page.setViewportSize({width:375,height:850}); await page.goto('/businesses/iran-burger');
  await page.getByRole('button', { name:'محصولات', exact:true }).first().click();
  await expect(page.locator('#mobile-products [data-slot="accordion-trigger"]')).toHaveAttribute('aria-expanded','true');
  const contact = page.getByRole('button',{name:'تماس و واتساپ',exact:true}); await contact.click();
  await expect(page.getByRole('dialog',{name:'راه های ارتباطی'})).toBeVisible();
  await page.keyboard.press('Escape'); await expect(page.getByRole('dialog')).toHaveCount(0); await expect(contact).toBeFocused();
});
test('unsupported ticket service is shown as unavailable without a submission form', async ({ page }) => {
  await login(page); await page.goto('/dashboard/support');
  await expect(page.getByText('ثبت و پیگیری پیام پشتیبانی در حال حاضر در دسترس نیست.',{exact:true})).toBeVisible();
  await expect(page.locator('form')).toHaveCount(0);
});
