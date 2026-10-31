import { DesignProvider } from '@/design/provider';
import { getDesignAccount } from '@/design/lib/get-design-account';
import { ConfiguredSiteAnalytics } from '@/features/analytics/configured-site-analytics';

export default async function Layout({children}:{children:React.ReactNode}) {
  const { user, business } = await getDesignAccount();
  return <DesignProvider user={user} business={business}>{children}<ConfiguredSiteAnalytics /></DesignProvider>;
}
