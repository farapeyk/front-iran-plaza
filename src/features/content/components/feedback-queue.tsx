"use client";

import { useState, useTransition } from "react";
import { moderateArticleFeedbackAction } from "@/features/content/actions/content.action";
import type { ArticleFeedbackQueueItem } from "@/features/content/types";

export function FeedbackQueue({ items }: { items: ArticleFeedbackQueueItem[] }) {
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  return <div className="space-y-3">{items.map(item => <article key={item.id} className="space-y-3 rounded-lg border bg-white p-4"><div className="flex flex-wrap justify-between gap-3"><div><strong>{item.article.title}</strong><p className="text-sm text-neutral-500">{item.user.fullName || "کاربر بدون نام"}</p></div>{item.rating !== null ? <span>{item.rating.toLocaleString("fa-IR")} از ۵</span> : <span className="text-neutral-500">بدون امتیاز قدیمی</span>}</div>{item.comment ? <p>{item.comment}</p> : <p className="text-neutral-400">بدون متن</p>}<div className="flex gap-2"><button disabled={pending} onClick={() => startTransition(async () => { const result = await moderateArticleFeedbackAction(item.id, "APPROVED"); setMessage(result.success ? "نظر تایید شد." : result.message); })} className="rounded-md bg-emerald-700 px-3 py-2 text-sm text-white">تأیید</button><button disabled={pending} onClick={() => startTransition(async () => { const result = await moderateArticleFeedbackAction(item.id, "REJECTED"); setMessage(result.success ? "نظر رد شد." : result.message); })} className="rounded-md border border-red-300 px-3 py-2 text-sm text-red-700">رد</button></div></article>)}{!items.length ? <p className="rounded-lg border bg-white p-8 text-center text-neutral-500">نظر در انتظار بررسی وجود ندارد.</p> : null}{message ? <p role="status">{message}</p> : null}</div>;
}
