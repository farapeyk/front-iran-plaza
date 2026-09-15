"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateBusinessProfileAction } from "@/features/business/actions/update-business-profile.action";
import { uploadFileAction } from "@/features/business/actions/upload-file.action";
import { isFileTooLarge } from "@/lib/validate-file";

interface BasicInfoFormProps {
  businessId: string;
  initialName: string;
  initialBio: string;
  initialLogoId: string | null;
}

export function BasicInfoForm({ businessId, initialName, initialBio, initialLogoId }: BasicInfoFormProps) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(initialName);
  const [bio, setBio] = useState(initialBio);
  const [logoId, setLogoId] = useState(initialLogoId);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

async function handleLogoChange(file: File | null) {
    if (!file) return;
    if (isFileTooLarge(file, 20)) {
      toast.error("حجم لوگو نباید بیشتر از ۲۰ مگابایت باشد");
      return;
    }
    setLogoFile(file);
    setIsUploadingLogo(true);

    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadFileAction(formData);
    setIsUploadingLogo(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }
    setLogoId(result.fileId);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await updateBusinessProfileAction(businessId, {
        name,
        description: bio || undefined,
        logoId: logoId || undefined,
      });
      if (!result.success) toast.error(result.message);
      else toast.success("اطلاعات ذخیره شد");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" dir="rtl">
      <div className="space-y-2">
        <label className="text-sm font-medium">لوگو</label>
        <label className="flex items-center gap-3 border border-dashed border-neutral-300 rounded-lg p-3 cursor-pointer hover:bg-neutral-50">
          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleLogoChange(e.target.files?.[0] ?? null)} />
          <div className="w-14 h-14 rounded-full bg-neutral-100 shrink-0 overflow-hidden flex items-center justify-center text-xs text-neutral-400">
            {logoId ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={`/api/backend/files/${logoId}`} alt="لوگوی فعلی" className="w-full h-full object-cover" />
            ) : (
              "بدون لوگو"
            )}
          </div>
          <span className="text-sm text-neutral-600">
            {isUploadingLogo ? "در حال آپلود..." : logoFile ? logoFile.name : "برای آپلود یا تغییر لوگو کلیک کنید"}
          </span>
        </label>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">نام کسب‌وکار</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} disabled={isPending} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">بیوگرافی</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={100}
          rows={3}
          disabled={isPending}
          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <p className="text-xs text-neutral-400">حداکثر ۱۰۰ کاراکتر ({bio.length}/۱۰۰)</p>
      </div>

      <Button type="submit" className="w-full" disabled={isPending || isUploadingLogo}>
        {isPending ? "در حال ذخیره..." : "ذخیره اطلاعات"}
      </Button>
    </form>
  );
}