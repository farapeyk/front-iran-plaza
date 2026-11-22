import {ProfileOverview} from '@/design/pages/dashboard-live';
import {businessControllerGetMine} from '@/design/api/generated/server';
import {redirect} from 'next/navigation';
import {profileStepUrl} from '@/features/business/lib/onboarding-steps';
export default async function Page(){const businesses=await businessControllerGetMine();const business=businesses[0];if(!business)redirect('/dashboard/business/new');if(business.onboardingStep<11)redirect(profileStepUrl(business.onboardingStep));return <ProfileOverview slug={business.slug}/>;}
