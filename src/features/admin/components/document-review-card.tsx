"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { approveDocumentAction, rejectDocumentAction } from "@/features/admin/actions/moderation.action";

const DOC_TYPE_LABEL: Record<string, string> = {
  NATIONAL_ID_FRONT: "روی کارت ملی",
  NATIONAL_ID_BACK: "پشت کارت ملی",
  BUSINESS_LICENSE_PHOTO: "پروانه کسب",
};

const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  PENDING: { label: "در انتظار بررسی", className: "text-amber-600 bg-amber-50" },
  APPROVED: { label: "تایید شده", className: "text-emerald-700 bg-emerald-50" },
  REJECTED: { label: "رد شده", className: "text-red-600 bg-red-50" },
};

export interface BusinessDocumentData {
  id: string;
  type: string;
  status: string;
  fileId: string;
  rejectionReason?: string | null;
}

// ⚠️ آدرس تصویر فرضی است — هیچ GET /api/files/:id برای نمایش فایل توی
// Swagger شما نبود (فقط DELETE هست). اگه فایل‌ها از مسیر دیگه‌ای سرو
// می‌شن، این تابع رو اصلاح کنید.
function fileUrl(fileId: string) {
  return `/api/backend/files/${fileId}`;
}

export function DocumentReviewCard({ document, businessId }: { document: BusinessDocumentData; businessId: string }) {
  const [isPending, startTransition] = useTransition();
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState("");

  const status = STATUS_LABEL[document.status] ?? STATUS_LABEL.PENDING;

  function handleApprove() {
    startTransition(async () => {
      const result = await approveDocumentAction(document.id, businessId);
      if (!result.success) toast.error(result.message);
      else toast.success("مدرک تایید شد");
    });
  }

  function handleReject() {
    if (!reason.trim()) {
      toast.error("دلیل رد را وارد کنید");
      return;
    }
    startTransition(async () => {
      const result = await rejectDocumentAction(document.id, businessId, reason);
      if (!result.success) toast.error(result.message);
      else {
        toast.success("مدرک رد شد");
        setShowReject(false);
      }
    });
  }

  return (
    <div className="border border-neutral-200 rounded-lg overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={fileUrl(document.fileId)} alt={DOC_TYPE_LABEL[document.type] ?? document.type} className="w-full h-40 object-cover bg-neutral-100" />

      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-bold text-neutral-900">{DOC_TYPE_LABEL[document.type] ?? document.type}</p>
          <span className={`text-xs px-2 py-0.5 rounded-full ${status.className}`}>{status.label}</span>
        </div>

        {document.rejectionReason && (
          <p className="text-xs text-red-600 mb-2">دلیل رد قبلی: {document.rejectionReason}</p>
        )}

        {document.status === "PENDING" && (
          <>
            <div className="flex gap-2">
              <button
                onClick={handleApprove}
                disabled={isPending}
                className="flex-1 text-sm py-1.5 rounded-md bg-emerald-950 text-white hover:bg-emerald-900 disabled:opacity-50"
              >
                تایید مدرک
              </button>
              <button
                onClick={() => setShowReject((v) => !v)}
                disabled={isPending}
                className="flex-1 text-sm py-1.5 rounded-md border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                رد مدرک
              </button>
            </div>

            {showReject && (
              <div className="mt-2 flex gap-2">
                <input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="دلیل رد"
                  className="flex-1 h-8 rounded-md border border-input px-2 text-xs"
                  disabled={isPending}
                />
                <button
                  onClick={handleReject}
                  disabled={isPending}
                  className="text-xs px-2 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                >
                  ثبت
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
