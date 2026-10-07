const { test } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { once } = require('node:events');
const { NextRequest } = require('next/server');
const { load } = require('./helpers.cjs');

test('BFF retries the same mutation over real HTTP, hides cookies and rejects cross-origin requests', async () => {
  const originalUrl=process.env.BACKEND_INTERNAL_URL;
  const calls=[];let token='expired';let stored=0;
  const server=http.createServer(async (req,res)=>{
    let body='';for await(const chunk of req)body+=chunk;
    calls.push({url:req.url,method:req.method,headers:req.headers,body});
    res.setHeader('Content-Type','application/json');
    if(req.url==='/api/auth/refresh')return res.end(JSON.stringify({accessToken:'valid',refreshToken:'rotated'}));
    if(req.headers.authorization!=='Bearer valid'){res.statusCode=401;return res.end('{}');}
    res.setHeader('Set-Cookie','upstream=not-forwarded');
    res.end(JSON.stringify({ok:true}));
  });
  server.listen(0,'127.0.0.1');await once(server,'listening');
  process.env.BACKEND_INTERNAL_URL='http://127.0.0.1:'+server.address().port;
  const cookies={ getAccessTokenCookie:async()=>token,getRefreshTokenCookie:async()=>'old-refresh',clearAuthCookies:async()=>{},setAuthCookies:async data=>{token=data.accessToken;stored++;} };
  const {refreshSession}=load('src/lib/auth/refresh-session.ts',{'./cookies':cookies,'./verify-access-token':{verifyAccessToken:async value=>value==='valid'?{sub:'user_1',userType:'CUSTOMER'}:null}});
  const route=load('src/app/api/backend/[...path]/route.ts',{'@/lib/auth/cookies':cookies,'@/lib/auth/refresh-session':{refreshSession}});
  try {
    const response=await route.POST(new NextRequest('http://frontend.invalid/api/backend/probe?q=1',{method:'POST',headers:{origin:'http://frontend.invalid',cookie:'private=secret',authorization:'Bearer forged','Content-Type':'application/json'},body:'{"step":1}'}),{params:Promise.resolve({path:['probe']})});
    assert.equal(response.status,200);assert.deepEqual(await response.json(),{ok:true});assert.equal(stored,1);
    const mutations=calls.filter(c=>c.url==='/api/probe?q=1');assert.equal(mutations.length,2);
    assert.equal(mutations[0].body,mutations[1].body);assert.equal(mutations[1].method,'POST');
    assert.equal(mutations[0].headers.cookie,undefined);assert.equal(mutations[0].headers.authorization,'Bearer expired');
    assert.equal(response.headers.get('set-cookie'),null);assert.equal(response.headers.get('cache-control'),'private, no-store');
    const rejected=await route.POST(new NextRequest('http://frontend.invalid/api/backend/probe',{method:'POST',headers:{origin:'http://evil.invalid'}}),{params:Promise.resolve({path:['probe']})});
    assert.equal(rejected.status,403);assert.equal(calls.length,3);
    const invalid=await route.GET(new NextRequest('http://frontend.invalid/api/backend/probe'),{params:Promise.resolve({path:['..','private']})});assert.equal(invalid.status,400);
  } finally {server.closeAllConnections();await new Promise(resolve=>server.close(resolve));if(originalUrl===undefined)delete process.env.BACKEND_INTERNAL_URL;else process.env.BACKEND_INTERNAL_URL=originalUrl;}
});

test('refresh preserves cookies on temporary failures and malformed tokens, clears only authentication rejection', async () => {
  const original=global.fetch;let cleared=0,stored=0;
  const cookies={getRefreshTokenCookie:async()=>'refresh',clearAuthCookies:async()=>cleared++,setAuthCookies:async()=>stored++};
  const {refreshSession}=load('src/lib/auth/refresh-session.ts',{'./cookies':cookies,'./verify-access-token':{verifyAccessToken:async()=>null}});
  try {
    global.fetch=async()=>new Response('{}',{status:503});assert.deepEqual(await refreshSession(),{success:false,status:503});assert.equal(cleared,0);
    global.fetch=async()=>Response.json({accessToken:'bad',refreshToken:'refresh'});assert.deepEqual(await refreshSession(),{success:false,status:503});assert.equal(stored,0);
    global.fetch=async()=>new Response('{}',{status:401});assert.deepEqual(await refreshSession(),{success:false,status:401});assert.equal(cleared,1);
  } finally {global.fetch=original;}
});

test('invalid action payload fails before any network request', async () => {
  const previous=process.env.BACKEND_INTERNAL_URL,fetchOriginal=global.fetch;let calls=0;
  process.env.BACKEND_INTERNAL_URL='http://backend.invalid';
  const validation=load('src/lib/api/mutation-validation.ts');
  const {actionFetch}=load('src/lib/api/action-fetch.ts',{'./mutation-validation':validation});
  try {
    global.fetch=async()=>{calls++;return Response.json({});};
    const response=await actionFetch('http://backend.invalid/api/businesses/id/products',{method:'POST',body:JSON.stringify({name:'test',price:-1})});
    assert.equal(response.status,400);assert.equal(calls,0);
  } finally {global.fetch=fetchOriginal;if(previous===undefined)delete process.env.BACKEND_INTERNAL_URL;else process.env.BACKEND_INTERNAL_URL=previous;}
});
