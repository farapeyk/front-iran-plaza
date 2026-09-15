// src/app/(public)/layout.tsx
import { SiteHeader } from "@/features/public/components/site-header";
import { getCurrentUser } from "@/lib/auth/get-current-user";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser(); 

  return (
    <div className="min-h-screen bg-[#FBF1E8]">
      <SiteHeader user={user} /> 
      {children}
    </div>
  );
}