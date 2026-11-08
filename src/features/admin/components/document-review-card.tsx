"use client";
import Image from "next/image";

import { useEffect, useState, useTransition } from "react";
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
  return `/api/backend/files/${encodeURIComponent(fileId)}`;
}

export function DocumentReviewCard({ document, businessId }: { document: BusinessDocumentData; businessId: string }) {
  const [isPending, startTransition] = useTransition();
  const [showReject, setShowReject] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [reason, setReason] = useState("");

  const status = STATUS_LABEL[document.status] ?? STATUS_LABEL.PENDING;
  const documentLabel = DOC_TYPE_LABEL[document.type] ?? document.type;
  const imageUrl = fileUrl(document.fileId);

  useEffect(() => {
    if (!showImage) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowImage(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showImage]);

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
      <button type="button" onClick={() => setShowImage(true)} aria-label={`نمایش بزرگ ${documentLabel}`} className="block w-full cursor-zoom-in bg-neutral-100">
        <Image unoptimized src={imageUrl} alt={documentLabel} width={960} height={720} sizes="(min-width: 768px) 50vw, 100vw" className="max-h-80 w-full object-contain" />
        <span className="block border-t border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-emerald-900">برای بررسی، تصویر را باز کنید</span>
      </button>

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

      {showImage ? (
        <div role="dialog" aria-modal="true" aria-label={`بررسی ${documentLabel}`} onClick={() => setShowImage(false)} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-3 sm:p-6">
          <div onClick={event => event.stopPropagation()} className="flex h-[92dvh] max-h-[900px] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex shrink-0 items-center justify-between gap-3 border-b px-4 py-3">
              <h2 className="font-bold text-neutral-900">{documentLabel}</h2>
              <div className="flex items-center gap-3">
                <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-emerald-900 underline">باز کردن در زبانهٔ جدید</a>
                <button type="button" autoFocus onClick={() => setShowImage(false)} className="rounded-md border px-3 py-1.5 text-sm hover:bg-neutral-50">بستن <span aria-hidden="true">×</span></button>
              </div>
            </div>
            <div className="relative min-h-0 flex-1 bg-neutral-950">
              <Image unoptimized fill sizes="(min-width: 1024px) 90vw, 100vw" src={imageUrl} alt={documentLabel} className="object-contain" />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
