"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { uploadFileAction } from "@/features/business/actions/upload-file.action";
import { createArticleBannerAction, deleteArticleBannerAction, updateArticleBannerAction, type ArticleBannerInput } from "@/features/content/actions/content.action";
import type { ArticleBanner, ArticleStatus } from "@/features/content/types";

const fieldClass = "w-full rounded-md border border-neutral-300 bg-white px-3 py-2 outline-none focus:border-emerald-700";
const statusLabel: Record<ArticleStatus, string> = { DRAFT: "پیش‌نویس", IN_REVIEW: "در بررسی", CHANGES_REQUESTED: "نیازمند اصلاح", APPROVED: "تأییدشده", PUBLISHED: "منتشرشده", ARCHIVED: "بایگانی" };
type BannerArticle = { id: string; title: string; status: ArticleStatus };

function localDate(iso?: string | null) {
  if (!iso) return "";
  const date = new Date(iso);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}
function isoDate(value: string): string | null { return value ? new Date(value).toISOString() : null; }

function BannerImageUpload({ imageId, alt, onChange }: { imageId: string; alt: string; onChange: (imageId: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  return <div className="space-y-2"><label className="flex min-h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed bg-neutral-50 p-3">{imageId ? <Image unoptimized width={560} height={160} src={`/api/backend/files/${encodeURIComponent(imageId)}`} alt={alt || "پیش‌نمایش بنر"} className="max-h-40 w-full rounded object-contain" /> : <><ImagePlus /><span>آپلود تصویر بنر (JPEG، PNG، WebP یا GIF)</span></>}<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" disabled={uploading} className="sr-only" onChange={async event => { const file = event.target.files?.[0]; if (!file) return; setUploading(true); const formData = new FormData(); formData.set("file", file); const result = await uploadFileAction(formData); setUploading(false); if (result.success) { onChange(result.fileId); setMessage("تصویر آپلود شد."); } else setMessage(result.message); event.target.value = ""; }} /></label>{message ? <p role="status" className="text-xs text-neutral-500">{uploading ? "در حال آپلود…" : message}</p> : null}</div>;
}

function BannerFields({ value, onChange, articles }: { value: ArticleBannerInput; onChange: (value: ArticleBannerInput) => void; articles: BannerArticle[] }) {
  const update = <K extends keyof ArticleBannerInput>(key: K, next: ArticleBannerInput[K]) => onChange({ ...value, [key]: next });
  const toggleArticle = (id: string) => update("articleIds", value.articleIds?.includes(id) ? value.articleIds.filter(item => item !== id) : [...(value.articleIds ?? []), id]);
  return <div className="grid gap-4 md:grid-cols-2">
    <div className="md:col-span-2"><BannerImageUpload imageId={value.imageId} alt={value.altText} onChange={imageId => update("imageId", imageId)} /></div>
    <label className="space-y-1"><span>عنوان داخلی بنر</span><input required minLength={2} maxLength={120} value={value.title} onChange={event => update("title", event.target.value)} className={fieldClass} /></label>
    <label className="space-y-1"><span>متن جایگزین تصویر</span><input required minLength={2} maxLength={160} value={value.altText} onChange={event => update("altText", event.target.value)} className={fieldClass} /></label>
    <label className="space-y-1 md:col-span-2"><span>لینک مقصد</span><input required dir="ltr" type="url" maxLength={500} value={value.targetUrl} onChange={event => update("targetUrl", event.target.value)} placeholder="https://iranplaza.ir/register" className={fieldClass} /></label>
    <label className="space-y-1"><span>محل نمایش</span><select value={value.placement} onChange={event => update("placement", event.target.value as ArticleBannerInput["placement"])} className={fieldClass}><option value="TOP">بالای تصویر اصلی</option><option value="SIDEBAR">سایدبار، زیر ثبت کسب‌وکار</option></select></label>
    <label className="space-y-1"><span>اولویت نمایش</span><input type="number" min={0} value={value.sortOrder ?? 0} onChange={event => update("sortOrder", Number(event.target.value))} className={fieldClass} /></label>
    <div className="space-y-3 rounded-md border p-3 md:col-span-2"><label className="flex items-center gap-2"><input type="checkbox" checked={value.showOnAllArticles ?? true} onChange={event => update("showOnAllArticles", event.target.checked)} />نمایش در همه مقاله‌ها</label>
      {!value.showOnAllArticles ? <fieldset className="space-y-2"><legend className="text-sm font-medium">مقاله‌های موردنظر را انتخاب کنید</legend><div className="max-h-56 space-y-1 overflow-y-auto rounded border p-2">{articles.map(article => <label key={article.id} className="flex items-center gap-2 rounded px-2 py-1 text-sm hover:bg-neutral-50"><input type="checkbox" checked={value.articleIds?.includes(article.id) ?? false} onChange={() => toggleArticle(article.id)} /><span>{article.title}</span><small className="text-neutral-500">{statusLabel[article.status]}</small></label>)}{articles.length === 0 ? <p className="p-2 text-sm text-neutral-500">مقاله‌ای برای انتخاب وجود ندارد.</p> : null}</div></fieldset> : <p className="text-xs text-neutral-500">بنر در همه صفحه‌های مقاله‌ای که نمایش بنر در آن‌ها فعال است، نمایش داده می‌شود.</p>}
    </div>
    <label className="space-y-1"><span>شروع نمایش (اختیاری)</span><input type="datetime-local" value={typeof value.startsAt === "string" ? localDate(value.startsAt) : ""} onChange={event => update("startsAt", isoDate(event.target.value))} className={fieldClass} /></label>
    <label className="space-y-1"><span>پایان نمایش (اختیاری)</span><input type="datetime-local" value={typeof value.endsAt === "string" ? localDate(value.endsAt) : ""} onChange={event => update("endsAt", isoDate(event.target.value))} className={fieldClass} /></label>
    <label className="flex items-center gap-2"><input type="checkbox" checked={value.isActive ?? true} onChange={event => update("isActive", event.target.checked)} />بنر فعال باشد</label>
  </div>;
}

function BannerItem({ banner, articles, onDone }: { banner: ArticleBanner; articles: BannerArticle[]; onDone: (message: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();
  const [value, setValue] = useState<ArticleBannerInput>({ title: banner.title, imageId: banner.imageId, altText: banner.altText, targetUrl: banner.targetUrl, placement: banner.placement, showOnAllArticles: banner.showOnAllArticles ?? true, articleIds: banner.articleIds ?? [], isActive: banner.isActive ?? true, startsAt: banner.startsAt ?? null, endsAt: banner.endsAt ?? null, sortOrder: banner.sortOrder });
  return <article className="space-y-4 rounded-lg border bg-white p-4">{editing ? <BannerFields value={value} onChange={setValue} articles={articles} /> : <div className="flex flex-col gap-4 sm:flex-row"><Image unoptimized width={260} height={120} src={`/api/backend/files/${encodeURIComponent(banner.imageId)}`} alt={banner.altText} className="h-28 w-full rounded border object-contain sm:w-64" /><div className="min-w-0 flex-1"><h2 className="font-bold">{banner.title}</h2><p className="mt-1 text-sm text-neutral-500">{banner.placement === "TOP" ? "بالای تصویر اصلی" : "سایدبار زیر ثبت کسب‌وکار"} · اولویت {banner.sortOrder.toLocaleString("fa-IR")}</p><p className="text-sm text-neutral-500">{banner.showOnAllArticles ?? true ? "همه مقاله‌ها" : `${banner.articleIds?.length ?? 0} مقاله منتخب`}</p><a href={banner.targetUrl} target="_blank" rel="noopener noreferrer" dir="ltr" className="mt-2 block truncate text-sm text-emerald-800 underline">{banner.targetUrl}</a></div></div>}
    <div className="flex flex-wrap gap-2">{editing ? <><button type="button" disabled={pending} onClick={() => startTransition(async () => { const result = await updateArticleBannerAction(banner.id, value); if (result.success) { setEditing(false); onDone("بنر ویرایش شد."); } else onDone(result.message); })} className="rounded-md bg-emerald-950 px-4 py-2 text-sm text-white">ذخیره</button><button type="button" disabled={pending} onClick={() => setEditing(false)} className="rounded-md border px-4 py-2 text-sm">انصراف</button></> : <><button type="button" onClick={() => setEditing(true)} className="rounded-md border px-4 py-2 text-sm">ویرایش</button><button type="button" disabled={pending} onClick={() => startTransition(async () => { const result = await updateArticleBannerAction(banner.id, { isActive: !(banner.isActive ?? true) }); onDone(result.success ? "وضعیت بنر تغییر کرد." : result.message); })} className={`rounded-md px-4 py-2 text-sm ${(banner.isActive ?? true) ? "bg-emerald-100 text-emerald-900" : "bg-neutral-100 text-neutral-600"}`}>{(banner.isActive ?? true) ? "فعال" : "غیرفعال"}</button><button type="button" disabled={pending} onClick={() => { if (!window.confirm("این بنر حذف شود؟")) return; startTransition(async () => { const result = await deleteArticleBannerAction(banner.id); onDone(result.success ? "بنر حذف شد." : result.message); }); }} className="flex items-center gap-1 rounded-md border border-red-200 px-3 py-2 text-sm text-red-700"><Trash2 size={15} />حذف</button></>}</div>
  </article>;
}

const emptyBanner: ArticleBannerInput = { title: "", imageId: "", altText: "", targetUrl: "", placement: "TOP", showOnAllArticles: true, articleIds: [], isActive: true, startsAt: null, endsAt: null, sortOrder: 0 };

export function ArticleBannerManager({ banners, articles }: { banners: ArticleBanner[]; articles: BannerArticle[] }) {
  const router = useRouter();
  const [value, setValue] = useState<ArticleBannerInput>(emptyBanner);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  const done = (nextMessage: string) => { setMessage(nextMessage); router.refresh(); };
  return <div className="space-y-6"><form onSubmit={event => { event.preventDefault(); startTransition(async () => { if (!value.imageId) { setMessage("تصویر بنر را آپلود کنید."); return; } if (!value.showOnAllArticles && !value.articleIds?.length) { setMessage("برای نمایش اختصاصی، دست‌کم یک مقاله انتخاب کنید."); return; } const result = await createArticleBannerAction(value); if (result.success) { setValue(emptyBanner); done("بنر ساخته شد."); } else setMessage(result.message); }); }} className="space-y-4 rounded-lg border bg-white p-5"><h2 className="text-lg font-bold">بنر جدید</h2><BannerFields value={value} onChange={setValue} articles={articles} /><button disabled={pending} className="rounded-md bg-emerald-950 px-5 py-2 text-white disabled:opacity-50">{pending ? "در حال ذخیره…" : "افزودن بنر"}</button></form>{message ? <p role="status" className="rounded-md bg-neutral-100 p-3 text-sm">{message}</p> : null}<div className="space-y-3">{banners.map(banner => <BannerItem key={banner.id} banner={banner} articles={articles} onDone={done} />)}{!banners.length ? <p className="rounded-lg border border-dashed bg-white p-8 text-center text-neutral-500">هنوز بنری برای مقاله‌ها ثبت نشده است.</p> : null}</div></div>;
}
