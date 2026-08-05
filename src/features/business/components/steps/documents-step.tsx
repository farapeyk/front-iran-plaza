"use client";

import { useState } from "react";
import { UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { uploadFileAction } from "@/features/business/actions/upload-file.action";
import { submitBusinessDocumentAction } from "@/features/business/actions/submit-document.action";
import type { IdentityInput } from "@/features/business/schemas/identity.schema";

interface DocumentsStepProps {
  businessId: string;
  identity: IdentityInput;
  onDone: () => void;
}

function FileBox({ label, file, onChange }: { label: string; file: File | null; onChange: (f: File | null) => void }) {
  return (
    <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-neutral-300 rounded-xl p-6 cursor-pointer hover:bg-neutral-50 transition-colors">
      <input type="file" accept="image/*" className="hidden" onChange={(e) => onChange(e.target.files?.[0] ?? null)} />
      <UploadCloud className="text-neutral-400" size={22} />
      <span className="text-xs text-neutral-600 text-center">{file ? file.name : label}</span>
    </label>
  );
}

export function DocumentsStep({ businessId, identity, onDone }: DocumentsStepProps) {
  const [isPending, setIsPending] = useState(false);
  const [front, setFront] = useState<File | null>(null);
  const [back, setBack] = useState<File | null>(null);
  const [licensePhoto, setLicensePhoto] = useState<File | null>(null);

  async function uploadAndSubmit(
    file: File,
    type: "NATIONAL_ID_FRONT" | "NATIONAL_ID_BACK" | "BUSINESS_LICENSE_PHOTO",
  ) {
    const formData = new FormData();
    formData.append("file", file);

    const uploadResult = await uploadFileAction(formData);
    if (!uploadResult.success) throw new Error(uploadResult.message);

    const licenseInfo =
      type === "BUSINESS_LICENSE_PHOTO"
        ? { companyName: identity.companyName, licenseNumber: identity.licenseNumber, unionCode: identity.unionCode }
        : {};

    const docResult = await submitBusinessDocumentAction({
      businessId,
      type,
      fileId: uploadResult.fileId,
      ...licenseInfo,
    });
    if (!docResult.success) throw new Error(docResult.message);
  }

  async function handleSubmit() {
    if (!front || !back || !licensePhoto) {
      toast.error("لطفاً هر سه تصویر (پشت کارت ملی، روی کارت ملی و پروانه کسب) را انتخاب کنید");
      return;
    }

    setIsPending(true);
    try {
      await uploadAndSubmit(front, "NATIONAL_ID_FRONT");
      await uploadAndSubmit(back, "NATIONAL_ID_BACK");
      await uploadAndSubmit(licensePhoto, "BUSINESS_LICENSE_PHOTO");
      onDone();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "خطایی رخ داد");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-neutral-900 mb-6">بارگذاری تصویر مدارک</h2>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <FileBox label="روی کارت ملی" file={front} onChange={setFront} />
        <FileBox label="پشت کارت ملی" file={back} onChange={setBack} />
      </div>
      <div className="mb-6">
        <FileBox label="تصویر پروانه کسب" file={licensePhoto} onChange={setLicensePhoto} />
      </div>

      <Button onClick={handleSubmit} className="w-full" disabled={isPending}>
        {isPending ? "در حال ارسال..." : "تایید و ارسال مدارک"}
      </Button>
    </div>
  );
}