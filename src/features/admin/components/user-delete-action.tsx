"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteUserAction } from "@/features/admin/actions/users.action";

export function UserDeleteAction({ userId, userName }: { userId: string; userName: string }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [reason, setReason] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    const normalizedReason = reason.trim();
    if (normalizedReason.length < 5) {
      toast.error("دلیل حذف باید حداقل ۵ کاراکتر باشد");
      return;
    }
    if (!window.confirm(`حساب ${userName} به‌طور کامل از دسترس خارج شود؟ این عملیات قابل بازگشت از پنل نیست؛ سوابق مالی، audit و کسب‌وکارهای مرتبط برای یکپارچگی داده حفظ می‌شوند.`)) return;

    startTransition(async () => {
      const result = await deleteUserAction(userId, normalizedReason);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success("حساب کاربر حذف شد");
      router.replace("/admin/users");
      router.refresh();
    });
  }

  return (
    <div id="delete-user" className="scroll-mt-6 rounded-lg border border-red-200 bg-red-50/50 p-4">
      <button
        type="button"
        onClick={() => setExpanded(value => !value)}
        disabled={isPending}
        className="inline-flex items-center gap-2 rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
      >
        <Trash2 size={16} aria-hidden="true" />
        حذف کامل حساب
      </button>
      {expanded && (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-red-800">حساب، ورود و همه دسترسی‌های فعال حذف می‌شوند و کاربر دیگر در پنل دیده نمی‌شود. سوابق مالی، audit و کسب‌وکارهای مرتبط برای یکپارچگی داده نگهداری می‌شوند.</p>
          <label htmlFor="delete-user-reason" className="block text-sm font-medium text-neutral-800">دلیل حذف</label>
          <textarea
            id="delete-user-reason"
            value={reason}
            onChange={event => setReason(event.target.value)}
            minLength={5}
            maxLength={500}
            rows={3}
            disabled={isPending}
            className="w-full rounded-md border border-red-200 bg-white px-3 py-2 text-sm"
            placeholder="دلیل حذف حساب را ثبت کنید"
          />
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="rounded-md bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800 disabled:opacity-50"
          >
            {isPending ? "در حال حذف…" : "تأیید حذف کامل حساب"}
          </button>
        </div>
      )}
    </div>
  );
}
