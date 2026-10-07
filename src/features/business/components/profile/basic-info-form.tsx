"use client";
import { useProfileBusy } from "./onboarding-context";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateBusinessProfileAction } from "@/features/business/actions/update-business-profile.action";
import { uploadFileAction } from "@/features/business/actions/upload-file.action";
import { isFileTooLarge } from "@/lib/validate-file";
import { categoryOptions, type BusinessCategoryOption } from '../../lib/category-options';
import { useProfileFlow } from './onboarding-context';

interface BasicInfoFormProps {
  businessId: string;
  initialName: string;
  initialBio: string;
  initialLogoId: string | null;
  categories: BusinessCategoryOption[];
  initialCategoryIds: string[];
}

export function BasicInfoForm({ businessId, initialName, initialBio, initialLogoId, categories, initialCategoryIds }: BasicInfoFormProps) {
  const flow = useProfileFlow();
  const [categoryIds, setCategoryIds] = useState(initialCategoryIds);
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(initialName);
  const [bio, setBio] = useState(initialBio);
  const [logoId, setLogoId] = useState(initialLogoId);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  useProfileBusy(isPending || isUploadingLogo);

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
    if (name.trim().length < 2 || categoryIds.length === 0) { toast.error('نام و دسته‌بندی کسب‌وکار را تکمیل کنید'); return; }
    startTransition(async () => {
      const result = await updateBusinessProfileAction(businessId, {
        name,
        description: bio || undefined,
        logoId: logoId || undefined,
        categoryIds,
      });
      if (!result.success) toast.error(result.message);
      else { toast.success("اطلاعات ذخیره شد"); await flow.advance(); }
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

      <div className="space-y-2">
        <label htmlFor="business-category" className="text-sm font-medium">دسته‌بندی کسب‌وکار</label>
        <select id="business-category" value={categoryIds[0] ?? ''} onChange={e => setCategoryIds(e.target.value ? [e.target.value] : [])} disabled={isPending} className="w-full rounded-md border border-input p-2">
          <option value="">دسته‌بندی را انتخاب کنید</option>
          {categoryOptions(categories).map(category => <option key={category.id} value={category.id}>{category.label}</option>)}
        </select>
        {!categories.length && <p className="text-sm text-red-600">دسته‌بندی‌ها دریافت نشدند؛ صفحه را دوباره بارگذاری کنید.</p>}
      </div>
      <Button type="submit" className="w-full" disabled={isPending || isUploadingLogo || !categories.length}>
        {isPending ? "در حال ذخیره..." : flow.active ? 'ذخیره و مرحله بعد' : "ذخیره اطلاعات"}
      </Button>
    </form>
  );
}
