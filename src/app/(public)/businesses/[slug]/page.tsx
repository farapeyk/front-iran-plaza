import type {Metadata} from 'next';
import {cache} from 'react';
import {notFound} from 'next/navigation';
import {backendGet,BackendError} from '@/lib/api/backend-get';
import {businessControllerGetFullBySlug,businessProfileControllerGetFeatures} from '@/design/api/generated/server';
import {BusinessLivePage} from '@/design/pages/business-live';
import {getAccessTokenCookie} from '@/lib/auth/cookies';
import type {ReviewData} from '@/features/public/types/review';
import {businessSlugFromRoute} from '@/features/public/lib/business-slug';
const getBusiness=cache(async(slug:string)=>{
  try{return await businessControllerGetFullBySlug(slug);}
  catch(error) {
    if(error instanceof BackendError&&error.status===404)notFound();throw error;
  }
});
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const slug=businessSlugFromRoute((await params).slug);if(!slug)notFound();const business=await getBusiness(slug);
  return {title:business.name+' | ایران پلازا',description:business.description??business.name,alternates:{canonical:'/businesses/'+encodeURIComponent(slug)}};
}
export default async function Page({params}:{params:Promise<{slug:string}>}){
  const slug=businessSlugFromRoute((await params).slug);if(!slug)notFound();const business=await getBusiness(slug); const token=await getAccessTokenCookie();
  const [reviews,favorites,features]=await Promise.all([backendGet<ReviewData[]>('/api/businesses/'+business.id+'/reviews'),token?backendGet<{id:string}[]>('/api/users/me/favorites',token):Promise.resolve([]),businessProfileControllerGetFeatures(business.id)]);
  return <BusinessLivePage business={business} reviews={reviews} features={features} favorited={favorites.some(f=>f.id===business.id)}/>;
}
