"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { submitReviewReplyAction } from "@/features/public/actions/reviews.action";
import type { ReviewData } from "@/features/public/types/review";

function ReplyForm({ reviewId, onSent }: { reviewId: string; onSent: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [comment, setComment] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!comment.trim()) return;
    startTransition(async () => {
      const result = await submitReviewReplyAction(reviewId, comment);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      setComment("");
      onSent();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
      <input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="پاسخ..." disabled={isPending} className="flex-1 h-8 rounded-md border border-input px-2 text-xs" />
      <button type="submit" disabled={isPending} className="text-xs px-2 rounded-md bg-neutral-900 text-white">
        ارسال
      </button>
    </form>
  );
}

export function ReviewsList({ reviews, isLoggedIn }: { reviews: ReviewData[]; isLoggedIn: boolean }) {
  const [openReplyFor, setOpenReplyFor] = useState<string | null>(null);

  if (reviews.length === 0) {
    return <p className="text-sm text-neutral-500">هنوز نظری ثبت نشده.</p>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="border-b border-neutral-100 pb-3 last:border-0">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-800">{review.user.fullName ?? "کاربر"}</span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={14} className={star <= review.rating ? "fill-amber-400 text-amber-400" : "text-neutral-200"} />
              ))}
            </div>
          </div>
          {review.comment && <p className="text-sm text-neutral-600 mt-1">{review.comment}</p>}

          {review.replies.length > 0 && (
            <div className="mt-2 mr-4 space-y-1.5">
              {review.replies.map((r) => (
                <div key={r.id} className="text-xs bg-neutral-50 rounded-md px-2 py-1.5">
                  <span className="font-medium text-neutral-700">{r.isFromOwner ? "پاسخ صاحب کسب‌وکار: " : ""}</span>
                  <span className="text-neutral-600">{r.comment}</span>
                </div>
              ))}
            </div>
          )}

          {isLoggedIn && (
            <>
              <button onClick={() => setOpenReplyFor((v) => (v === review.id ? null : review.id))} className="text-xs text-emerald-800 mt-1.5">
                پاسخ
              </button>
              {openReplyFor === review.id && <ReplyForm reviewId={review.id} onSent={() => setOpenReplyFor(null)} />}
            </>
          )}
        </div>
      ))}
    </div>
  );
}