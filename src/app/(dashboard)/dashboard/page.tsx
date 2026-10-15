import {DashboardLivePage} from '@/design/pages/dashboard-live';
import {getMyBusiness} from '@/features/business/lib/get-my-business';
import {getAccessTokenCookie} from '@/lib/auth/cookies';
import {getRegistrationDocuments} from '@/features/business/lib/get-registration-documents';
import {registrationIncomplete} from '@/features/business/lib/registration';
import {getCurrentUser} from '@/lib/auth/get-current-user';
export default async function Page(){const [business,user]=await Promise.all([getMyBusiness(),getCurrentUser()]);const token=await getAccessTokenCookie();const docs=business&&token?await getRegistrationDocuments(token,business.id):[];return <DashboardLivePage needsRegistration={!!business&&registrationIncomplete(docs)} canWriteContent={user?.contentAccess?.canWrite===true}/>;}
