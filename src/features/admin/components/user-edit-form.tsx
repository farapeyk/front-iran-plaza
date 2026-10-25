"use client";

import { useState, useTransition } from "react";
import { Pencil, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateUserAction, type UpdateAdminUserInput } from "@/features/admin/actions/users.action";
import type { AdminUserDetail } from "@/features/admin/types/user";

const USER_TYPE_OPTIONS: Array<{ value: UpdateAdminUserInput["userType"]; label: string }> = [
  { value: "CUSTOMER", label: "مشتری" },
  { value: "BUSINESS_OWNER", label: "صاحب کسب‌وکار" },
  { value: "ADMIN", label: "ادمین" },
  { value: "SUPER_ADMIN", label: "مدیر ارشد" },
];

type EditableUser = Pick<AdminUserDetail, "id" | "phone" | "fullName" | "email" | "nationalCode" | "userType">;

function initialForm(user: EditableUser): UpdateAdminUserInput {
  return {
    phone: user.phone,
    fullName: user.fullName ?? "",
    email: user.email ?? "",
    nationalCode: user.nationalCode ?? "",
    userType: user.userType,
  };
}

export function UserEditForm({ user, isCurrentUser }: { user: EditableUser; isCurrentUser: boolean }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [form, setForm] = useState(() => initialForm(user));
  const [isPending, startTransition] = useTransition();

  function updateField<Key extends keyof UpdateAdminUserInput>(key: Key, value: UpdateAdminUserInput[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function resetForm() {
    setForm(initialForm(user));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      const result = await updateUserAction(user.id, form);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success("اطلاعات کاربر ویرایش شد");
      setExpanded(false);
      router.refresh();
    });
  }

  return (
    <section id="edit-user" className="scroll-mt-6 rounded-lg border border-neutral-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-neutral-900">ویرایش کاربر</h2>
          <p className="mt-1 text-xs text-neutral-500">نام، اطلاعات هویتی و نوع دسترسی حساب را به‌روزرسانی کنید.</p>
        </div>
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-md bg-emerald-950 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-900 disabled:opacity-50"
        >
          <Pencil size={16} aria-hidden="true" />
          {expanded ? "بستن فرم" : "ویرایش اطلاعات"}
        </button>
      </div>

      {expanded && (
        <form onSubmit={handleSubmit} className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="space-y-1.5 text-sm font-medium text-neutral-800">
            <span>نام و نام خانوادگی</span>
            <input
              value={form.fullName}
              onChange={(event) => updateField("fullName", event.target.value)}
              minLength={2}
              maxLength={120}
              required
              disabled={isPending}
              className="h-10 w-full rounded-md border border-input px-3 text-sm"
            />
          </label>

          <label className="space-y-1.5 text-sm font-medium text-neutral-800">
            <span>شماره موبایل</span>
            <input
              value={form.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              inputMode="numeric"
              pattern="09[0-9]{9}"
              required
              disabled={isPending}
              dir="ltr"
              className="h-10 w-full rounded-md border border-input px-3 text-sm"
            />
          </label>

          <label className="space-y-1.5 text-sm font-medium text-neutral-800">
            <span>ایمیل (اختیاری)</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              maxLength={254}
              disabled={isPending}
              dir="ltr"
              className="h-10 w-full rounded-md border border-input px-3 text-sm"
            />
          </label>

          <label className="space-y-1.5 text-sm font-medium text-neutral-800">
            <span>کد ملی (اختیاری)</span>
            <input
              value={form.nationalCode}
              onChange={(event) => updateField("nationalCode", event.target.value)}
              inputMode="numeric"
              pattern="[0-9]{10}"
              disabled={isPending}
              dir="ltr"
              className="h-10 w-full rounded-md border border-input px-3 text-sm"
            />
          </label>

          <label className="space-y-1.5 text-sm font-medium text-neutral-800 md:col-span-2">
            <span>نوع کاربر</span>
            <select
              value={form.userType}
              onChange={(event) => updateField("userType", event.target.value as UpdateAdminUserInput["userType"])}
              disabled={isPending || isCurrentUser}
              className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
            >
              {USER_TYPE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            {isCurrentUser && <span className="block text-xs font-normal text-amber-700">برای جلوگیری از قطع دسترسی، نوع حساب خودتان قابل تغییر نیست.</span>}
          </label>

          <div className="flex flex-wrap gap-2 md:col-span-2">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-md bg-emerald-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-900 disabled:opacity-50"
            >
              {isPending ? "در حال ذخیره…" : "ذخیره تغییرات"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              disabled={isPending}
              className="inline-flex items-center gap-2 rounded-md border border-neutral-300 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
            >
              <RotateCcw size={15} aria-hidden="true" />
              بازنشانی
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
