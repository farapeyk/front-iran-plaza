const {test}=require('node:test');const assert=require('node:assert/strict');const {NextRequest}=require('next/server');const {load}=require('./helpers.cjs');
test('mutations accept configured public origin behind an internal listener and reject forged origins',()=>{
  const original=process.env.SITE_URL;const {isSameOrigin}=load('src/lib/auth/same-origin.ts');
  const request=(origin,extra={})=>new NextRequest('http://localhost:3001/api/backend/probe',{headers:{...(origin?{origin}:{}),...extra}});
  try{process.env.SITE_URL='https://portal.example';assert.equal(isSameOrigin(request('https://portal.example')),true);assert.equal(isSameOrigin(request('http://localhost:3001')),false);assert.equal(isSameOrigin(request('https://evil.example',{'x-forwarded-host':'evil.example'})),false);assert.equal(isSameOrigin(request('null')),false);assert.equal(isSameOrigin(request(undefined,{'sec-fetch-site':'cross-site'})),false);delete process.env.SITE_URL;assert.equal(isSameOrigin(request('http://localhost:3001')),true);}
  finally{if(original===undefined)delete process.env.SITE_URL;else process.env.SITE_URL=original;}
});
