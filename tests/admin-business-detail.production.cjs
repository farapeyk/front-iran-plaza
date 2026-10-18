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
  const articleSlug='best-restaurants-shiraz';
  const articleListPath='/api/articles?page=1&limit=12';
  const categoryParent={id:'category-parent',parentId:null,name:'Educational centers',slug:'schools-educational-centers',description:null,sortOrder:0,isActive:true};
  const articleCategory={id:'category-child',parentId:categoryParent.id,name:'Sewing schools',slug:'sewingandclothingdesignschool',description:'Sewing school guides',sortOrder:0,isActive:true};
  const article={
    id:'article-fixture',title:'Best restaurants in Shiraz',slug:articleSlug,
    excerpt:'A production fixture article backed by registered Iran Plaza businesses.',
    bodyBlocks:[
      {id:'intro',type:'heading',level:2,text:'Live registered businesses'},
      {id:'rich',type:'paragraph',text:'Rich editorial text',richText:{type:'doc',content:[{type:'paragraph',content:[{type:'text',text:'Rich editorial text',marks:[{type:'bold'}]}]}]}},
      {id:'businesses',type:'business-list',businessIds:['public-fixture']},
      {id:'comparison',type:'table',table:{headers:['Restaurant','Location'],rows:[{cells:['Registered Shiraz restaurant','Shiraz'],phone:'09120000000'}],showContactColumn:true,contactLabel:'Call now'}},
    ],
    status:'PUBLISHED',category:{id:articleCategory.id,name:articleCategory.name,slug:articleCategory.slug},coverImageId:null,coverImageAlt:null,
    seoTitle:'Best restaurants in Shiraz | Iran Plaza',seoDescription:'A verified guide to registered restaurants in Shiraz.',
    canonicalUrl:null,robotsIndex:true,robotsFollow:true,showBanners:true,readingTimeMin:2,
    publishedAt:'2026-10-13T08:00:00.000Z',updatedAt:'2026-10-13T08:00:00.000Z',
    author:{id:'fixture-author',fullName:'Iran Plaza editorial team'},faqs:[],feedback:[{id:'legacy-comment',rating:null,comment:'Legacy guest comment',createdAt:'2026-09-01T08:00:00.000Z',user:{fullName:'WordPress guest'}}],rating:null,ratingCount:0,
    businesses:[{id:'mention-1',sortOrder:0,customTitle:null,customNote:null,business:{
      id:'public-fixture',slug:publicSlug,name:'Registered Shiraz restaurant',description:'Live business profile',
      address:'Shiraz',city:'Shiraz',neighborhood:null,phone:'09120000000',logoId:null,planType:'FREE',planExpiryDate:null,
    }}],
    banners:[
      {id:'top-banner',imageId:'top-banner-image',title:'Top campaign',altText:'Top article banner',targetUrl:'https://iranplaza.ir/register',placement:'TOP',sortOrder:0},
      {id:'side-banner',imageId:'side-banner-image',title:'Side campaign',altText:'Sidebar article banner',targetUrl:'https://iranplaza.ir/businesses',placement:'SIDEBAR',sortOrder:0},
    ],
  };
  fixtures[articleListPath]={data:[{
    id:article.id,title:article.title,slug:article.slug,excerpt:article.excerpt,coverImageId:null,coverImageAlt:null,
    readingTimeMin:article.readingTimeMin,publishedAt:article.publishedAt,updatedAt:article.updatedAt,
    author:{fullName:article.author.fullName},category:null,rating:null,ratingCount:0,
  }],total:1,page:1,limit:12};
  const articleCategoryListPath='/api/articles?page=1&limit=12&category='+articleCategory.slug;
  fixtures[articleCategoryListPath]=fixtures[articleListPath];
  const randomArticlesPath='/api/articles/random?limit=3&excludeId='+article.id;
  fixtures[randomArticlesPath]=[{
    id:'related-article',title:'Related Iran Plaza guide',slug:'related-guide',excerpt:'Related guide',coverImageId:null,coverImageAlt:null,
    readingTimeMin:1,publishedAt:article.publishedAt,updatedAt:article.updatedAt,author:{fullName:'Iran Plaza'},category:null,rating:null,ratingCount:0,
  }];
  fixtures['/api/articles/categories']=[categoryParent,articleCategory];
  fixtures['/api/articles/'+articleSlug]=article;
  fixtures['/api/content/me']={id:'fixture-admin',fullName:'Content manager',canWrite:true,canPublish:true};
  fixtures['/api/content/banners']=[];
  fixtures['/api/content/categories']=[];
  fixtures['/api/content/articles/'+article.id]={...article,revision:1,reviewNote:null,submittedAt:null,approvedAt:null};
  const requestedPaths=[];
  const backend = http.createServer((req, res) => {
    requestedPaths.push(req.url);
    res.setHeader('Content-Type', 'application/json');
    if (!(req.url in fixtures)) { res.statusCode = 404; return res.end('{}'); }
    const publicRequest=req.url===publicPath||req.url.startsWith('/api/businesses/public-fixture/')||req.url.startsWith('/api/articles');
    if (!publicRequest&&!req.headers.authorization?.startsWith('Bearer ')) { res.statusCode = 401; return res.end('{}'); }
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
      env: { ...process.env, NODE_ENV: 'production', SITE_URL: 'https://iran-plaza.ir', BACKEND_INTERNAL_URL: 'http://127.0.0.1:' + backend.address().port, JWT_ACCESS_SECRET: secret },
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
    const homeResponse=await fetch(origin+'/');
    const homeHtml=await homeResponse.text();
    assert.equal(homeResponse.status,200);
    assert.match(homeHtml,/<link[^>]+rel="canonical"[^>]+href="https:\/\/iran-plaza\.ir\/?"/);
    const publicResponse=await fetch(origin+'/businesses/'+encodeURIComponent(publicSlug));
    const publicHtml=await publicResponse.text();
    assert.equal(publicResponse.status,200,'Encoded Persian slug must resolve in the production page');
    assert.match(publicHtml,/<h1[^>]*>کسب‌وکار فارسی آزمایشی<\/h1>/);
    console.log('PASS: production public page resolves encoded Persian slug against unchanged backend response shape.');
    const articleList=await fetch(origin+'/articles/');
    assert.equal(articleList.status,200);
    assert.ok((await articleList.text()).includes(article.title));
    const categoryResponse=await fetch(origin+'/category/'+categoryParent.slug+'/'+articleCategory.slug+'/');
    const categoryHtml=await categoryResponse.text();
    assert.equal(categoryResponse.status,200);
    assert.ok(categoryHtml.includes(articleCategory.name));
    assert.match(categoryHtml,new RegExp('<link[^>]+rel="canonical"[^>]+href="https://iran-plaza\\.ir/category/'+categoryParent.slug+'/'+articleCategory.slug+'/"'));
    const categoryWithoutSlash=await fetch(origin+'/category/'+categoryParent.slug+'/'+articleCategory.slug,{redirect:'manual'});
    assert.equal(categoryWithoutSlash.status,308);
    assert.equal(new URL(categoryWithoutSlash.headers.get('location'),origin).pathname,'/category/'+categoryParent.slug+'/'+articleCategory.slug+'/');
    await categoryWithoutSlash.text();
    const articleResponse=await fetch(origin+'/'+articleSlug+'/');
    const articleHtml=await articleResponse.text();
    assert.equal(articleResponse.status,200);
    assert.ok(articleHtml.includes('Registered Shiraz restaurant'));
    assert.ok(articleHtml.includes('Rich editorial text'));
    assert.ok(articleHtml.includes('Call now'));
    assert.ok(articleHtml.includes('Top article banner'));
    assert.ok(articleHtml.includes('Sidebar article banner'));
    assert.ok(articleHtml.includes('Related Iran Plaza guide'));
    assert.ok(articleHtml.includes('WordPress guest'));
    assert.ok(articleHtml.includes('Legacy guest comment'));
    assert.equal(articleHtml.includes('NaN'),false);
    assert.ok(articleHtml.includes('application/ld+json'));
    assert.match(articleHtml,new RegExp('<link[^>]+rel="canonical"[^>]+href="[^"]*/'+articleSlug+'/"'));
    const articleWithoutSlash=await fetch(origin+'/'+articleSlug,{redirect:'manual'});
    assert.equal(articleWithoutSlash.status,308);
    assert.equal(new URL(articleWithoutSlash.headers.get('location'),origin).pathname,'/'+articleSlug+'/');
    await articleWithoutSlash.text();
    const legacyArticle=await fetch(origin+'/articles/'+articleSlug+'/',{redirect:'manual'});
    assert.equal(legacyArticle.status,308);
    assert.equal(new URL(legacyArticle.headers.get('location'),origin).pathname,'/'+articleSlug+'/');
    await legacyArticle.text();
    const missingArticle=await fetch(origin+'/unavailable-article/');
    assert.equal(missingArticle.status,404);await missingArticle.text();
    const customerToken=await new SignJWT({sub:'fixture-customer',userType:'CUSTOMER'}).setProtectedHeader({alg:'HS256'}).setExpirationTime('5m').sign(new TextEncoder().encode(secret));
    for(const [route,text] of [['/dashboard/support','ثبت و پیگیری پیام پشتیبانی در حال حاضر در دسترس نیست.'],['/dashboard/payments','نمایش سوابق پرداخت در حال حاضر در دسترس نیست.']]) {
      const unavailable=await fetch(origin+route,{headers:{cookie:'access_token='+customerToken},redirect:'manual'});
      assert.equal(unavailable.status,200,route);
      assert.ok((await unavailable.text()).includes(text),route);
    }
    assert.equal(requestedPaths.includes(articleListPath),true);
    assert.equal(requestedPaths.includes(articleCategoryListPath),true);
    assert.equal(requestedPaths.includes('/api/articles/'+articleSlug),true);
    assert.equal(requestedPaths.includes(randomArticlesPath),true);
    assert.equal(requestedPaths.some(route=>/^\/api\/(support\/tickets|invoices\?)/.test(route)),false);
    console.log('PASS: live CMS articles render from the public API with business cards and structured data.');
    const token = await new SignJWT({ sub: 'fixture-admin', userType: 'ADMIN' }).setProtectedHeader({ alg: 'HS256' }).setExpirationTime('5m').sign(new TextEncoder().encode(secret));
    const headers = { cookie: 'access_token=' + token };
    const bannerManager=await fetch(origin+'/content/banners',{headers,redirect:'manual'});
    const bannerManagerHtml=await bannerManager.text();
    assert.equal(bannerManager.status,200);
    assert.ok(bannerManagerHtml.includes('بنرهای مقاله'));
    assert.ok(bannerManagerHtml.includes('بنر جدید'));
    const articleEditor=await fetch(origin+'/content/articles/'+article.id,{headers,redirect:'manual'});
    const articleEditorHtml=await articleEditor.text();
    assert.equal(articleEditor.status,200);
    assert.ok(articleEditorHtml.includes('نمایش بنرهای مقاله'));
    assert.ok(articleEditorHtml.includes('جدول'));
    console.log('PASS: production editorial routes render the banner manager and extended article editor.');
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
