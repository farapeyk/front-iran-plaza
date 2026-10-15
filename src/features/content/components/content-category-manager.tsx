"use client";

import { useState, useTransition } from "react";
import { createContentCategoryAction, updateContentCategoryAction } from "@/features/content/actions/content.action";
import type { ContentCategory } from "@/features/content/types";

export function ContentCategoryManager({ categories }: { categories: ContentCategory[] }) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  return <div className="space-y-6"><form onSubmit={event => { event.preventDefault(); startTransition(async () => { const result = await createContentCategoryAction({ name, slug }); setMessage(result.success ? "دسته‌بندی ساخته شد." : result.message); if (result.success) { setName(""); setSlug(""); } }); }} className="grid gap-3 rounded-lg border bg-white p-4 sm:grid-cols-[1fr_1fr_auto]"><input required minLength={2} maxLength={100} value={name} onChange={event => setName(event.target.value)} placeholder="نام دسته‌بندی" className="rounded-md border px-3 py-2" /><input required dir="ltr" pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={slug} onChange={event => setSlug(event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))} placeholder="category-slug" className="rounded-md border px-3 py-2" /><button disabled={pending} className="rounded-md bg-emerald-950 px-4 py-2 text-white">افزودن</button></form>{message ? <p role="status">{message}</p> : null}<div className="space-y-2">{categories.map(item => <div key={item.id} className="flex items-center gap-3 rounded-lg border bg-white p-4"><div className="flex-1"><strong>{item.name}</strong><p className="text-xs text-neutral-500" dir="ltr">{item.slug}</p></div><button type="button" disabled={pending} onClick={() => startTransition(async () => { const result = await updateContentCategoryAction(item.id, { isActive: !item.isActive }); setMessage(result.success ? "وضعیت دسته‌بندی تغییر کرد." : result.message); })} className={`rounded-full px-3 py-1 text-sm ${item.isActive ? "bg-emerald-100 text-emerald-900" : "bg-neutral-100 text-neutral-500"}`}>{item.isActive ? "فعال" : "غیرفعال"}</button></div>)}</div></div>;
}
