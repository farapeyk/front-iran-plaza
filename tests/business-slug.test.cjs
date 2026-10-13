const {test}=require('node:test');const assert=require('node:assert/strict');const {load}=require('./helpers.cjs');
test('encoded page and decoded metadata slugs generate the same single-encoded API URL',()=>{
  const {businessSlugFromRoute}=load('src/features/public/lib/business-slug.ts');
  const api=load('src/design/api/generated/server.ts',{'../server':{serverFetch:async()=>{}}});
  const slug='نمایشگاه-ماشین-e823cb';
  for(const value of [slug,encodeURIComponent(slug)]){
    assert.equal(businessSlugFromRoute(value),slug);
    assert.equal(api.getBusinessControllerGetFullBySlugUrl(businessSlugFromRoute(value)),'/api/businesses/slug/'+encodeURIComponent(slug));
  }
  assert.equal(businessSlugFromRoute('%252F'),'%2F','decode only once');
  for(const value of ['', '%zz', '%2Fprivate', '%5Cprivate', '%00'])assert.equal(businessSlugFromRoute(value),null);
});
test('business page and metadata both pass decoded Persian slugs to the existing API',async()=>{
  const slug='نمایشگاه-ماشین-e823cb', calls=[];
  const normalizer=load('src/features/public/lib/business-slug.ts');
  const business={id:'existing-business',name:'نمایشگاه ماشین',slug,description:'Existing backend response'};
  const route=load('src/app/(public)/businesses/[slug]/page.tsx',{
    react:{cache:fn=>fn},'next/navigation':{notFound:()=>{throw Error('Unexpected 404');}},
    '@/lib/api/backend-get':{backendGet:async()=>[],BackendError:class extends Error{}},
    '@/design/api/generated/server':{businessControllerGetFullBySlug:async value=>{calls.push(value);assert.equal(value,slug);return business;},businessProfileControllerGetFeatures:async id=>{assert.equal(id,business.id);return [];}},
    '@/design/pages/business-live':{BusinessLivePage:()=>null},'@/lib/auth/cookies':{getAccessTokenCookie:async()=>null},
    '@/features/public/lib/business-slug':normalizer,
  });
  const metadata=await route.generateMetadata({params:Promise.resolve({slug})});
  const page=await route.default({params:Promise.resolve({slug:encodeURIComponent(slug)})});
  assert.equal(page.props.business.id,business.id);assert.equal(metadata.alternates.canonical,'/businesses/'+encodeURIComponent(slug));assert.deepEqual(calls,[slug,slug]);
});
