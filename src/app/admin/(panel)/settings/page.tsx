import { getTrackingStatus, toggleTrackingAction } from "@/features/admin/actions/settings.action";
import { TrackingToggle } from "@/features/admin/components/tracking-toggle";

export default async function AdminSettingsPage() {
  const isTrackingEnabled = await getTrackingStatus();

  return (
    <div dir="rtl">
      <h1 className="text-lg font-bold text-neutral-900 mb-1">تنظیمات سیستم</h1>
      <p className="text-sm text-neutral-500 mb-6">مدیریت رفتار سیستم و دیتابیس</p>

      <div className="bg-white border border-neutral-200 rounded-lg p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-neutral-900">سیستم رهگیری کاربران (Tracking)</p>
          <p className="text-xs text-neutral-500 mt-1">جهت جلوگیری از پر شدن دیتابیس، می‌توانید موقتاً غیرفعال کنید.</p>
        </div>
        <TrackingToggle initialEnabled={isTrackingEnabled} />
      </div>
    </div>
  );
}