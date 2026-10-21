"use client";

import { useRef, useState } from "react";
import { createSuperAdminAction } from "@/features/admin/actions/super-admin.action";

export function CreateSuperAdminForm() {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [created, setCreated] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function submit(formData: FormData) {
    setPending(true);
    setMessage("");
    const result = await createSuperAdminAction({
      phone: String(formData.get("phone") ?? ""),
      fullName: String(formData.get("fullName") ?? ""),
      password: String(formData.get("password") ?? ""),
    });
    setPending(false);
    if (!result.success) { setMessage(result.message); return; }
    formRef.current?.reset();
    setCreated(true);
    setMessage(`حساب مدیر ارشد برای ${result.user.fullName} (${result.user.phone}) ساخته شد.`);
  }

  return (
    <form ref={formRef} action={submit} className="max-w-xl space-y-5 rounded-xl border border-neutral-200 bg-white p-6">
      <label className="block text-sm font-medium">نام و نام خانوادگی
        <input name="fullName" required minLength={2} maxLength={120} className="mt-2 h-10 w-full rounded-md border border-input px-3" />
      </label>
      <label className="block text-sm font-medium">شماره موبایل جدید
        <input name="phone" required inputMode="numeric" pattern="09[0-9]{9}" maxLength={11} dir="ltr" placeholder="09121234567" className="mt-2 h-10 w-full rounded-md border border-input px-3" />
      </label>
      <label className="block text-sm font-medium">رمز عبور اولیه
        <input name="password" required type="password" minLength={12} maxLength={72} autoComplete="new-password" className="mt-2 h-10 w-full rounded-md border border-input px-3" />
        <span className="mt-1 block text-xs text-neutral-500">حداقل ۱۲ نویسه؛ رمز پس از ثبت دوباره نمایش داده نمی‌شود.</span>
      </label>
      {message && <p role="status" className={`text-sm ${created ? "text-emerald-700" : "text-red-600"}`}>{message}</p>}
      <button disabled={pending || created} className="h-10 rounded-md bg-emerald-950 px-5 text-sm font-medium text-white disabled:opacity-50">
        {pending ? "در حال ایجاد…" : created ? "مدیر ارشد ایجاد شد" : "ایجاد مدیر ارشد"}
      </button>
    </form>
  );
}
