"use client";

import { useState, useTransition } from "react";
import { saveEditorialProfileAction } from "@/features/content/actions/content.action";
import type { ContentAuthorAssignment } from "@/features/content/types";

export function EditorialProfileManager({ assignments }: { assignments: ContentAuthorAssignment[] }) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  return <section className="space-y-4 rounded-xl border bg-white p-5"><header><h2 className="text-xl font-black">صفحه معرفی نویسندگان</h2><p className="mt-1 text-sm text-neutral-600">نشانی کوتاه، نام نمایشی و توضیح نویسنده را ویرایش کنید. اطلاعات حساب کاربر تغییر نمی‌کند.</p></header>{assignments.filter(item => item.isAdmin || item.isActive).map(({ user }) => <ProfileForm key={user.id} user={user} pending={pending} onSave={(data) => startTransition(async () => { const result = await saveEditorialProfileAction(user.id, data); setMessage(result.success ? "پروفایل ذخیره شد." : result.message); })} />)}{message && <p role="status" className="text-sm">{message}</p>}</section>;
}

function ProfileForm({ user, pending, onSave }: { user: ContentAuthorAssignment["user"]; pending: boolean; onSave: (data: { slug: string; displayName: string; bio: string }) => void }) {
  const [slug, setSlug] = useState(user.editorialProfile?.slug || "");
  const [displayName, setDisplayName] = useState(user.editorialProfile?.displayName || user.fullName || "");
  const [bio, setBio] = useState(user.editorialProfile?.bio || "");
  return <form dir="rtl" onSubmit={event => { event.preventDefault(); onSave({ slug, displayName, bio }); }} className="grid gap-3 border-t pt-4 md:grid-cols-3"><div className="md:col-span-3"><strong>{user.fullName || "بدون نام"}</strong><span className="mr-2 text-xs text-neutral-500" dir="ltr">{user.editorialProfile ? `/authors/${user.editorialProfile.slug}` : "صفحه معرفی ساخته نشده"}</span></div><label className="space-y-1 text-sm"><span>نشانی کوتاه (حروف انگلیسی)</span><input dir="ltr" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" minLength={3} maxLength={80} value={slug} onChange={e => setSlug(e.target.value)} className="w-full rounded-md border px-3 py-2 text-left" /></label><label className="space-y-1 text-sm"><span>نام نمایشی</span><input required maxLength={120} value={displayName} onChange={e => setDisplayName(e.target.value)} className="w-full rounded-md border px-3 py-2" /></label><label className="space-y-1 text-sm"><span>توضیح کوتاه</span><input maxLength={500} value={bio} onChange={e => setBio(e.target.value)} className="w-full rounded-md border px-3 py-2" /></label><button disabled={pending} className="w-fit rounded-md bg-emerald-900 px-4 py-2 text-sm font-bold text-white">ذخیره پروفایل</button></form>;
}
