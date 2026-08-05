import { LoginFlow } from "@/features/auth/components/login-flow";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4" dir="rtl">
      <div className="w-full max-w-sm">
        {/* نوار تزئینی بالای کارت — الهام‌گرفته از کاشی‌کاری هندسی، بدون شلوغی */}
        <div
          className="h-1.5 w-full rounded-t-lg"
          style={{
            background:
              "repeating-linear-gradient(135deg, #0F6B62 0px, #0F6B62 10px, #E9C46A 10px, #E9C46A 20px)",
          }}
        />
        <div className="bg-white border border-neutral-200 border-t-0 rounded-b-lg shadow-sm p-8">
          <div className="mb-6 text-center">
            <h1 className="text-xl font-semibold text-neutral-900">ورود به ایران پلازا</h1>
            <p className="mt-1 text-sm text-neutral-500">
              با شماره موبایل خود وارد شوید
            </p>
          </div>

          <LoginFlow />
        </div>
      </div>
    </div>
  );
}
