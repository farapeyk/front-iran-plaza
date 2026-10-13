// Run after npm run build. Uses an isolated HTTP fixture, never the configured backend.
const assert = require('node:assert/strict');
const http = require('node:http');
const net = require('node:net');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
const { randomBytes } = require('node:crypto');
const { SignJWT } = require('jose');

async function main() {
  const id = 'cmsfz4qtl00027msz3yr5z4nl';
  const mainPath = '/api/businesses/' + id;
  const publicSlug='نمایشگاه-ماشین-e823cb';
  const publicPath='/api/businesses/slug/'+encodeURIComponent(publicSlug);
  const fixtures = {
    [mainPath]: { id, name: 'کسب‌وکار آزمایشی مدیر', phone: '09120000000', status: 'PENDING', planType: 'FREE', aboutText: 'معرفی آزمایشی' },
    [mainPath + '/documents']: [],
    [mainPath + '/gallery']: [],
    [mainPath + '/features']: [{ id: 'feature_1', label: 'پارکینگ آزمایشی', isActive: true }],
    [mainPath + '/branches']: [{ id: 'branch_1', title: 'شعبه آزمایشی', address: 'آدرس آزمایشی' }],
    [mainPath + '/services']: [{ id: 'service_1', name: 'خدمت آزمایشی', priceFrom: '100', priceTo: '200' }],
    [mainPath + '/product-categories']: [],
    [mainPath + '/products']: [{ id: 'product_1', name: 'محصول آزمایشی', price: '1000', discountPercent: 0 }],
    [mainPath + '/working-hours']: [],
    [mainPath + '/installment-plan']: null,
  };
  fixtures[publicPath]={id:'public-fixture',slug:publicSlug,name:'کسب‌وکار فارسی آزمایشی',description:'Public fixture',aboutText:null,logoId:null,introVideoId:null,phone:'09120000000',phone2:null,whatsapp:null,website:null,socialMedia:null,address:null,latitude:null,longitude:null,businessType:'SOLE_PROPRIETOR',viewCount:0,categories:[],gallery:[],services:[],productCategories:[],products:[],workingHours:[],branches:[],installmentPlan:null};
  fixtures['/api/businesses/public-fixture/reviews']=[];
  fixtures['/api/businesses/public-fixture/features']=[];
  fixtures['/api/users/me']={id:'fixture-customer',userType:'CUSTOMER',fullName:'کاربر آزمایشی',phone:'09120000001',isProfileCompleted:true};
  fixtures['/api/businesses/mine']=[];
  const requestedPaths=[];
  const backend = http.createServer((req, res) => {
    requestedPaths.push(req.url);
    res.setHeader('Content-Type', 'application/json');
    if (!(req.url in fixtures)) { res.statusCode = 404; return res.end('{}'); }
    if (req.url!==publicPath&&!req.url.startsWith('/api/businesses/public-fixture/')&&!req.headers.authorization?.startsWith('Bearer ')) { res.statusCode = 401; return res.end('{}'); }
    res.end(JSON.stringify(fixtures[req.url]));
  });
  let child;
  try {
    backend.listen(0, '127.0.0.1'); await once(backend, 'listening');
    const reserve = net.createServer(); reserve.listen(0, '127.0.0.1'); await once(reserve, 'listening');
    const port = reserve.address().port; await new Promise(resolve => reserve.close(resolve));
    const secret = randomBytes(32).toString('hex');
    child = spawn(process.execPath, [path.resolve('node_modules/next/dist/bin/next'), 'start', '-p', String(port), '-H', '127.0.0.1'], {
      cwd: path.resolve(__dirname, '..'), windowsHide: true, stdio: 'ignore',
      env: { ...process.env, NODE_ENV: 'production', BACKEND_INTERNAL_URL: 'http://127.0.0.1:' + backend.address().port, JWT_ACCESS_SECRET: secret },
    });
    let launchError;
    child.on('error', error => { launchError = error; });
    const origin = 'http://127.0.0.1:' + port;
    let ready = false;
    for (let attempt = 0; attempt < 100; attempt++) {
      if (launchError) throw launchError;
      if (child.exitCode !== null) throw new Error('Production server exited before readiness.');
      try { const r = await fetch(origin + '/login'); await r.text(); if (r.status === 200) { ready = true; break; } } catch { /* waiting for this child only */ }
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    assert.ok(ready, 'Production server did not start.');
    const publicResponse=await fetch(origin+'/businesses/'+encodeURIComponent(publicSlug));
    const publicHtml=await publicResponse.text();
    assert.equal(publicResponse.status,200,'Encoded Persian slug must resolve in the production page');
    assert.match(publicHtml,/<h1[^>]*>کسب‌وکار فارسی آزمایشی<\/h1>/);
    console.log('PASS: production public page resolves encoded Persian slug against unchanged backend response shape.');
    const articleList=await fetch(origin+'/articles');
    assert.equal(articleList.status,200);
    assert.ok((await articleList.text()).includes('بخش مقالات در حال حاضر در دسترس نیست.'));
    const missingArticle=await fetch(origin+'/articles/unavailable-article');
    assert.equal(missingArticle.status,404);await missingArticle.text();
    const customerToken=await new SignJWT({sub:'fixture-customer',userType:'CUSTOMER'}).setProtectedHeader({alg:'HS256'}).setExpirationTime('5m').sign(new TextEncoder().encode(secret));
    for(const [route,text] of [['/dashboard/support','ثبت و پیگیری پیام پشتیبانی در حال حاضر در دسترس نیست.'],['/dashboard/payments','نمایش سوابق پرداخت در حال حاضر در دسترس نیست.']]) {
      const unavailable=await fetch(origin+route,{headers:{cookie:'access_token='+customerToken},redirect:'manual'});
      assert.equal(unavailable.status,200,route);
      assert.ok((await unavailable.text()).includes(text),route);
    }
    assert.equal(requestedPaths.some(route=>/^\/api\/(articles|support\/tickets|invoices\?)/.test(route)),false);
    console.log('PASS: unavailable articles, tickets and payment history render without calling removed backend routes.');
    const token = await new SignJWT({ sub: 'fixture-admin', userType: 'ADMIN' }).setProtectedHeader({ alg: 'HS256' }).setExpirationTime('5m').sign(new TextEncoder().encode(secret));
    const headers = { cookie: 'access_token=' + token };
    for (const role of ['ADMIN', 'SUPER_ADMIN']) {
      const roleToken = await new SignJWT({ sub: 'fixture-' + role, userType: role }).setProtectedHeader({ alg: 'HS256' }).setExpirationTime('5m').sign(new TextEncoder().encode(secret));
      for (const route of ['/dashboard', '/dashboard/business/new', '/complete-profile', '/login', '/admin/login']) {
        const redirected = await fetch(origin + route, { headers: { cookie: 'access_token=' + roleToken }, redirect: 'manual' });
        assert.equal(redirected.status, 307, role + route);
        assert.equal(new URL(redirected.headers.get('location'), origin).href, origin + '/admin');
        await redirected.text();
      }
    }
    console.log('PASS: production HTTP redirects ADMIN and SUPER_ADMIN from user pages and login screens to /admin.');
    const response = await fetch(origin + '/admin/businesses/' + id, { headers, redirect: 'manual' });
    const html = await response.text();
    assert.equal(response.status, 200);
    for (const text of ['کسب‌وکار آزمایشی مدیر', 'دریافت پلن‌ها انجام نشد', 'پارکینگ آزمایشی', 'شعبه آزمایشی', 'خدمت آزمایشی', 'محصول آزمایشی']) assert.ok(html.includes(text), text);
    // Next serializes its not-found fallback in the RSC payload even on successful pages.
    // Check the rendered heading rather than searching that fallback's text globally.
    assert.match(html, /<h1[^>]*>کسب‌وکار آزمایشی مدیر<\/h1>/);
    const missing = await fetch(origin + '/admin/businesses/missing-business', { headers, redirect: 'manual' });
    assert.equal(missing.status, 404); await missing.text();
    console.log('PASS: production admin page HTTP 200 with plans HTTP 404 and pending-business extras; truly missing business HTTP 404.');
  } finally {
    if (child && child.exitCode === null) { const exited = once(child, 'exit'); child.kill(); await exited; }
    backend.closeAllConnections(); await new Promise(resolve => backend.close(resolve));
  }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
