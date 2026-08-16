import { AdminLoginForm } from "@/features/admin/components/admin-login-form";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4" dir="rtl">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-sm p-8">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold text-neutral-900">ورود به پنل ادمین</h1>
          <p className="mt-1 text-sm text-neutral-500">ایران پلازا</p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  );
}