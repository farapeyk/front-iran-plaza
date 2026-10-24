"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, Upload } from "lucide-react";
import { uploadFileAction } from "@/features/business/actions/upload-file.action";
import type { ContentMediaItem } from "@/features/content/types";

export function ContentMediaLibrary({ items }: { items: ContentMediaItem[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState("");
  const [pending, startTransition] = useTransition();

  function upload(file?: File) {
    if (!file) return;
    startTransition(async () => {
      const data = new FormData(); data.set("file", file);
      const result = await uploadFileAction(data);
      setMessage(result.success ? "تصویر به کتابخانه اضافه شد." : result.message);
      if (result.success) router.refresh();
      if (inputRef.current) inputRef.current.value = "";
    });
  }

  return <div className="space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div><h1 className="text-2xl font-black">کتابخانه رسانه</h1><p className="mt-1 text-sm text-slate-500">تصاویر آپلودشده را ببینید و شناسهٔ آن‌ها را برای استفاده در محتوا کپی کنید.</p></div><label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white"><Upload className="size-4" />{pending ? "در حال آپلود…" : "آپلود تصویر"}<input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={pending} className="sr-only" onChange={event => upload(event.target.files?.[0])} /></label></div>
    {message ? <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p> : null}
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{items.map(item => <article key={item.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="relative aspect-[4/3] bg-slate-100"><Image fill unoptimized src={`/api/backend/files/${encodeURIComponent(item.id)}`} alt={item.fileName} className="object-cover" /></div><div className="space-y-2 p-3"><p className="truncate text-sm font-bold" title={item.fileName}>{item.fileName}</p><p className="text-xs text-slate-500">{item.width && item.height ? `${item.width.toLocaleString("fa-IR")} × ${item.height.toLocaleString("fa-IR")}` : "ابعاد نامشخص"} · {new Date(item.createdAt).toLocaleDateString("fa-IR", { timeZone: "Asia/Tehran" })}</p><button type="button" onClick={async () => { await navigator.clipboard.writeText(item.id); setCopied(item.id); }} className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold">{copied === item.id ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}{copied === item.id ? "کپی شد" : "کپی شناسه"}</button></div></article>)}</div>
    {!items.length ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">هنوز تصویری در کتابخانه وجود ندارد.</div> : null}
  </div>;
}
