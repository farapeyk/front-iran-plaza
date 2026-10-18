const { test } = require('node:test');
const assert = require('node:assert/strict');
const { load } = require('./helpers.cjs');
const publicPaths = load('src/features/content/lib/public-paths.ts');

test('redirects reject external URLs, backslashes and control-character tricks', () => {
  const { safeRedirect } = load('src/lib/auth/safe-redirect.ts');
  for (const value of [null, 'https://evil.invalid', '//evil.invalid', '/\\evil.invalid', '/\t/evil.invalid', '/\n/evil.invalid']) assert.equal(safeRedirect(value), '/dashboard');
  assert.equal(safeRedirect('/dashboard?tab=1'), '/dashboard?tab=1');
});

test('public CMS paths reproduce the legacy WordPress URL hierarchy', () => {
  const { articlePath, categoryPath, findCategoryBySegments, RESERVED_ROOT_SLUGS } = publicPaths;
  const categories = [
    { id: 'parent', parentId: null, slug: 'schools-educational-centers' },
    { id: 'child', parentId: 'parent', slug: 'sewingandclothingdesignschool' },
  ];
  assert.equal(articlePath('sadra-design-and-sewing-school'), '/sadra-design-and-sewing-school/');
  assert.equal(categoryPath(categories[1], categories), '/category/schools-educational-centers/sewingandclothingdesignschool/');
  assert.equal(findCategoryBySegments(categories, ['schools-educational-centers', 'sewingandclothingdesignschool']).id, 'child');
  assert.equal(findCategoryBySegments(categories, ['wrong-parent', 'sewingandclothingdesignschool']), undefined);
  assert.equal(RESERVED_ROOT_SLUGS.has('about'), true);
});

test('page protection uses segment boundaries and an exact admin-login exception', async () => {
  const { NextRequest } = require('next/server');
  const proxy = load('src/proxy.ts', {
    '@/features/content/lib/public-paths': publicPaths,
    '@/lib/auth/verify-access-token': { verifyAccessToken: async token => token === 'customer' ? { userType: 'CUSTOMER' } : null },
    '@/lib/constants/auth': { ACCESS_TOKEN_COOKIE: 'access_token' },
    '@/lib/auth/roles': load('src/lib/auth/roles.ts'),
  }).default;
  assert.equal((await proxy(new NextRequest('http://frontend.invalid/admin/login'))).status,200);
  const similar = await proxy(new NextRequest('http://frontend.invalid/admin/login-extra'));
  assert.equal(similar.status,307);assert.ok(similar.headers.get('location').includes('/api/auth/silent-refresh'));
  assert.equal((await proxy(new NextRequest('http://frontend.invalid/dashboardish/'))).status,200);
  const customer = await proxy(new NextRequest('http://frontend.invalid/admin',{headers:{cookie:'access_token=customer'}}));
  assert.equal(customer.headers.get('location'),'http://frontend.invalid/dashboard');
});

test('mutation schemas reject forged identifiers, invalid content and unknown fields', () => {
  const { validateMutation } = load('src/lib/api/mutation-validation.ts');
  const rejected = [
    ['/api/businesses/../users/me','PATCH',{ name: 'test' }],
    ['/api/businesses/id?admin=true','PATCH',{ name: 'test' }],
    ['/api/businesses/id','PATCH',{ ownerId: 'attacker' }],
    ['/api/businesses/id/products','POST',{ name: 'test', price: -1 }],
    ['/api/businesses/id/products','POST',{ name: 'test', price: 1, discountPercent: 101 }],
    ['/api/businesses/id/onboarding/advance','POST',{ step: 11 }],
    ['/api/businesses/id/services','POST',{ name: 'test', durationMinutes: 20 }],
    ['/api/businesses/id','PATCH',{ socialMedia: { x: 'unsupported' } }],
  ];
  for (const args of rejected) assert.ok(validateMutation(...args), JSON.stringify(args));
  assert.equal(validateMutation('/api/businesses/id/services','POST',{ name: 'test', durationMin: 20 }), null);
  assert.equal(validateMutation('/api/admin/businesses/id/plan','PATCH',{ planId: 'plan_1' }), null);
  assert.equal(validateMutation('/api/users/me','PATCH',{ fullName: 'Example Name' }), null);
  assert.equal(validateMutation('/api/notifications/id/read','PATCH',undefined), null);
  assert.equal(validateMutation('/api/businesses/id/documents','POST',{ type:'BUSINESS_LICENSE_PHOTO', fileId:'file_1', issueDate:'2024-03-20T00:00:00.000Z' }), null);
  assert.equal(validateMutation('/api/businesses/id/documents','POST',{ type:'BUSINESS_LICENSE_PHOTO', fileId:'file_1', issueDate:'2024-03-20' }), null);
});

test('content CMS mutations are allowlisted and validated before reaching the backend', () => {
  const { validateMutation } = load('src/lib/api/mutation-validation.ts');
  const article = {
    title: 'Best restaurants in Shiraz',
    slug: 'best-restaurants-shiraz',
    excerpt: 'A useful guide to the best registered restaurants in Shiraz.',
    bodyBlocks: [
      { id: 'intro', type: 'paragraph', text: 'Article introduction', richText: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Article introduction', marks: [{ type: 'bold' }] }] }] } },
      { id: 'places', type: 'business-list', businessIds: ['business_1'] },
      { id: 'table', type: 'table', table: { headers: ['Name', 'Address'], rows: [{ cells: ['Restaurant', 'Shiraz'], phone: '07132345678' }], showContactColumn: true, contactLabel: 'Call' } },
    ],
    faqs: [{ question: 'Which restaurant is best?', answer: 'It depends on your preferred food and location.' }],
    robotsIndex: true,
    robotsFollow: true,
    showBanners: true,
  };

  assert.equal(validateMutation('/api/content/articles', 'POST', article), null);
  assert.equal(validateMutation('/api/content/articles', 'POST', { ...article, excerpt: 'x'.repeat(5000) }), null);
  assert.ok(validateMutation('/api/content/articles', 'POST', { ...article, excerpt: 'x'.repeat(5001) }));
  assert.equal(validateMutation('/api/content/articles', 'POST', { ...article, slug: 'مقاله-خوب' }), null);
  assert.equal(validateMutation('/api/content/articles', 'POST', {
    ...article,
    bodyBlocks: Array.from({ length: 500 }, (_, index) => ({ id: `block-${index}`, type: 'paragraph', text: 'Valid paragraph' })),
  }), null);
  assert.equal(validateMutation('/api/content/articles/article_1', 'PATCH', { ...article, expectedRevision: 1 }), null);
  assert.equal(validateMutation('/api/content/categories', 'POST', { name: 'Restaurants', slug: 'restaurants' }), null);
  assert.equal(validateMutation('/api/admin/categories', 'POST', { name: 'Restaurants', icon: 'utensils' }), null);
  assert.equal(validateMutation('/api/content/categories/category_1', 'PATCH', { isActive: false }), null);
  assert.equal(validateMutation('/api/content/articles/article_1/submit', 'POST', undefined), null);
  assert.equal(validateMutation('/api/content/articles/article_1/request-changes', 'POST', { note: 'Please add sources.' }), null);
  assert.equal(validateMutation('/api/content/articles/article_1/approve', 'POST', {}), null);
  assert.equal(validateMutation('/api/content/articles/article_1/publish', 'POST', undefined), null);
  assert.equal(validateMutation('/api/content/feedback/feedback_1', 'PATCH', { status: 'APPROVED' }), null);
  const banner = { title: 'Article banner', imageId: 'file_1', altText: 'Banner description', targetUrl: 'https://iranplaza.ir/register', placement: 'TOP', isActive: true, startsAt: '2026-10-14T12:00:00.000Z', endsAt: null, sortOrder: 1 };
  assert.equal(validateMutation('/api/content/banners', 'POST', banner), null);
  assert.equal(validateMutation('/api/content/banners/banner_1', 'PATCH', { isActive: false }), null);
  assert.equal(validateMutation('/api/content/banners/banner_1', 'DELETE', undefined), null);
  assert.equal(validateMutation('/api/admin/content/authors', 'POST', { phone: '09121234567', fullName: 'Content Author' }), null);
  assert.equal(validateMutation('/api/admin/content/authors/user_1', 'DELETE', undefined), null);
  assert.equal(validateMutation(`/api/articles/${'a'.repeat(120)}/feedback`, 'POST', { rating: 5 }), null);

  assert.ok(validateMutation('/api/content/articles', 'POST', { ...article, ownerId: 'user_2' }));
  assert.ok(validateMutation('/api/content/articles', 'POST', {
    ...article,
    bodyBlocks: Array.from({ length: 501 }, (_, index) => ({ id: `block-${index}`, type: 'paragraph', text: 'Too many blocks' })),
  }));
  assert.ok(validateMutation('/api/content/categories', 'POST', { name: 'Restaurants', slug: 'Not Valid' }));
  assert.ok(validateMutation('/api/admin/categories', 'POST', { name: 'Restaurants', icon: '<script>' }));
  assert.ok(validateMutation('/api/content/articles/article_1/request-changes', 'POST', {}));
  assert.ok(validateMutation('/api/content/feedback/feedback_1', 'PATCH', { status: 'PENDING' }));
  assert.ok(validateMutation('/api/content/banners', 'POST', { ...banner, targetUrl: 'javascript:alert(1)' }));
  assert.ok(validateMutation('/api/content/articles', 'POST', { ...article, bodyBlocks: [{ id: 'bad-table', type: 'table', table: { headers: ['One', 'Two'], rows: [{ cells: ['Only one'] }] } }] }));
});

test('canonical article URLs gain https when omitted and reject relative or unsafe URLs', () => {
  const { normalizeCanonicalUrl } = load('src/features/content/lib/canonical-url.ts');
  assert.equal(normalizeCanonicalUrl(undefined), undefined);
  assert.equal(normalizeCanonicalUrl('  '), undefined);
  assert.equal(normalizeCanonicalUrl('iranplaza.ir/example-article/'), 'https://iranplaza.ir/example-article/');
  assert.equal(normalizeCanonicalUrl('//iranplaza.ir/example-article/'), 'https://iranplaza.ir/example-article/');
  assert.equal(normalizeCanonicalUrl('http://127.0.0.1:3001/example-article/'), 'http://127.0.0.1:3001/example-article/');
  assert.equal(normalizeCanonicalUrl('nail'), null);
  assert.equal(normalizeCanonicalUrl('http://localhost:3001/articles/example'), null);
  assert.equal(normalizeCanonicalUrl('/articles/example'), null);
  assert.equal(normalizeCanonicalUrl('ftp://iranplaza.ir/example'), null);
  assert.equal(normalizeCanonicalUrl('not a url'), null);
});

test('article actions send normalized canonical URLs and stop invalid ones locally', async () => {
  const calls=[];
  const canonical=load('src/features/content/lib/canonical-url.ts');
  const actions=load('src/features/content/actions/content.action.ts',{
    '@/features/business/actions/authed-fetch':{authedFetch:async(path,method,body)=>{calls.push({path,method,body});return {success:true,data:{id:'article_1',slug:body.slug}};}},
    '@/features/content/lib/canonical-url':canonical,
    '@/features/content/lib/public-paths':publicPaths,
    'next/cache':{revalidatePath:()=>{}},
  });
  const input={title:'Article title',slug:'article-title',excerpt:'A valid article excerpt.',bodyBlocks:[],canonicalUrl:'iranplaza.ir/article-title/'};
  assert.equal((await actions.createArticleAction(input)).success,true);
  assert.equal(calls[0].body.canonicalUrl,'https://iranplaza.ir/article-title/');
  const invalid=await actions.createArticleAction({...input,canonicalUrl:'/articles/article-title'});
  assert.equal(invalid.success,false);
  assert.equal(calls.length,1);
});

test('working hours reject duplicates, reversed shifts and incomplete times', () => {
  const { validateMutation } = load('src/lib/api/mutation-validation.ts');
  const day = { weekday: 'SATURDAY', isTwoShift: false, openTime1: '09:00', closeTime1: '17:00', openTime2: null, closeTime2: null };
  const check = hours => validateMutation('/api/businesses/id/working-hours','PATCH',{hours});
  assert.equal(check([day]), null);
  assert.ok(check([day,day]));
  assert.ok(check([{...day,closeTime1:'08:00'}]));
  assert.ok(check([{...day,closeTime1:null}]));
});

test('Jalali conversion handles leap Esfand and round trips in the supported year range', () => {
  const date = load('src/lib/utils/jalali.ts');
  assert.equal(date.jalaliMonthLength(1403,12),30);
  assert.equal(date.jalaliMonthLength(1404,12),29);
  assert.equal(date.jalaliToGregorian(1403,1,1),'2024-03-20');
  assert.throws(() => date.jalaliToGregorian(1404,12,30), RangeError);
  assert.throws(() => date.gregorianToJalali('invalid'), RangeError);
  for(let year=1330;year<=1410;year++) for(let month=1;month<=12;month++) {
    const day=date.jalaliMonthLength(year,month);
    assert.deepEqual(date.gregorianToJalali(date.jalaliToGregorian(year,month,day)),{jy:year,jm:month,jd:day});
  }
});

test('upload rejects empty, oversized, executable and MIME-spoofed files', async () => {
  const { validateUpload, MAX_UPLOAD_BYTES } = load('src/lib/validate-upload.ts');
  const check = async file => { const data=new FormData();data.append('file',file);return validateUpload(data); };
  assert.ok(await check(new File([], 'empty.png',{type:'image/png'})));
  assert.ok(await check(new File(['<svg onload="alert(1)">'], 'image.svg',{type:'image/svg+xml'})));
  assert.ok(await check(new File(['MZ executable'], 'fake.png',{type:'image/png'})));
  assert.ok(await check(new File([new Uint8Array(MAX_UPLOAD_BYTES+1)], 'huge.png',{type:'image/png'})));
  assert.equal(await check(new File([new Uint8Array([137,80,78,71,13,10,26,10,0])], 'image.png',{type:'image/png'})),null);
  assert.equal(await check(new File([new Uint8Array([255,216,255,224])], 'image.jpg',{type:'image/jpeg'})),null);
  assert.equal(await check(new File(['GIF89a'], 'image.gif',{type:'image/gif'})),null);
  assert.equal(await check(new File(['RIFF0000WEBP'], 'image.webp',{type:'image/webp'})),null);
  assert.equal(await check(new File(['0000ftypavif0000'], 'image.avif',{type:'image/avif'})),null);
  assert.equal(await check(new File([new Uint8Array([0x49,0x49,0x2a,0x00])], 'image.tiff',{type:'image/tiff'})),null);
  assert.equal(await check(new File(['BM'], 'image.bmp',{type:'image/bmp'})),null);
});

test('JWT verification rejects missing secret, bad claims, expiry and other algorithms', async () => {
  const { SignJWT } = require('jose');
  const original = process.env.JWT_ACCESS_SECRET;
  const secret = 'test-only-key-that-is-long-enough';
  process.env.JWT_ACCESS_SECRET=secret;
  const { verifyAccessToken }=load('src/lib/auth/verify-access-token.ts');
  const sign = (claims, algorithm='HS256', expiry='1h') => new SignJWT(claims).setProtectedHeader({alg:algorithm}).setExpirationTime(expiry).sign(new TextEncoder().encode(secret));
  try {
    assert.ok(await verifyAccessToken(await sign({sub:'user_1',userType:'CUSTOMER'})));
    assert.equal(await verifyAccessToken(await sign({sub:'user_1'})),null);
    assert.equal(await verifyAccessToken(await sign({sub:'user_1',userType:'ADMIN'},'HS384')),null);
    assert.equal(await verifyAccessToken(await sign({sub:'user_1',userType:'ADMIN'},'HS256','-1s')),null);
    delete process.env.JWT_ACCESS_SECRET;
    assert.equal(await verifyAccessToken(await sign({sub:'user_1',userType:'ADMIN'})),null);
  } finally { if(original===undefined)delete process.env.JWT_ACCESS_SECRET;else process.env.JWT_ACCESS_SECRET=original; }
});

test('registration treats rejected documents consistently without requiring approval', () => {
  const { registrationIncomplete }=load('src/features/business/lib/registration.ts');
  const types=['NATIONAL_ID_FRONT','NATIONAL_ID_BACK','BUSINESS_LICENSE_PHOTO'];
  assert.equal(registrationIncomplete(types.map(type=>({type,status:'PENDING'}))),false);
  assert.equal(registrationIncomplete(types.map((type,i)=>({type,status:i===0?'REJECTED':'PENDING'}))),true);
});

test('cookie migration removes the legacy scope and matches JWT expiry', async () => {
  const { SignJWT } = require('jose');
  const key=new TextEncoder().encode('test-cookie-key');
  const accessToken=await new SignJWT({sub:'user_1'}).setProtectedHeader({alg:'HS256'}).setExpirationTime('5m').sign(key);
  const refreshToken=await new SignJWT({sub:'user_1'}).setProtectedHeader({alg:'HS256'}).setExpirationTime('30d').sign(key);
  const writes=[];
  const constants=load('src/lib/constants/auth.ts');
  const cookies=load('src/lib/auth/cookies.ts',{'next/headers':{cookies:async()=>({set:(...args)=>writes.push(args)})},'@/lib/constants/auth':constants});
  await cookies.setAuthCookies({accessToken,refreshToken});
  assert.ok(writes.some(([name,value,options])=>name==='refresh_token'&&value===''&&options.path==='/api/auth'&&options.maxAge===0));
  const access=writes.find(([name,value])=>name==='access_token'&&value===accessToken)[2];
  assert.ok(access.maxAge>295&&access.maxAge<=300);assert.equal(access.httpOnly,true);
  const refresh=writes.find(([name,value])=>name==='refresh_token'&&value===refreshToken)[2];
  assert.equal(refresh.path,'/');assert.equal(refresh.httpOnly,true);assert.equal(refresh.sameSite,'lax');
  await cookies.clearAuthCookies();
  assert.ok(writes.some(([name,value,options])=>name==='refresh_token'&&value===''&&options.path==='/'&&options.maxAge===0));
});

test('successful category updates are not downgraded when the response omits relations', async () => {
  let revalidated=0;
  const action=load('src/features/business/actions/update-business-profile.action.ts',{
    '@/lib/api/action-fetch':{actionFetch:async()=>Response.json({id:'business_1'})},
    '@/lib/auth/action-access-token':{getActionAccessToken:async()=>'token'},
    '@/lib/api/error-message':{extractErrorMessage:()=> 'error'},
    'next/cache':{revalidatePath:()=>revalidated++},
  });
  assert.equal((await action.updateBusinessProfileAction('business_1',{categoryIds:['category_1']})).success,true);
  assert.equal(revalidated,1);
});

test('gallery creation returns its record ID so an immediate delete targets the gallery record', async () => {
  const calls=[];
  const image={id:'gallery_1',fileId:'file_1',businessId:'business_1',title:null,sortOrder:0,createdAt:'2026-10-07T00:00:00.000Z'};
  const action=load('src/features/business/actions/gallery.action.ts',{
    '@/lib/api/action-fetch':{actionFetch:async(url,options)=>{calls.push({url,options});return options.method==='POST'?Response.json(image):new Response(null,{status:204});}},
    '@/lib/auth/action-access-token':{getActionAccessToken:async()=>'token'},
    '@/lib/api/error-message':{extractErrorMessage:()=> 'error'},
    'next/cache':{revalidatePath:()=>{}},
  });
  const created=await action.addGalleryImageAction('business_1','file_1');
  assert.equal(created.success,true);assert.equal(created.image.id,'gallery_1');
  assert.equal((await action.removeGalleryImageAction('business_1',created.image.id)).success,true);
  assert.ok(calls[1].url.endsWith('/gallery/gallery_1'));
});
