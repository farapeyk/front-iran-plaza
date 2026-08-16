"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { updateBusinessProfileAction } from "@/features/business/actions/update-business-profile.action";

export function AboutForm({ businessId, initialAboutText }: { businessId: string; initialAboutText: string }) {
  const [isPending, startTransition] = useTransition();
  const [aboutText, setAboutText] = useState(initialAboutText);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await updateBusinessProfileAction(businessId, { aboutText: aboutText || undefined });
      if (!result.success) toast.error(result.message);
      else toast.success("اطلاعات ذخیره شد");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
      <div className="space-y-2">
        <label className="text-sm font-medium">متن درباره ما</label>
        <textarea
          value={aboutText}
          onChange={(e) => setAboutText(e.target.value)}
          rows={10}
          placeholder="درباره خودتان و کسب‌وکارتان بنویسید..."
          disabled={isPending}
          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "در حال ذخیره..." : "ذخیره اطلاعات"}
      </Button>
    </form>
  );
}