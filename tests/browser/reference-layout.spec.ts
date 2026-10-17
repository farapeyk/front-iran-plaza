import { test, expect, type Page } from '@playwright/test';
import { createServer, type Server } from 'node:http';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { SignJWT } from 'jose';

// Isolated HTTP fixture: these checks validate presentation, not live backend data.
const categoryNames = ['کافه و رستوران','مراکز زیبایی','باشگاه ورزشی','پزشکان','مراکز پزشکی','تفریح و سفر','هنر و موسیقی','مراکز آموزشی','دکوراسیون','خدمات ساختمان','خدمات خودرو','پوشاک و اکسسوری','خدمات عمومی','لوازم خانگی','مالی و حسابداری'];
const business = {
  id: 'reference-business', slug: 'iran-burger', name: 'فست فود ایران برگر',
  ownerId: 'qa-owner', tenantId: 'qa-tenant', onboardingStep: 11, status: 'APPROVED',
  createdAt: '2026-10-01T00:00:00.000Z', updatedAt: '2026-10-01T00:00:00.000Z',
  description: 'ایران برگر؛ ترکیب طعم، کیفیت و سرعت برای وقتی که واقعاً هوس یه برگر خوب داری',
  aboutText: 'ایران برگر با منوی متنوع برگر و فست‌فود، پذیرای شماست.\nبرای اطلاع از خدمات و سفارش با ما تماس بگیرید.',
  city: 'شیراز', neighborhood: 'معالی آباد', address: 'شیراز، معالی آباد، خیابان پزشکان',
  logoId: 'logo', phone: '07100000000', whatsapp: '09120000000',
  businessType: 'LEGAL', planType: 'VIP', planExpiryDate: '2099-01-01',
  latitude: null, longitude: null, introVideoId: null, categories: [],
  gallery: [4,3,2,1].map(n=>({id:`gallery-${n}`,fileId:`gallery-${n}`})),
  services: ['پذیرش حضوری','امکان بیرون‌بر','منوی متنوع برگر و فست‌فود','تحویل یا ارسال غذا'].map((name,i)=>({id:`service-${i}`,name,description:i===0?'سرویس ویژه با هماهنگی قبلی':null,priceFrom:i===0?'250000':null,priceTo:null,durationMin:i===0?45:null,isActive:true})),
  productCategories: [{id:'burger',name:'برگر',isActive:true},{id:'drink',name:'نوشیدنی',isActive:true},{id:'empty',name:'دسر',isActive:true}],
  products: [
    {id:'p1',name:'چیزبرگر',description:'برگر تازه با گوشت و سبزیجات',price:'420000',discountPercent:10,productCategoryId:'burger',imageId:'product',isActive:true},
    {id:'p2',name:'دوبل برگر',price:'850000',discountPercent:0,productCategoryId:'burger',imageId:'product',isActive:true},
    {id:'p3',name:'نوشیدنی',price:'75000',discountPercent:0,productCategoryId:'drink',imageId:'product',isActive:true},
  ],
  installmentPlan: {isActive:true,minDownPaymentPercent:50,monthlyInterestPercent:'3',repaymentPeriodsMonths:[3,6,12],guaranteeNote:'برای اطلاعات بیشتر تماس بگیرید'},
  socialMedia: {instagram:'iranburger',telegram:'iranburger'},
  workingHours: ['SATURDAY','SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY'].map(weekday=>({weekday,openTime1:'11:00',closeTime1:'16:00',isTwoShift:true,openTime2:'18:00',closeTime2:'24:00'})),
  branches: [{id:'branch1',title:'شعبه معالی آباد (اصلی)',address:'شیراز، معالی آباد',phone:null}],
};
let fixture: Server;
const listingRequests: URL[]=[];
let uploadedImageBytes=0;
let uploadedImageContentType='';
let uploadedImageBody=Buffer.alloc(0);

async function expectVisibleImagesLoaded(page: Page) {
  const images=page.locator('img');
  const count=await images.count();
  for(let index=0;index<count;index+=1) {
    const image=images.nth(index);
    const state=await image.evaluate(element=>({
      visible:!element.closest('[aria-hidden="true"],[hidden],[inert]')&&element.getClientRects().length>0,
      loaded:(element as HTMLImageElement).complete&&(element as HTMLImageElement).naturalWidth>0,
      source:(element as HTMLImageElement).currentSrc||(element as HTMLImageElement).src,
    }));
    if(state.visible&&!state.loaded) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(()=>image.evaluate(element=>!element.isConnected||!element.getClientRects().length||((element as HTMLImageElement).complete&&(element as HTMLImageElement).naturalWidth>0)),{
        message:`image should load after entering the viewport: ${state.source}`,
        timeout:15000,
      }).toBe(true);
    }
  }
  await expect.poll(()=>images.evaluateAll(elements=>elements.filter(element=>!element.closest('[aria-hidden="true"],[hidden],[inert]')&&element.getClientRects().length&&(!(element as HTMLImageElement).complete||!(element as HTMLImageElement).naturalWidth)).length),{timeout:15000}).toBe(0);
  await page.evaluate(()=>scrollTo(0,0));
}

test.beforeAll(async()=>{
  fixture=createServer((request,response)=>{
    const url=new URL(request.url!,'http://127.0.0.1:3102');
    if(url.pathname==='/api/files/upload'&&request.method==='POST') {
      uploadedImageBytes=0; uploadedImageContentType=request.headers['content-type']??'';
      const chunks: Buffer[]=[];
      request.on('data',chunk=>{const buffer=Buffer.from(chunk);uploadedImageBytes+=buffer.length;chunks.push(buffer);});
      request.on('end',()=>{uploadedImageBody=Buffer.concat(chunks);response.writeHead(201,{'content-type':'application/json'});response.end(JSON.stringify({id:'edited-logo'}));});
      return;
    }
    if(url.pathname.startsWith('/api/files/')) {
      const id=url.pathname.split('/').at(-1)!;
      const asset=id.startsWith('gallery-')?'gallery/'+id+'.webp':id==='product'?'gallery/gallery-1.webp':`home/biz-${id.startsWith('logo-')?id.slice(-1):'1'}.webp`;
      response.writeHead(200,{'content-type':'image/webp'});
      response.end(readFileSync(join(process.cwd(),'public/design',asset))); return;
    }
    let data: unknown;
    if(url.pathname==='/api/categories') data=categoryNames.map((name,i)=>({id:`c${i}`,name,parentId:null}));
    else if(url.pathname==='/api/users/me') data={id:'qa-owner',phone:'09120000001',fullName:'صاحب کسب‌وکار نمونه',userType:'CUSTOMER'};
    else if(url.pathname==='/api/businesses/mine') data=[business];
    else if(url.pathname==='/api/businesses/reference-business/documents') data=['NATIONAL_ID_FRONT','NATIONAL_ID_BACK','BUSINESS_LICENSE_PHOTO'].map(type=>({type,fileId:type,status:'PENDING'}));
    else if(url.pathname==='/api/businesses') {
      listingRequests.push(url);
      let items=Array.from({length:24},(_,i)=>({...business,id:`b${i}`,logoId:`logo-${i%4+1}`,hasInstallment:i%3===0,planType:i%2===0?'VIP':'FREE',name:['فست فود ایران برگر','فست فود لاویا','رستوران هفت خوان','مجموعه رستوران باکویه'][i%4]}));
      if(url.searchParams.get('vipOnly')==='true')items=items.filter(item=>item.planType==='VIP');
      if(url.searchParams.get('search')==='بدون نتیجه')items=[];
      const page=Number(url.searchParams.get('page')??1),limit=Number(url.searchParams.get('limit')??12);
      data={data:items.slice((page-1)*limit,page*limit),total:items.length,page,limit};
    }
    else if(url.pathname==='/api/businesses/slug/iran-burger') data=business;
    else if(url.pathname.endsWith('/features')) data=[{id:'f1',label:'امکان استفاده از کوپن یا تخفیف ویژه'}];
    else if(url.pathname.endsWith('/reviews')) data=[1,2].map(n=>({id:`r${n}`,rating:5,createdAt:'2026-10-01',comment:'غذا و خدمات عالی بود.',user:{fullName:'کاربر نمونه'},replies:[]}));
    else {response.writeHead(404);response.end();return;}
    response.writeHead(200,{'content-type':'application/json'});response.end(JSON.stringify(data));
  });
  await new Promise<void>(resolve=>fixture.listen(3102,'127.0.0.1',resolve));
});
test.afterAll(async()=>{await new Promise<void>((resolve,reject)=>fixture.close(error=>error?reject(error):resolve()));});

for(const width of [375,768,1024,1440]) {
  test(`reference pages layout and interactions at ${width}`,async({page})=>{
    await page.setViewportSize({width,height:900});
    const errors: string[]=[];page.on('pageerror',error=>errors.push(error.message));
    for(const route of ['/','/businesses/iran-burger']) {
      expect((await page.goto(route))?.status()).toBe(200);
      await page.evaluate(()=>document.fonts.ready);
      await expect(page.locator('.plaza-design')).toBeVisible();
      expect(await page.evaluate(()=>document.fonts.check('16px IranSans'))).toBe(true);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
      if(route==='/') {
        await expect(page.locator('.home-categories').getByRole('link').first()).toBeVisible();
        await expect(page.locator('.home-testimonials').getByRole('heading',{name:'نظرات کاربران'})).toBeVisible();
        if(width<1024) {
          const menuButton=page.getByRole('button',{name:'منو',exact:true});
          await menuButton.click();
          const drawer=page.getByRole('dialog',{name:'منوی اصلی'});
          await expect(drawer).toBeVisible();
          await drawer.getByRole('button',{name:'بستن منو',exact:true}).click();
          await expect(drawer).not.toBeVisible();
          await expect(menuButton).toBeFocused();
        }
        if(width>=1024) {
          const city=await page.locator('.home-hero-city').boundingBox();
          const copy=await page.locator('.home-hero-content').boundingBox();
          expect(city!.x).toBeLessThan(copy!.x);
        }
      } else {
        if(width>=1024) {
          const sidebar=await page.locator('.business-sidebar').boundingBox();
          const content=await page.locator('.business-content').boundingBox();
          expect(sidebar!.x+sidebar!.width).toBeLessThan(content!.x);
        } else {
          await page.locator('.business-tabs').getByRole('button',{name:'محصولات',exact:true}).click();
          await expect(page.locator('#mobile-products [data-slot="accordion-trigger"]')).toHaveAttribute('aria-expanded','true');
        }
        const products=page.locator(width>=1024?'#desktop-products':'#mobile-products');
        await products.getByRole('button',{name:'نوشیدنی',exact:true}).click();
        await expect(products.locator('article')).toHaveCount(1);
        await products.getByRole('button',{name:'دسر',exact:true}).click();
        await expect(products.locator('article')).toHaveCount(0);
        await expect(products.getByText('محصولی در این دسته ثبت نشده است.')).toBeVisible();
        await products.getByRole('button',{name:'همه',exact:true}).click();
        await expect(products.locator('article')).toHaveCount(3);
        await expect(products.locator('article').first().locator('del')).toBeVisible();
        await expect(products.locator('article').first().getByText('۳۷۸٬۰۰۰ تومان',{exact:true})).toBeVisible();
        await products.getByRole('tab',{name:/خدمات/}).click();
        await expect(products.locator('.business-service-card')).toHaveCount(4);
        await expect(products.getByText('از ۲۵۰٬۰۰۰ تومان',{exact:true})).toBeVisible();
        await expect(products.locator('.business-products')).toHaveCount(0);
        await products.getByRole('tab',{name:/محصولات/}).click();
        await expect(products.locator('.business-products article')).toHaveCount(3);
        await expect(page.locator('img[src$="tick-circle.svg"]')).not.toHaveCount(0);
        const firstImage=page.locator('[data-slot="gallery-profile"] img').first();
        const before=await firstImage.getAttribute('src');
        await page.getByRole('button',{name:'عکس بعدی',exact:true}).click();
        expect(await firstImage.getAttribute('src')).not.toBe(before);
        await page.getByRole('button',{name:'عکس قبلی',exact:true}).click();
        expect(await firstImage.getAttribute('src')).toBe(before);
        const contact=page.getByRole('button',{name:'تماس و واتساپ',exact:true}).first();
        await contact.click();await expect(page.getByRole('dialog')).toBeVisible();
        await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).toHaveCount(0);
        await expect(contact).toBeFocused();
      }
      await expectVisibleImagesLoaded(page);
      expect(errors).toEqual([]);
      await page.screenshot({path:`test-results/reference-pages/${width}-${route==='/'?'home':'business'}.png`,fullPage:true});
    }
  });
}

test('business owners can preview and crop a logo before upload',async({page})=>{
  const secret=process.env.JWT_ACCESS_SECRET;
  test.skip(!secret,'JWT_ACCESS_SECRET is required for the isolated authenticated page.');
  const token=await new SignJWT({userType:'CUSTOMER'}).setProtectedHeader({alg:'HS256'}).setSubject('qa-owner').setIssuedAt().setExpirationTime('10m').sign(new TextEncoder().encode(secret));
  const baseURL=process.env.PLAYWRIGHT_BASE_URL??'http://127.0.0.1:3001';
  await page.context().addCookies([{name:'access_token',value:token,url:new URL(baseURL).origin,httpOnly:true,sameSite:'Lax'}]);
  await page.setViewportSize({width:375,height:850});
  await page.goto('/dashboard/business/profile/basic');
  uploadedImageBytes=0; uploadedImageContentType=''; uploadedImageBody=Buffer.alloc(0);
  await page.locator('input[type="file"][accept^="image/"]').setInputFiles(join(process.cwd(),'public/design/home/biz-1.webp'));
  const editor=page.getByRole('dialog',{name:'تنظیم لوگوی کسب‌وکار'});
  await expect(editor).toBeVisible();
  await expect(editor.getByRole('button',{name:'مربع',exact:true})).toHaveAttribute('aria-pressed','true');
  await editor.getByRole('slider',{name:'بزرگ‌نمایی تصویر'}).fill('1.5');
  await expect(editor.getByText('۱۵۰٪',{exact:true})).toBeVisible();
  await editor.getByRole('button',{name:'اصلی',exact:true}).click();
  await expect(editor.getByRole('button',{name:'اصلی',exact:true})).toHaveAttribute('aria-pressed','true');
  await page.screenshot({path:'test-results/image-editor/mobile-logo-editor.png',fullPage:true});
  await editor.getByRole('button',{name:'تأیید و بارگذاری',exact:true}).click();
  await expect(editor).toHaveCount(0);
  await expect.poll(()=>uploadedImageBytes).toBeGreaterThan(0);
  expect(uploadedImageContentType).toContain('multipart/form-data');
  expect(uploadedImageBody.toString('latin1')).toContain('Content-Type: image/webp');
  expect(uploadedImageBody.includes(Buffer.from('RIFF'))).toBe(true);
  await expect(page.getByAltText('لوگوی فعلی')).toHaveAttribute('src',/edited-logo/);
});

for(const width of [375,768,1024,1440]) {
  test(`business listing reference and pagination at ${width}`,async({page})=>{
    test.setTimeout(180000);
    await page.setViewportSize({width,height:900});
    const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
    await page.goto('/businesses?categoryId=c0&city=شیراز');
    const cards=page.locator('.listing-grid [data-layout="listing"]');
    await expect(cards).toHaveCount(20);
    await expect(page.getByRole('heading',{name:'کافه و رستوران',exact:true}).first()).toBeVisible();
    const columns=await page.locator('.listing-grid').evaluate(element=>getComputedStyle(element).gridTemplateColumns.split(' ').length);
    expect(columns).toBe(width<768?1:2);
    expect(await page.locator('.listing-grid').evaluate(element=>element.children[6].classList.contains('listing-banner'))).toBe(true);
    await page.evaluate(()=>document.fonts.ready);
    await expectVisibleImagesLoaded(page);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
    await page.screenshot({path:`test-results/reference-pages/${width}-listing.png`,fullPage:true});
    await page.getByRole('button',{name:'مشاهده بیشتر'}).click();
    await expect(cards).toHaveCount(24);
    await expect(page.getByRole('button',{name:'مشاهده بیشتر'})).toHaveCount(0);
    await expect(page.getByRole('switch',{name:'فقط VIP ها'})).toBeDisabled();
    await expect(page.getByRole('switch',{name:'گالری تصاویر و ویدئو'})).toBeDisabled();
    expect(listingRequests.every(url=>!url.searchParams.has('vipOnly')&&!url.searchParams.has('hasMedia'))).toBe(true);
    await page.locator('summary').filter({hasText:'شیراز'}).click();
    await page.getByRole('textbox',{name:'شهر',exact:true}).fill('تهران');
    await page.getByRole('button',{name:'اعمال',exact:true}).click();
    await expect(page).toHaveURL(/city=%D8%AA%D9%87%D8%B1%D8%A7%D9%86/);
    await expect(page).not.toHaveURL(/page=/);
    await page.getByRole('textbox',{name:'جستجوی کسب‌وکار'}).fill('بدون نتیجه');
    await page.getByRole('textbox',{name:'جستجوی کسب‌وکار'}).press('Enter');
    await expect(page.getByText('نتیجه‌ای یافت نشد.',{exact:true})).toBeVisible();
    await expect(cards).toHaveCount(0);
    await page.goBack();
    await expect(page.getByRole('textbox',{name:'جستجوی کسب‌وکار'})).toHaveValue('');
    await expect(cards).toHaveCount(20);
    expect(errors).toEqual([]);
  });
}
