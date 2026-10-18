"use client";

import { useState, useTransition } from "react";
import { Button } from "@/design/components/ui/button";
import { submitArticleFeedbackAction } from "@/features/content/actions/feedback.action";

export function ArticleFeedbackForm({ slug, averageRating, ratingCount }: { slug: string; averageRating: number | null; ratingCount: number }) {
  const [rating, setRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="space-y-4 rounded-[var(--radius-xs)] border bg-[var(--surface)] p-5"
      onSubmit={event => {
        event.preventDefault();
        if (rating === null) {
          setMessage("لطفاً ابتدا تعداد ستاره‌ها را انتخاب کنید.");
          return;
        }
        startTransition(async () => {
          const result = await submitArticleFeedbackAction(slug, { rating, comment: comment.trim() || undefined });
          setMessage(result.success ? "امتیاز و نظر شما ثبت شد و پس از بررسی نمایش داده می‌شود." : result.message);
          if (result.success) setComment("");
        });
      }}
    >
      <fieldset disabled={pending} className="space-y-4">
        <legend className="text-lg font-bold">به این مطلب امتیاز دهید</legend>
        <p className="text-sm text-[var(--text-body)]">
          {averageRating === null
            ? "هنوز امتیازی ثبت نشده است."
            : `میانگین ${averageRating.toLocaleString("fa-IR", { maximumFractionDigits: 1 })} از ۵، بر اساس ${ratingCount.toLocaleString("fa-IR")} رأی`}
        </p>
        <div className="flex w-fit gap-1" dir="ltr" role="radiogroup" aria-label="انتخاب امتیاز" onMouseLeave={() => setHoveredRating(null)}>
          {[1, 2, 3, 4, 5].map(value => (
            <label key={value} className="cursor-pointer rounded p-1 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary-700" onMouseEnter={() => setHoveredRating(value)}>
              <input className="sr-only" type="radio" name="article-rating" value={value} checked={rating === value} onChange={() => { setRating(value); setMessage(""); }} />
              <span aria-hidden="true" className={`text-4xl leading-none transition-colors ${value <= (hoveredRating ?? rating ?? 0) ? "text-amber-500" : "text-neutral-300"}`}>★</span>
              <span className="sr-only">{value.toLocaleString("fa-IR")} ستاره</span>
            </label>
          ))}
        </div>
        <label className="block space-y-2">
          <span className="font-medium">نظر شما (اختیاری)</span>
          <textarea value={comment} onChange={event => setComment(event.target.value)} maxLength={2000} rows={4} className="w-full rounded-[var(--radius-xs)] border p-3" placeholder="تجربه یا دیدگاه خود را بنویسید…" />
        </label>
        <Button type="submit" disabled={pending || rating === null}>{pending ? "در حال ثبت…" : "ثبت امتیاز"}</Button>
      </fieldset>
      {message ? <p role="status" className="text-sm">{message}</p> : null}
    </form>
  );
}
