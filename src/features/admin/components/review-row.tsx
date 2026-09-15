"use client";

import { useTransition } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { updateReviewStatusAction, deleteReviewAction } from "@/features/admin/actions/reviews.action";

export interface AdminReviewItem {
  id: string;
  rating: number;
  comment: string | null;
  status: string;
  createdAt: string;
  business: { id: string; name: string };
  user: { fullName: string | null; phone: string };
}

export function ReviewRow({ review }: { review: AdminReviewItem }) {
  const [isPending, startTransition] = useTransition();

  function handleStatus(status: "APPROVED" | "REJECTED") {
    startTransition(async () => {
      const result = await updateReviewStatusAction(review.id, status);
      if (!result.success) toast.error(result.message);
      else toast.success(status === "APPROVED" ? "نظر تایید شد" : "نظر رد شد");
    });
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteReviewAction(review.id);
      if (!result.success) toast.error(result.message);
      else toast.success("نظر حذف شد");
    });
  }

  return (
    <div className="border border-neutral-200 rounded-lg p-4" dir="rtl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-900">{review.business.name}</span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={12} className={star <= review.rating ? "fill-amber-400 text-amber-400" : "text-neutral-200"} />
              ))}
            </div>
          </div>
          <p className="text-xs text-neutral-500 mt-1">{review.user.fullName ?? review.user.phone}</p>
          {review.comment && <p className="text-sm text-neutral-700 mt-2">{review.comment}</p>}
        </div>

        <div className="flex gap-2 shrink-0">
          {review.status === "PENDING" && (
            <>
              <button onClick={() => handleStatus("APPROVED")} disabled={isPending} className="text-sm px-3 py-1.5 rounded-md bg-emerald-950 text-white hover:bg-emerald-900 disabled:opacity-50">
                تایید
              </button>
              <button onClick={() => handleStatus("REJECTED")} disabled={isPending} className="text-sm px-3 py-1.5 rounded-md border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50">
                رد
              </button>
            </>
          )}
          <button onClick={handleDelete} disabled={isPending} className="text-sm px-3 py-1.5 rounded-md border border-neutral-300 text-neutral-600 hover:bg-neutral-50 disabled:opacity-50">
            حذف
          </button>
        </div>
      </div>
    </div>
  );
}