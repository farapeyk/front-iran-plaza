import {planControllerGetActivePlans} from '@/design/api/generated/server';
import {SubscriptionLivePage} from '@/design/pages/billing-live';
import {BackendError} from '@/lib/api/backend-get';
export default async function Page(){let plans:Awaited<ReturnType<typeof planControllerGetActivePlans>>=[];let available=true;try{plans=await planControllerGetActivePlans();}catch(error){if(error instanceof BackendError&&error.status===404)available=false;else throw error;}return <SubscriptionLivePage plans={plans} available={available}/>;}
