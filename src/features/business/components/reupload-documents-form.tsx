// src/features/business/components/reupload-documents-form.tsx
"use client";

import { useState } from "react";
import { UploadCloud, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { uploadFileAction } from "@/features/business/actions/upload-file.action";
import { submitBusinessDocumentAction } from "@/features/business/actions/submit-document.action";

type DocType = "NATIONAL_ID_FRONT" | "NATIONAL_ID_BACK" | "BUSINESS_LICENSE_PHOTO";

export function ReuploadDocumentsForm({ businessId }: { businessId: string }) {
  const [isPending, setIsPending] = useState(false);
  const [files, setFiles] = useState<Record<DocType, File | null>>({
    NATIONAL_ID_FRONT: null,
    NATIONAL_ID_BACK: null,
    BUSINESS_LICENSE_PHOTO: null,
  });

  async function handleFileChange(file: File | null, type: DocType) {
    if (!file) return;
    setFiles(prev => ({ ...prev, [type]: file }));
  }

  async function handleSubmit() {
    if (!files.NATIONAL_ID_FRONT || !files.NATIONAL_ID_BACK || !files.BUSINESS_LICENSE_PHOTO) {
      toast.error("لطفاً هر سه مدرک را بارگذاری کنید");
      return;
    }

    setIsPending(true);
    try {
      for (const type of Object.keys(files) as DocType[]) {
        const file = files[type];
        if (!file) continue;

        const formData = new FormData();
        formData.append("file", file);
        const uploadResult = await uploadFileAction(formData);
        if (!uploadResult.success) throw new Error(uploadResult.message);

        const docResult = await submitBusinessDocumentAction({ businessId, type, fileId: uploadResult.fileId });
        if (!docResult.success) throw new Error(docResult.message);
      }
      
      toast.success("مدارک جدید با موفقیت ارسال شد. در انتظار بررسی ادمین.");
      setFiles({ NATIONAL_ID_FRONT: null, NATIONAL_ID_BACK: null, BUSINESS_LICENSE_PHOTO: null });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "خطا در ارسال مدارک");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="space-y-4" dir="rtl">
      <div className="grid grid-cols-2 gap-3">
        <FileInput label="روی کارت ملی" file={files.NATIONAL_ID_FRONT} onChange={(f) => handleFileChange(f, "NATIONAL_ID_FRONT")} />
        <FileInput label="پشت کارت ملی" file={files.NATIONAL_ID_BACK} onChange={(f) => handleFileChange(f, "NATIONAL_ID_BACK")} />
      </div>
      <FileInput label="تصویر پروانه کسب" file={files.BUSINESS_LICENSE_PHOTO} onChange={(f) => handleFileChange(f, "BUSINESS_LICENSE_PHOTO")} />

      <Button onClick={handleSubmit} className="w-full" disabled={isPending}>
        {isPending ? <Loader2 className="size-4 animate-spin ml-2" /> : null}
        ارسال مجدد مدارک برای بررسی
      </Button>
    </div>
  );
}

function FileInput({ label, file, onChange }: { label: string; file: File | null; onChange: (f: File | null) => void }) {
  return (
    <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-6 cursor-pointer transition-colors border-neutral-300 hover:bg-neutral-50">
      <input type="file" accept="image/*" className="hidden" onChange={(e) => onChange(e.target.files?.[0] ?? null)} />
      {file ? <CheckCircle2 className="text-emerald-600" size={22} /> : <UploadCloud className="text-neutral-400" size={22} />}
      <span className="text-xs text-neutral-600 text-center">{file ? file.name : label}</span>
    </label>
  );
}