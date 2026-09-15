import { redirect } from "next/navigation";
import { getMyBusiness } from "@/features/business/lib/get-my-business";
import { getAccessTokenCookie } from "@/lib/auth/cookies";
import { ProfileEditShell } from "@/features/business/components/profile/profile-edit-shell";
import { InstallmentForm } from "@/features/business/components/profile/installment-form";
import type { InstallmentPlanData } from "@/features/business/types/business-extras";

async function getInstallmentPlan(businessId: string, accessToken: string): Promise<InstallmentPlanData | null> {
  const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}/api/businesses/${businessId}/installment-plan`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  
  // اگر استاتوس 204 (No Content) یا 404 بود، یا اصلا ok نبود
  if (!res.ok || res.status === 204) return null;
  
  // خواندن متن خام پاسخ
  const text = await res.text();
  
  // اگر متن خالی بود، null برگردان
  if (!text) return null;
  
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("Failed to parse installment plan:", error);
    return null;
  }
}

export default async function InstallmentPage() {
  const business = await getMyBusiness();
  if (!business) redirect("/dashboard/business/new");

  const accessToken = await getAccessTokenCookie();
  const plan = accessToken ? await getInstallmentPlan(business.id, accessToken) : null;

  return (
    <ProfileEditShell title="شرایط اقساط">
      <InstallmentForm businessId={business.id} initialPlan={plan} />
    </ProfileEditShell>
  );
}