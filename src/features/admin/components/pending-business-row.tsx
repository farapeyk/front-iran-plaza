"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { approveBusinessAction, rejectBusinessAction } from "@/features/admin/actions/moderation.action";

interface PendingBusinessRowProps {
  id: string;
  name: string;
  phone: string;
  address: string | null;
  createdAt: string;
}

export function PendingBusinessRow({ id, name, phone, address, createdAt }: PendingBusinessRowProps) {
  const [isPending, startTransition] = useTransition();
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState("");

  function handleApprove() {
    startTransition(async () => {
      const result = await approveBusinessAction(id);
      if (!result.success) toast.error(result.message);
      else toast.success("کسب‌وکار تایید شد");
    });
  }

  function handleReject() {
    if (!reason.trim()) {
      toast.error("دلیل رد را وارد کنید");
      return;
    }
    startTransition(async () => {
      const result = await rejectBusinessAction(id, reason);
      if (!result.success) toast.error(result.message);
      else {
        toast.success("کسب‌وکار رد شد");
        setShowReject(false);
      }
    });
  }

  return (
    <div className="border border-neutral-200 rounded-lg p-4" dir="rtl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Link href={`/admin/businesses/${id}`} className="font-bold text-neutral-900 hover:underline">
            {name}
          </Link>
          <p className="text-sm text-neutral-500 mt-1" dir="ltr">
            {phone}
          </p>
          {address && <p className="text-sm text-neutral-500 mt-0.5">{address}</p>}
          <p className="text-xs text-neutral-400 mt-1">{new Date(createdAt).toLocaleDateString("fa-IR")}</p>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleApprove}
            disabled={isPending}
            className="text-sm px-3 py-1.5 rounded-md bg-emerald-950 text-white hover:bg-emerald-900 disabled:opacity-50"
          >
            تایید
          </button>
          <button
            onClick={() => setShowReject((v) => !v)}
            disabled={isPending}
            className="text-sm px-3 py-1.5 rounded-md border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            رد
          </button>
        </div>
      </div>

      {showReject && (
        <div className="mt-3 flex gap-2">
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="دلیل رد کسب‌وکار"
            className="flex-1 h-9 rounded-md border border-input px-3 text-sm"
            disabled={isPending}
          />
          <button
            onClick={handleReject}
            disabled={isPending}
            className="text-sm px-3 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
          >
            ثبت رد
          </button>
        </div>
      )}
    </div>
  );
}
