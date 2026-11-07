import { redirect } from "next/navigation";
import { businessControllerGetMine, businessProfileControllerGetAnalytics } from "@/design/api/generated/server";
import { BusinessDashboardLivePage } from "@/design/pages/business-dashboard-live";

export default async function BusinessDashboardPage() {
  const businesses = await businessControllerGetMine();
  const business = businesses[0];
  if (!business) redirect("/dashboard/business/new");

  let analytics: Record<string, number> = {};
  let analyticsAvailable = true;
  try {
    analytics = await businessProfileControllerGetAnalytics(business.id);
  } catch {
    analyticsAvailable = false;
  }

  return <BusinessDashboardLivePage business={business} analytics={analytics} analyticsAvailable={analyticsAvailable} />;
}
