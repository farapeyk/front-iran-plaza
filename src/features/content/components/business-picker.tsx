"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, Search, Trash2 } from "lucide-react";
import type { ContentBusiness } from "@/features/content/types";
const fieldClass = "w-full rounded-md border border-neutral-300 bg-white px-3 py-2 outline-none focus:border-emerald-700";
export function BusinessPicker({ selected, initial, onChange }: { selected: string[]; initial: ContentBusiness[]; onChange: (ids: string[]) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ContentBusiness[]>(initial);
  const [loading, setLoading] = useState(false);
  const byId = useMemo(() => new Map([...initial, ...results].map(item => [item.id, item])), [initial, results]);
  async function search() {
    setLoading(true);
    try {
      const response = await fetch(`/api/backend/content/businesses?search=${encodeURIComponent(query)}&limit=30`, { cache: "no-store" });
      if (response.ok) setResults(await response.json());
    } finally { setLoading(false); }
  }
  return <div className="space-y-3"><div className="flex gap-2"><input value={query} onChange={event => setQuery(event.target.value)} onKeyDown={event => { if (event.key === "Enter") { event.preventDefault(); void search(); } }} className={fieldClass} placeholder="نام، شهر یا محله کسب‌وکار" /><button type="button" onClick={search} className="flex items-center gap-2 rounded-md border px-3"><Search size={16} />{loading ? "…" : "جستجو"}</button></div>{selected.length ? <div className="space-y-2"><p className="text-sm font-medium">ترتیب نمایش</p>{selected.map((id, index) => <div key={id} className="flex items-center gap-2 rounded border bg-emerald-50 p-2"><span className="flex-1">{(index + 1).toLocaleString("fa-IR")}. {byId.get(id)?.name || id}</span><button type="button" aria-label="بالاتر" disabled={!index} onClick={() => { const next = [...selected]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; onChange(next); }}><ArrowUp size={16} /></button><button type="button" aria-label="پایین‌تر" disabled={index === selected.length - 1} onClick={() => { const next = [...selected]; [next[index + 1], next[index]] = [next[index], next[index + 1]]; onChange(next); }}><ArrowDown size={16} /></button><button type="button" aria-label="حذف" onClick={() => onChange(selected.filter(value => value !== id))}><Trash2 size={16} /></button></div>)}</div> : null}<div className="grid max-h-72 gap-2 overflow-y-auto sm:grid-cols-2">{results.map(item => { const checked = selected.includes(item.id); return <button key={item.id} type="button" onClick={() => onChange(checked ? selected.filter(id => id !== item.id) : [...selected, item.id])} className={`flex items-center gap-3 rounded-md border p-3 text-start ${checked ? "border-emerald-700 bg-emerald-50" : "bg-white"}`}><div className="size-10 shrink-0 overflow-hidden rounded-full bg-neutral-100">{item.logoId ? <Image unoptimized width={40} height={40} src={`/api/backend/files/${encodeURIComponent(item.logoId)}`} alt="" className="size-full object-cover" /> : null}</div><span className="min-w-0"><strong className="block truncate">{item.name}</strong><small className="text-neutral-500">{[item.city, item.neighborhood].filter(Boolean).join("، ")}</small></span></button>; })}</div></div>;
}
