"use client";

import { useState, useTransition } from "react";
import { Button } from "@/design/components/ui/button";
import { submitArticleFeedbackAction } from "@/features/content/actions/feedback.action";

export function ArticleFeedbackForm({ slug }: { slug: string }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="space-y-4 rounded-[var(--radius-xs)] border bg-[var(--surface)] p-5"
      onSubmit={event => {
        event.preventDefault();
        startTransition(async () => {
          const result = await submitArticleFeedbackAction(slug, { rating, comment: comment.trim() || undefined });
          setMessage(result.success ? "نظر شما ثبت شد و پس از بررسی نمایش داده می‌شود." : result.message);
          if (result.success) setComment("");
        });
      }}
    >
      <fieldset disabled={pending} className="space-y-4">
        <legend className="text-lg font-bold">به این مطلب امتیاز دهید</legend>
        <div className="flex gap-2" dir="ltr">
          {[1, 2, 3, 4, 5].map(value => (
            <button key={value} type="button" onClick={() => setRating(value)} aria-label={`${value} ستاره`} className={`text-2xl ${value <= rating ? "text-amber-500" : "text-neutral-300"}`}>★</button>
          ))}
        </div>
        <label className="block space-y-2">
          <span className="font-medium">نظر شما</span>
          <textarea value={comment} onChange={event => setComment(event.target.value)} maxLength={2000} rows={4} className="w-full rounded-[var(--radius-xs)] border p-3" placeholder="تجربه یا دیدگاه خود را بنویسید…" />
        </label>
        <Button type="submit">{pending ? "در حال ثبت…" : "ثبت نظر"}</Button>
      </fieldset>
      {message ? <p role="status" className="text-sm">{message}</p> : null}
    </form>
  );
}
