"use client";

import { useState } from "react";
import type { EditorialRedirect } from "@/app/content/redirects/page";

function normalizeInput(value: string, allowQuery: boolean): string {
  const trimmed = value.trim();
  let path = trimmed;

  if (/^https?:\/\//i.test(trimmed)) {
    const url = new URL(trimmed);
    if (url.origin !== window.location.origin) {
      throw new Error("فقط آدرس همین سایت مجاز است.");
    }
    if (url.hash) throw new Error("آدرس مقصد نباید بخش # داشته باشد.");
    if (!allowQuery && url.search) throw new Error("برای آدرس قدیمی، فقط مسیر را وارد کنید و query را ننویسید.");
    path = url.pathname + (allowQuery ? url.search : "");
  }

  if (!path.startsWith("/") || path.startsWith("//") || path.includes("#") || /[\\\u0000-\u001f]/.test(path)) {
    throw new Error("آدرس باید یک مسیر داخلی معتبر باشد؛ نمونه: /articles/example/");
  }
  if (!allowQuery && path.includes("?")) throw new Error("برای آدرس قدیمی، فقط مسیر را وارد کنید و query را ننویسید.");

  const [pathname, query = ""] = path.split("?", 2);
  const normalizedPath = `/${pathname.split("/").filter(Boolean).join("/")}/`;
  return allowQuery && query ? `${normalizedPath}?${query}` : normalizedPath;
}

async function responseData(response: Response): Promise<Record<string, unknown>> {
  const text = await response.text();
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("json")) {
    try {
      const data: unknown = JSON.parse(text);
      if (typeof data === "object" && data !== null) return data as Record<string, unknown>;
    } catch {
      // Surface a concise status error below instead of leaking an HTML error page.
    }
  }
  if (!response.ok) throw new Error(`ذخیره ریدایرکت ناموفق بود (HTTP ${response.status}). سرویس API پاسخ معتبر نداد.`);
  throw new Error(`پاسخ سرویس قابل‌خواندن نبود (HTTP ${response.status}).`);
}

function messageFrom(data: Record<string, unknown>, fallback: string): string {
  const message = data.message;
  if (typeof message === "string") return message;
  if (Array.isArray(message)) return message.filter((item): item is string => typeof item === "string").join("، ") || fallback;
  return fallback;
}

export function EditorialRedirectManager({ initial }: { initial: EditorialRedirect[] }) {
  const [items, setItems] = useState(initial);
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function save(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const normalizedSource = normalizeInput(source, false);
      const normalizedTarget = normalizeInput(target, true);
      const response = await fetch("/api/backend/content/redirects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ source: normalizedSource, target: normalizedTarget, isActive: true }) });
      const data = await responseData(response);
      if (!response.ok) throw new Error(messageFrom(data, "ذخیره ریدایرکت انجام نشد."));
      setItems(current => [data as unknown as EditorialRedirect, ...current.filter(item => item.id !== data.id)]); setSource(""); setTarget("");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "خطا در ذخیره‌سازی ریدایرکت."); }
    finally { setBusy(false); }
  }

  async function toggle(item: EditorialRedirect) {
    try {
      const response = await fetch(`/api/backend/content/redirects/${item.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive: !item.isActive }) });
      if (!response.ok) throw new Error(messageFrom(await responseData(response), "تغییر وضعیت انجام نشد."));
      setItems(current => current.map(value => value.id === item.id ? { ...value, isActive: !value.isActive } : value));
    } catch (cause) { setError(cause instanceof Error ? cause.message : "تغییر وضعیت انجام نشد."); }
  }

  async function remove(item: EditorialRedirect) {
    if (!window.confirm(`ریدایرکت ${item.source} حذف شود؟`)) return;
    try {
      const response = await fetch(`/api/backend/content/redirects/${item.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error(messageFrom(await responseData(response), "حذف ریدایرکت انجام نشد."));
      setItems(current => current.filter(value => value.id !== item.id));
    } catch (cause) { setError(cause instanceof Error ? cause.message : "حذف ریدایرکت انجام نشد."); }
  }

  return <section className="space-y-6">
    <form onSubmit={save} className="grid gap-4 rounded-2xl border bg-white p-5 md:grid-cols-[1fr_1fr_auto] md:items-end">
      <label className="space-y-2 text-sm font-bold">آدرس قدیمی<input required dir="ltr" value={source} onChange={event => setSource(event.target.value)} placeholder="/old-article/" className="w-full rounded-xl border px-3 py-2.5 font-normal" /></label>
      <label className="space-y-2 text-sm font-bold">آدرس مقصد<input required dir="ltr" value={target} onChange={event => setTarget(event.target.value)} placeholder="/articles/new-path/ یا https://iran-plaza.ir/" className="w-full rounded-xl border px-3 py-2.5 font-normal" /></label>
      <button disabled={busy} className="rounded-xl bg-emerald-700 px-5 py-2.5 font-bold text-white disabled:opacity-50">{busy ? "در حال ذخیره…" : "افزودن ریدایرکت"}</button>
      {error ? <p role="alert" className="text-sm text-red-700 md:col-span-3">{error}</p> : null}
      <p className="text-xs text-slate-500 md:col-span-3">آدرس کامل همین سایت یا مسیر داخلی مجاز است. مقصد می‌تواند query داشته باشد؛ آدرس قدیمی را بدون query وارد کنید.</p>
    </form>
    <div className="overflow-x-auto rounded-2xl border bg-white"><table className="w-full min-w-[650px] text-sm"><thead className="bg-slate-50"><tr><th className="p-4 text-right">قدیمی</th><th className="p-4 text-right">مقصد</th><th className="p-4 text-right">وضعیت</th><th className="p-4 text-left">عملیات</th></tr></thead><tbody>{items.map(item => <tr key={item.id} className="border-t"><td dir="ltr" className="p-4 text-right">{item.source}</td><td dir="ltr" className="p-4 text-right">{item.target}</td><td className="p-4">{item.isActive ? "فعال · 301" : "غیرفعال"}</td><td className="space-x-2 space-x-reverse p-4 text-left"><button onClick={() => void toggle(item)} className="rounded-lg border px-3 py-1.5">{item.isActive ? "غیرفعال‌کردن" : "فعال‌کردن"}</button><button onClick={() => void remove(item)} className="rounded-lg border border-red-200 px-3 py-1.5 text-red-700">حذف</button></td></tr>)}{items.length === 0 ? <tr><td colSpan={4} className="p-8 text-center text-slate-500">هنوز ریدایرکتی ثبت نشده است.</td></tr> : null}</tbody></table></div>
  </section>;
}
