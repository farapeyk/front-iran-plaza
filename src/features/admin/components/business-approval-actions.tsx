"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { approveBusinessAction, rejectBusinessAction, suspendBusinessAction } from "@/features/admin/actions/moderation.action";

const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  PENDING: { label: "در انتظار تایید", className: "text-amber-600 bg-amber-50" },
  APPROVED: { label: "تایید شده", className: "text-emerald-700 bg-emerald-50" },
  REJECTED: { label: "رد شده", className: "text-red-600 bg-red-50" },
  SUSPENDED: { label: "معلق", className: "text-neutral-600 bg-neutral-100" },
};

export function BusinessApprovalActions({ businessId, status }: { businessId: string; status: string }) {
  const [isPending, startTransition] = useTransition();
  const [action, setAction] = useState<"reject" | "suspend" | null>(null);
  const [reason, setReason] = useState("");

  const badge = STATUS_LABEL[status] ?? STATUS_LABEL.PENDING;

  function handleApprove() {
    startTransition(async () => {
      const result = await approveBusinessAction(businessId);
      if (!result.success) toast.error(result.message);
      else toast.success("کسب‌وکار تایید شد");
    });
  }

  function handleConfirmReason() {
    if (!reason.trim()) {
      toast.error("دلیل را وارد کنید");
      return;
    }
    startTransition(async () => {
      const result =
        action === "reject" ? await rejectBusinessAction(businessId, reason) : await suspendBusinessAction(businessId, reason);
      if (!result.success) toast.error(result.message);
      else {
        toast.success(action === "reject" ? "کسب‌وکار رد شد" : "کسب‌وکار معلق شد");
        setAction(null);
        setReason("");
      }
    });
  }

  return (
    <div className="border border-neutral-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-bold text-neutral-900">وضعیت کسب‌وکار</p>
        <span className={`text-xs px-2 py-0.5 rounded-full ${badge.className}`}>{badge.label}</span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleApprove}
          disabled={isPending || status === "APPROVED"}
          className="flex-1 text-sm py-2 rounded-md bg-emerald-950 text-white hover:bg-emerald-900 disabled:opacity-50"
        >
          تایید کسب‌وکار
        </button>
        <button
          onClick={() => setAction((v) => (v === "reject" ? null : "reject"))}
          disabled={isPending}
          className="flex-1 text-sm py-2 rounded-md border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50"
        >
          رد
        </button>
        <button
          onClick={() => setAction((v) => (v === "suspend" ? null : "suspend"))}
          disabled={isPending}
          className="flex-1 text-sm py-2 rounded-md border border-neutral-300 text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
        >
          تعلیق
        </button>
      </div>

      {action && (
        <div className="mt-3 flex gap-2">
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={action === "reject" ? "دلیل رد" : "دلیل تعلیق"}
            className="flex-1 h-9 rounded-md border border-input px-3 text-sm"
            disabled={isPending}
          />
          <button
            onClick={handleConfirmReason}
            disabled={isPending}
            className="text-sm px-3 rounded-md bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-50"
          >
            ثبت
          </button>
        </div>
      )}
    </div>
  );
}
