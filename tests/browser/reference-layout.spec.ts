import { test, expect } from '@playwright/test';
import { createServer, type Server } from 'node:http';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Isolated HTTP fixture: these checks validate presentation, not live backend data.
const categoryNames = ['کافه و رستوران','مراکز زیبایی','باشگاه ورزشی','پزشکان','مراکز پزشکی','تفریح و سفر','هنر و موسیقی','مراکز آموزشی','دکوراسیون','خدمات ساختمان','خدمات خودرو','پوشاک و اکسسوری','خدمات عمومی','لوازم خانگی','مالی و حسابداری'];
const business = {
  id: 'reference-business', slug: 'iran-burger', name: 'فست فود ایران برگر',
  description: 'ایران برگر؛ ترکیب طعم، کیفیت و سرعت برای وقتی که واقعاً هوس یه برگر خوب داری',
  aboutText: 'ایران برگر با منوی متنوع برگر و فست‌فود، پذیرای شماست.\nبرای اطلاع از خدمات و سفارش با ما تماس بگیرید.',
  city: 'شیراز', neighborhood: 'معالی آباد', address: 'شیراز، معالی آباد، خیابان پزشکان',
  logoId: 'logo', phone: '07100000000', whatsapp: '09120000000',
  businessType: 'LEGAL', planType: 'VIP', planExpiryDate: '2099-01-01',
  latitude: null, longitude: null, introVideoId: null, categories: [],
  gallery: [4,3,2,1].map(n=>({id:`gallery-${n}`,fileId:`gallery-${n}`})),
  services: ['پذیرش حضوری','امکان بیرون‌بر','منوی متنوع برگر و فست‌فود','تحویل یا ارسال غذا'].map((name,i)=>({id:`service-${i}`,name,description:null,priceFrom:null})),
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
test.beforeAll(async()=>{
  fixture=createServer((request,response)=>{
    const url=new URL(request.url!,'http://127.0.0.1:3102');
    if(url.pathname.startsWith('/api/files/')) {
      const id=url.pathname.split('/').at(-1)!;
      const asset=id.startsWith('gallery-')?'gallery/'+id+'.png':id==='product'?'gallery/gallery-1.png':`home/biz-${id.startsWith('logo-')?id.slice(-1):'1'}.png`;
      response.writeHead(200,{'content-type':'image/png'});
      response.end(readFileSync(join(process.cwd(),'public/design',asset))); return;
    }
    let data: unknown;
    if(url.pathname==='/api/categories') data=categoryNames.map((name,i)=>({id:`c${i}`,name,parentId:null}));
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
      await expect.poll(()=>page.locator('img').evaluateAll(images=>images.filter(image=>image.getClientRects().length && (!(image as HTMLImageElement).complete || !(image as HTMLImageElement).naturalWidth)).length)).toBe(0);
      expect(errors).toEqual([]);
      await page.screenshot({path:`test-results/reference-pages/${width}-${route==='/'?'home':'business'}.png`,fullPage:true});
    }
  });
}

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
    await expect.poll(()=>page.locator('img').evaluateAll(images=>images.filter(image=>image.getClientRects().length&&(!(image as HTMLImageElement).complete||!(image as HTMLImageElement).naturalWidth)).length)).toBe(0);
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
