import {DashboardLivePage} from '@/design/pages/dashboard-live';
import {getMyBusiness} from '@/features/business/lib/get-my-business';
import {getAccessTokenCookie} from '@/lib/auth/cookies';
import {getRegistrationDocuments} from '@/features/business/lib/get-registration-documents';
import {registrationIncomplete} from '@/features/business/lib/registration';
export default async function Page(){const business=await getMyBusiness();const token=await getAccessTokenCookie();const docs=business&&token?await getRegistrationDocuments(token,business.id):[];return <DashboardLivePage needsRegistration={!!business&&registrationIncomplete(docs)}/>;}
