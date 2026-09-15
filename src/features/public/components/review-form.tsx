"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { submitReviewAction } from "@/features/public/actions/reviews.action";

export function ReviewForm({ businessId, isLoggedIn }: { businessId: string; isLoggedIn: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isLoggedIn) {
    return (
      <p className="text-sm text-neutral-500">
        برای ثبت نظر <a href="/login" className="text-emerald-800 font-medium">وارد حساب کاربری</a> شوید.
      </p>
    );
  }

  if (submitted) {
    return <p className="text-sm text-emerald-700">نظر شما ثبت شد و پس از تایید نمایش داده می‌شود.</p>;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      toast.error("امتیاز را انتخاب کنید");
      return;
    }
    startTransition(async () => {
      const result = await submitReviewAction(businessId, { rating, comment: comment || undefined });
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      setSubmitted(true);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3" dir="rtl">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button key={star} type="button" onClick={() => setRating(star)} disabled={isPending}>
            <Star size={22} className={star <= rating ? "fill-amber-400 text-amber-400" : "text-neutral-300"} />
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="نظر خود را بنویسید (اختیاری)"
        rows={2}
        disabled={isPending}
        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? "در حال ثبت..." : "ثبت نظر"}
      </Button>
    </form>
  );
}