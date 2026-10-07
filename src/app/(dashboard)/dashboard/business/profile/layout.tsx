import { redirect } from 'next/navigation';
import { getMyBusiness } from '@/features/business/lib/get-my-business';
import { OnboardingProvider } from '@/features/business/components/profile/onboarding-context';
import { getAccessTokenCookie } from '@/lib/auth/cookies';
import { getRegistrationDocuments } from '@/features/business/lib/get-registration-documents';
import { registrationIncomplete } from '@/features/business/lib/registration';

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  const business = await getMyBusiness();
  if (!business) redirect('/dashboard/business/new');
  const token = await getAccessTokenCookie();
  if (!token) redirect('/dashboard/business/new');
  const documents = await getRegistrationDocuments(token, business.id);
  if (registrationIncomplete(documents)) redirect('/dashboard/business/new');
  if (business.status !== 'APPROVED') redirect('/dashboard');
  return <OnboardingProvider key={`${business.id}:${business.onboardingStep ?? 11}`} businessId={business.id} savedStep={business.onboardingStep ?? 11}>{children}</OnboardingProvider>;
}
