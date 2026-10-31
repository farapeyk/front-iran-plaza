import type { Metadata } from "next";
import { HomePage } from '@/design/pages/home';
import { DesignProvider } from '@/design/provider';
import { getDesignAccount } from '@/design/lib/get-design-account';
import { ConfiguredSiteAnalytics } from '@/features/analytics/configured-site-analytics';

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function Page() {
  const { user, business } = await getDesignAccount();
  return <DesignProvider user={user} business={business}><HomePage /><ConfiguredSiteAnalytics /></DesignProvider>;
}
