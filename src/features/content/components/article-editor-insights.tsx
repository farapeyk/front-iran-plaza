"use client";

import { AlertTriangle, CheckCircle2, CircleMinus, History } from "lucide-react";
import type { ArticleBlock, ArticleRevision, ArticleSchemaType } from "@/features/content/types";
import { auditArticleSeo } from "@/features/content/lib/article-seo-audit";

const fieldClass = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100";

type Props = {
  title: string;
  slug: string;
  excerpt: string;
  coverImageAlt: string;
  blocks: ArticleBlock[];
  seoTitle: string;
  setSeoTitle: (value: string) => void;
  seoDescription: string;
  setSeoDescription: (value: string) => void;
  canonicalUrl: string;
  setCanonicalUrl: (value: string) => void;
  robotsIndex: boolean;
  setRobotsIndex: (value: boolean) => void;
  robotsFollow: boolean;
  setRobotsFollow: (value: boolean) => void;
  primaryKeyword: string;
  setPrimaryKeyword: (value: string) => void;
  schemaType: ArticleSchemaType;
  setSchemaType: (value: ArticleSchemaType) => void;
  revisions: ArticleRevision[];
};

export function ArticleEditorInsights(props: Props) {
  const audit = auditArticleSeo(props);
  const tone = audit.score >= 80 ? "text-emerald-700" : audit.score >= 55 ? "text-amber-700" : "text-red-700";
  const effectiveTitle = props.seoTitle || props.title || "عنوان مقاله";
  const effectiveDescription = props.seoDescription || props.excerpt || "توضیحات مقاله پس از تکمیل در اینجا نمایش داده می‌شود.";

  return <div className="space-y-5">
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div><p className="text-sm font-bold text-slate-700">امتیاز سئو</p><p className={`mt-1 text-3xl font-black ${tone}`}>{audit.score.toLocaleString("fa-IR")}</p></div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${audit.score >= 80 ? "bg-emerald-50 text-emerald-700" : audit.score >= 55 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"}`}>{audit.score >= 80 ? "خوب" : audit.score >= 55 ? "نیازمند بهبود" : "ضعیف"}</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-600 transition-all" style={{ width: `${audit.score}%` }} /></div>
    </section>

    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-base font-black text-slate-900">پیش‌نمایش در گوگل</h2>
      <div className="mt-3 rounded-xl border border-slate-200 p-4">
        <p className="text-xs text-slate-500" dir="ltr">iran-plaza.ir › {props.slug || "article"}</p>
        <p className="mt-1 line-clamp-2 text-lg text-blue-700">{effectiveTitle}</p>
        <p className="mt-1 line-clamp-3 text-sm leading-6 text-slate-600">{effectiveDescription}</p>
      </div>
    </section>

    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-base font-black text-slate-900">تنظیمات سئو و اسکیما</h2>
      <label className="block space-y-1.5"><span className="text-sm font-bold">کلیدواژه کانونی</span><input value={props.primaryKeyword} maxLength={120} onChange={event => props.setPrimaryKeyword(event.target.value)} className={fieldClass} placeholder="عبارت اصلی جست‌وجو" /></label>
      <label className="block space-y-1.5"><span className="flex justify-between text-sm font-bold"><span>عنوان سئو</span><span className={props.seoTitle.length > 60 ? "text-red-600" : "text-slate-400"}>{props.seoTitle.length.toLocaleString("fa-IR")} / ۶۰</span></span><input value={props.seoTitle} onChange={event => props.setSeoTitle(event.target.value)} maxLength={70} className={fieldClass} placeholder={props.title || "عنوان مقاله"} /></label>
      <label className="block space-y-1.5"><span className="flex justify-between text-sm font-bold"><span>توضیحات متا</span><span className={props.seoDescription.length > 160 ? "text-red-600" : "text-slate-400"}>{props.seoDescription.length.toLocaleString("fa-IR")} / ۱۶۰</span></span><textarea value={props.seoDescription} onChange={event => props.setSeoDescription(event.target.value)} maxLength={170} rows={4} className={fieldClass} placeholder={props.excerpt} /></label>
      <label className="block space-y-1.5"><span className="text-sm font-bold">نشانی canonical</span><input dir="ltr" type="url" value={props.canonicalUrl} onChange={event => props.setCanonicalUrl(event.target.value)} className={fieldClass} placeholder="https://iran-plaza.ir/article/" /></label>
      <label className="block space-y-1.5"><span className="text-sm font-bold">نوع Schema.org</span><select value={props.schemaType} onChange={event => props.setSchemaType(event.target.value as ArticleSchemaType)} className={fieldClass}><option value="LISTING">Article + ItemList (پیشنهادی)</option><option value="ARTICLE">Article</option></select><small className="block leading-5 text-slate-500">ItemList از کسب‌وکارها، جدول‌ها یا سرفصل‌های واقعی همین مقاله ساخته می‌شود.</small></label>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
        <label className="flex items-center justify-between rounded-xl border border-slate-200 p-3 text-sm font-bold"><span>اجازه ایندکس در گوگل</span><input type="checkbox" checked={props.robotsIndex} onChange={event => props.setRobotsIndex(event.target.checked)} className="size-5 accent-emerald-700" /></label>
        <label className="flex items-center justify-between rounded-xl border border-slate-200 p-3 text-sm font-bold"><span>دنبال‌کردن لینک‌ها</span><input type="checkbox" checked={props.robotsFollow} onChange={event => props.setRobotsFollow(event.target.checked)} className="size-5 accent-emerald-700" /></label>
      </div>
    </section>

    <details open className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <summary className="cursor-pointer text-base font-black text-slate-900">چک‌لیست سئو</summary>
      <ul className="mt-4 space-y-3">{audit.checks.map(check => <li key={check.label} className="flex items-start gap-2 text-sm leading-6">{check.passed ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" /> : <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" />}<span>{check.label}</span></li>)}</ul>
    </details>

    <details className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <summary className="flex cursor-pointer list-none items-center gap-2 text-base font-black text-slate-900"><History className="size-4" />تاریخچه نسخه‌ها <span className="me-auto rounded-full bg-slate-100 px-2 py-0.5 text-xs">{props.revisions.length.toLocaleString("fa-IR")}</span></summary>
      <ol className="mt-4 space-y-3">{props.revisions.map(item => <li key={item.id} className="rounded-xl border border-slate-200 p-3 text-sm"><div className="flex items-center gap-2"><strong>نسخه {item.revision.toLocaleString("fa-IR")}</strong><span className="text-slate-400">{new Date(item.createdAt).toLocaleDateString("fa-IR", { timeZone: "Asia/Tehran" })}</span></div><p className="mt-1 text-slate-600">{item.changeNote || "ذخیره بدون یادداشت"}</p><p className="mt-1 text-xs text-slate-400">{item.editor.fullName || "تحریریه ایران پلازا"}</p></li>)}</ol>
      {!props.revisions.length ? <p className="mt-4 flex items-center gap-2 text-sm text-slate-500"><CircleMinus className="size-4" />هنوز نسخه‌ای ثبت نشده است.</p> : null}
    </details>
  </div>;
}
