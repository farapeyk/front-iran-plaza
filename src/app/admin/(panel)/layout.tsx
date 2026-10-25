import { AdminSidebar } from "@/features/admin/components/admin-sidebar";
import { getCurrentUser } from "@/lib/auth/get-current-user";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const currentUser = await getCurrentUser();
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col md:flex-row" dir="rtl">
      <AdminSidebar isSuperAdmin={currentUser?.userType === "SUPER_ADMIN"} />
      <main className="flex-1 min-w-0 px-4 md:px-8 py-8 max-w-4xl">{children}</main>
    </div>
  );
}
