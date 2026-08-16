"use client";

import { useState, useTransition } from "react";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateBusinessProfileAction } from "@/features/business/actions/update-business-profile.action";

const PLATFORM_OPTIONS = [
  { value: "instagram", label: "اینستاگرام" },
  { value: "telegram", label: "تلگرام" },
  { value: "x", label: "ایکس (توییتر)" },
  { value: "youtube", label: "یوتیوب" },
  { value: "facebook", label: "فیسبوک" },
  { value: "linkedin", label: "لینکدین" },
  { value: "pinterest", label: "پینترست" },
  { value: "aparat", label: "آپارات" },
  { value: "rubika", label: "روبیکا" },
  { value: "bale", label: "بله" },
  { value: "eitaa", label: "ایتا" },
  { value: "soroush", label: "سروش" },
];

interface SocialAccount {
  platform: string;
  value: string;
}

function toEntries(social: Record<string, string> | null): SocialAccount[] {
  if (!social) return [];
  return Object.entries(social).map(([platform, value]) => ({ platform, value }));
}

export function SocialMediaForm({ businessId, initialSocial }: { businessId: string; initialSocial: Record<string, string> | null }) {
  const [isPending, startTransition] = useTransition();
  const [accounts, setAccounts] = useState<SocialAccount[]>(
    toEntries(initialSocial).length > 0 ? toEntries(initialSocial) : [{ platform: "instagram", value: "" }],
  );

  function updateAccount(index: number, patch: Partial<SocialAccount>) {
    setAccounts((prev) => prev.map((a, i) => (i === index ? { ...a, ...patch } : a)));
  }

  function removeAccount(index: number) {
    setAccounts((prev) => prev.filter((_, i) => i !== index));
  }

  function addAccount() {
    setAccounts((prev) => [...prev, { platform: "telegram", value: "" }]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const socialMedia = Object.fromEntries(accounts.filter((a) => a.value.trim()).map((a) => [a.platform, a.value.trim()]));

    startTransition(async () => {
      const result = await updateBusinessProfileAction(businessId, { socialMedia });
      if (!result.success) toast.error(result.message);
      else toast.success("اطلاعات ذخیره شد");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
      {accounts.map((account, i) => (
        <div key={i} className="flex items-center gap-2">
          <select value={account.platform} onChange={(e) => updateAccount(i, { platform: e.target.value })} disabled={isPending} className="h-10 rounded-md border border-input px-2 text-sm w-32 shrink-0">
            {PLATFORM_OPTIONS.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
          <Input value={account.value} onChange={(e) => updateAccount(i, { value: e.target.value })} placeholder="آیدی یا لینک خود را وارد کنید" dir="ltr" className="text-left flex-1" disabled={isPending} />
          <button type="button" onClick={() => removeAccount(i)} disabled={isPending} className="text-red-500 shrink-0">
            <Trash2 size={18} />
          </button>
        </div>
      ))}

      <button type="button" onClick={addAccount} disabled={isPending} className="flex items-center gap-1 text-sm text-emerald-800 font-medium">
        <Plus size={16} />
        افزودن شبکه اجتماعی
      </button>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "در حال ذخیره..." : "ذخیره اطلاعات"}
      </Button>
    </form>
  );
}