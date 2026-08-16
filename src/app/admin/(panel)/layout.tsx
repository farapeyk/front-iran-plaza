import { AdminSidebar } from "@/features/admin/components/admin-sidebar";

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50 flex" dir="rtl">
      <AdminSidebar />
      <main className="flex-1 px-8 py-8 max-w-4xl">{children}</main>
    </div>
  );
}