const {test}=require('node:test');const assert=require('node:assert/strict');const {load}=require('./helpers.cjs');
test('browser transport follows BFF paths, preserves FormData and abort signals, and handles JSON/blob/204',async()=>{
  const {browserFetch}=load('src/design/api/browser.ts');const original=global.fetch;const calls=[];const controller=new AbortController();const data=new FormData();data.set('file',new Blob(['fixture']),'fixture.txt');
  try{global.fetch=async(url,options)=>{calls.push({url,options});return Response.json({id:'created'});};assert.deepEqual(await browserFetch('/api/files/upload',{method:'POST',body:data,signal:controller.signal}),{id:'created'});assert.equal(calls[0].url,'/api/backend/files/upload');assert.equal(calls[0].options.body,data);assert.equal(calls[0].options.signal,controller.signal);assert.equal(calls[0].options.credentials,'same-origin');assert.equal(new Headers(calls[0].options.headers).has('Authorization'),false);
    global.fetch=async()=>new Response('text fixture',{headers:{'Content-Type':'text/plain'}});assert.equal(await(await browserFetch('/api/files/id')).text(),'text fixture');
    global.fetch=async()=>new Response(null,{status:204});assert.equal(await browserFetch('/api/businesses/id'),undefined);
    global.fetch=async()=>Response.json({message:'Forbidden'},{status:403});await assert.rejects(browserFetch('/api/businesses/id'),error=>error.status===403&&error.message==='Forbidden');
    await assert.rejects(browserFetch('https://external.invalid/api/files'));assert.equal(calls.length,1);
  }finally{global.fetch=original;}
});
test('generated directory and upload clients encode query/path parameters and binary multipart bodies',async()=>{
  const calls=[];const api=load('src/design/api/generated/browser.ts',{'../browser':{browserFetch:async(url,options)=>{calls.push({url,options});return {data:[],total:0,page:1,limit:20};}}});
  await api.businessControllerListPublic({search:'نام / کسب‌وکار',page:2,neighborhood:'مرکز شهر'});const query=new URL(calls[0].url,'http://localhost').searchParams;assert.equal(query.get('search'),'نام / کسب‌وکار');assert.equal(query.get('page'),'2');assert.equal(query.get('neighborhood'),'مرکز شهر');
  const encoded=api.getBusinessControllerGetFullBySlugUrl('نام /?');assert.ok(encoded.includes(encodeURIComponent('نام /?')));
  const upload=new Blob(['binary fixture'],{type:'text/plain'});
  await api.fileAssetControllerUpload({file:upload});
  const request=calls.at(-1);assert.equal(request.url,'/api/files/upload');assert.ok(request.options.body instanceof FormData);assert.equal(await request.options.body.get('file').text(),'binary fixture');
});
test('social adapters reject script URLs and malformed JSON while supporting valid handles',()=>{
  const {socialLinks}=load('src/design/api/socials.ts');assert.deepEqual(socialLinks({website:'javascript:alert(1)',instagram:{injected:true}}),[]);assert.equal(socialLinks({telegram:'@iranplaza'})[0].href,'https://t.me/iranplaza');assert.equal(socialLinks({website:'https://user:pass@example.com'}).length,0);
});
