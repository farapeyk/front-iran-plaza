"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { CipBadge } from "@/design/components/cip-badge";
import { updateBusinessCipAction } from "@/features/admin/actions/cip.action";

export function CipStatusControl({ businessId, initialIsCip }: { businessId: string; initialIsCip: boolean }) {
  const [isCip, setIsCip] = useState(initialIsCip);
  const [pending, startTransition] = useTransition();

  function toggle() {
    const nextValue = !isCip;
    startTransition(async () => {
      const result = await updateBusinessCipAction(businessId, nextValue);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      setIsCip(result.data.isCip);
      toast.success(result.data.isCip ? "نشان CIP فعال شد" : "نشان CIP غیرفعال شد");
    });
  }

  return (
    <section className="rounded-lg border border-neutral-200 p-4" dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-neutral-900">نشان تحریریه</p>
            {isCip && <CipBadge />}
          </div>
          <p className="text-xs text-neutral-500">مستقل از پلن VIP، در پروفایل و فهرست کسب‌وکارهای مقالات نمایش داده می‌شود.</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={isCip}
          onClick={toggle}
          disabled={pending}
          className={`h-9 min-w-28 rounded-md px-4 text-sm font-bold transition-colors disabled:opacity-50 ${isCip ? "bg-black text-[#d4af37]" : "border border-neutral-300 bg-white text-neutral-700"}`}
        >
          {pending ? "در حال ذخیره…" : isCip ? "CIP فعال" : "فعال‌کردن CIP"}
        </button>
      </div>
    </section>
  );
}
