import {getMyBusiness} from '@/features/business/lib/get-my-business';
import {businessProfileControllerGetProductCategories} from '@/design/api/generated/server';
import {redirect} from 'next/navigation';
import {ProductLivePage} from '@/design/pages/product-live';
export default async function Page(){const business=await getMyBusiness();if(!business)redirect('/dashboard/business/new');return <ProductLivePage businessId={business.id} categories={await businessProfileControllerGetProductCategories(business.id)}/>;}
