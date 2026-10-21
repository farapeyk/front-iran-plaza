import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { CreateSuperAdminForm } from "@/features/admin/components/create-super-admin-form";

export default async function NewSuperAdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (user.userType !== "SUPER_ADMIN") redirect("/admin/users");
  return (
    <div>
      <h1 className="mb-2 text-lg font-bold text-neutral-900">ایجاد مدیر ارشد</h1>
      <p className="mb-6 text-sm text-neutral-500">حساب جدید با دسترسی کامل پلتفرم و ورود با رمز عبور ساخته می‌شود.</p>
      <CreateSuperAdminForm />
    </div>
  );
}
