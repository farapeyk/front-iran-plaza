"use client";

import { useState } from "react";
import type { EditorialRedirect } from "@/app/content/redirects/page";

export function EditorialRedirectManager({ initial }: { initial: EditorialRedirect[] }) {
  const [items, setItems] = useState(initial);
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function save(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const response = await fetch("/api/backend/content/redirects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ source, target, isActive: true }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "ذخیره ریدایرکت انجام نشد");
      setItems(current => [data, ...current.filter(item => item.id !== data.id)]); setSource(""); setTarget("");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "خطا در ذخیره‌سازی"); }
    finally { setBusy(false); }
  }

  async function toggle(item: EditorialRedirect) {
    const response = await fetch(`/api/backend/content/redirects/${item.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive: !item.isActive }) });
    if (response.ok) setItems(current => current.map(value => value.id === item.id ? { ...value, isActive: !value.isActive } : value));
  }

  async function remove(item: EditorialRedirect) {
    if (!window.confirm(`ریدایرکت ${item.source} حذف شود؟`)) return;
    const response = await fetch(`/api/backend/content/redirects/${item.id}`, { method: "DELETE" });
    if (response.ok) setItems(current => current.filter(value => value.id !== item.id));
  }

  return <section className="space-y-6">
    <form onSubmit={save} className="grid gap-4 rounded-2xl border bg-white p-5 md:grid-cols-[1fr_1fr_auto] md:items-end">
      <label className="space-y-2 text-sm font-bold">آدرس قدیمی<input required dir="ltr" value={source} onChange={event => setSource(event.target.value)} placeholder="/old-article/" className="w-full rounded-xl border px-3 py-2.5 font-normal" /></label>
      <label className="space-y-2 text-sm font-bold">آدرس مقصد<input required dir="ltr" value={target} onChange={event => setTarget(event.target.value)} placeholder="/new-article/" className="w-full rounded-xl border px-3 py-2.5 font-normal" /></label>
      <button disabled={busy} className="rounded-xl bg-emerald-700 px-5 py-2.5 font-bold text-white disabled:opacity-50">افزودن ریدایرکت</button>
      {error ? <p role="alert" className="text-sm text-red-700 md:col-span-3">{error}</p> : null}
      <p className="text-xs text-slate-500 md:col-span-3">فقط مسیرهای داخلی سایت مجازند؛ نمونه: /old-path/ یا /articles/new-path/</p>
    </form>
    <div className="overflow-x-auto rounded-2xl border bg-white"><table className="w-full min-w-[650px] text-sm"><thead className="bg-slate-50"><tr><th className="p-4 text-right">قدیمی</th><th className="p-4 text-right">مقصد</th><th className="p-4 text-right">وضعیت</th><th className="p-4 text-left">عملیات</th></tr></thead><tbody>{items.map(item => <tr key={item.id} className="border-t"><td dir="ltr" className="p-4 text-right">{item.source}</td><td dir="ltr" className="p-4 text-right">{item.target}</td><td className="p-4">{item.isActive ? "فعال · 301" : "غیرفعال"}</td><td className="space-x-2 space-x-reverse p-4 text-left"><button onClick={() => void toggle(item)} className="rounded-lg border px-3 py-1.5">{item.isActive ? "غیرفعال‌کردن" : "فعال‌کردن"}</button><button onClick={() => void remove(item)} className="rounded-lg border border-red-200 px-3 py-1.5 text-red-700">حذف</button></td></tr>)}{items.length === 0 ? <tr><td colSpan={4} className="p-8 text-center text-slate-500">هنوز ریدایرکتی ثبت نشده است.</td></tr> : null}</tbody></table></div>
  </section>;
}
