import { redirect } from "next/navigation";
import { businessControllerGetMine } from "@/design/api/generated/server";
import { BusinessDashboardLivePage } from "@/design/pages/business-dashboard-live";

export default async function BusinessDashboardPage() {
  const businesses = await businessControllerGetMine();
  const business = businesses[0];
  if (!business) redirect("/dashboard/business/new");

  return <BusinessDashboardLivePage business={business} />;
}
