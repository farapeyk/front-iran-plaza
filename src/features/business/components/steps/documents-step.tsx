"use client";

import { useState } from "react";
import { UploadCloud, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { uploadFileAction } from "@/features/business/actions/upload-file.action";
import { submitBusinessDocumentAction } from "@/features/business/actions/submit-document.action";
import type { IdentityInput } from "@/features/business/schemas/identity.schema";

type DocType = "NATIONAL_ID_FRONT" | "NATIONAL_ID_BACK" | "BUSINESS_LICENSE_PHOTO";

interface DocumentsStepProps {
  businessId: string;
  identity: IdentityInput;
  onDone: () => void;
}

function FileBox({
  label,
  file,
  done,
  onChange,
}: {
  label: string;
  file: File | null;
  done: boolean;
  onChange: (f: File | null) => void;
}) {
  return (
    <label
      className={[
        "flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-6 cursor-pointer transition-colors",
        done ? "border-emerald-300 bg-emerald-50" : "border-neutral-300 hover:bg-neutral-50",
      ].join(" ")}
    >
      <input type="file" accept="image/*" className="hidden" onChange={(e) => onChange(e.target.files?.[0] ?? null)} disabled={done} />
      {done ? <CheckCircle2 className="text-emerald-600" size={22} /> : <UploadCloud className="text-neutral-400" size={22} />}
      <span className="text-xs text-neutral-600 text-center">{done ? "ثبت شد" : file ? file.name : label}</span>
    </label>
  );
}

export function DocumentsStep({ businessId, identity, onDone }: DocumentsStepProps) {
  const [isPending, setIsPending] = useState(false);
  const [front, setFront] = useState<File | null>(null);
  const [back, setBack] = useState<File | null>(null);
  const [licensePhoto, setLicensePhoto] = useState<File | null>(null);
  // مدارکی که قبلاً با موفقیت ثبت شدن — تو تلاش مجدد دوباره ارسال نمی‌شن
  const [submitted, setSubmitted] = useState<Set<DocType>>(new Set());

  async function uploadAndSubmit(file: File, type: DocType) {
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

    setSubmitted((prev) => new Set(prev).add(type));
  }

  async function handleSubmit() {
    if ((!front && !submitted.has("NATIONAL_ID_FRONT")) || (!back && !submitted.has("NATIONAL_ID_BACK")) || (!licensePhoto && !submitted.has("BUSINESS_LICENSE_PHOTO"))) {
      toast.error("لطفاً هر سه تصویر (پشت کارت ملی، روی کارت ملی و پروانه کسب) را انتخاب کنید");
      return;
    }

    setIsPending(true);
    try {
      if (front && !submitted.has("NATIONAL_ID_FRONT")) await uploadAndSubmit(front, "NATIONAL_ID_FRONT");
      if (back && !submitted.has("NATIONAL_ID_BACK")) await uploadAndSubmit(back, "NATIONAL_ID_BACK");
      if (licensePhoto && !submitted.has("BUSINESS_LICENSE_PHOTO")) await uploadAndSubmit(licensePhoto, "BUSINESS_LICENSE_PHOTO");
      onDone();
    } catch (err) {
      // فقط همون مدرکی که خطا خورده باقی می‌مونه؛ بقیه که موفق شدن دیگه دوباره ارسال نمی‌شن
      toast.error(err instanceof Error ? err.message : "خطایی رخ داد");
    } finally {
      setIsPending(false);
    }
  }

  const allDone = submitted.size === 3;

  return (
    <div>
      <h2 className="text-lg font-bold text-neutral-900 mb-6">بارگذاری تصویر مدارک</h2>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <FileBox label="روی کارت ملی" file={front} done={submitted.has("NATIONAL_ID_FRONT")} onChange={setFront} />
        <FileBox label="پشت کارت ملی" file={back} done={submitted.has("NATIONAL_ID_BACK")} onChange={setBack} />
      </div>
      <div className="mb-6">
        <FileBox label="تصویر پروانه کسب" file={licensePhoto} done={submitted.has("BUSINESS_LICENSE_PHOTO")} onChange={setLicensePhoto} />
      </div>

      <Button onClick={handleSubmit} className="w-full" disabled={isPending || allDone}>
        {isPending ? "در حال ارسال..." : allDone ? "همه مدارک ثبت شد" : "تایید و ارسال مدارک"}
      </Button>
    </div>
  );
}