"use client";

import { useState, useRef } from "react";
import { UploadCloud, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { uploadFileAction } from "@/features/business/actions/upload-file.action";
import { submitBusinessDocumentAction } from "@/features/business/actions/submit-document.action";
import type { IdentityInput } from "@/features/business/schemas/identity.schema";
import type { BusinessInfoInput } from '../../schemas/business-info.schema';
import type { Category } from './business-info-step';
import { saveRegistrationIdentity } from '../../actions/save-registration-identity.action';
import { jalaliToGregorian } from '@/lib/utils/jalali';
import { useRouter } from 'next/navigation';
import type { RegistrationDocument } from '../../lib/registration';

type DocType = "NATIONAL_ID_FRONT" | "NATIONAL_ID_BACK" | "BUSINESS_LICENSE_PHOTO";

interface DocumentsStepProps {
  businessId: string;
  identity: IdentityInput;
  onDone: () => void;
  onBack?: () => void;
  initialSubmitted?: DocType[];
  businessValues?: BusinessInfoInput;
  categories?: Category[];
  existingDocuments?: RegistrationDocument[];
  onDocumentSubmitted?: (document: RegistrationDocument) => void;
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

export function DocumentsStep({ businessId, identity, onDone, onBack, initialSubmitted = [], businessValues, categories = [], existingDocuments = [], onDocumentSubmitted }: DocumentsStepProps) {
  const router = useRouter();
  const inFlight = useRef(false);
  const [review, setReview] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [front, setFront] = useState<File | null>(null);
  const [back, setBack] = useState<File | null>(null);
  const [licensePhoto, setLicensePhoto] = useState<File | null>(null);
  // مدارکی که قبلاً با موفقیت ثبت شدن — تو تلاش مجدد دوباره ارسال نمی‌شن
  const [submitted, setSubmitted] = useState<Set<DocType>>(new Set(initialSubmitted));

  async function uploadAndSubmit(file: File, type: DocType) {
    const formData = new FormData();
    formData.append("file", file);

    const uploadResult = await uploadFileAction(formData);
    if (!uploadResult.success) throw new Error(uploadResult.message);

    const licenseInfo =
      type === "BUSINESS_LICENSE_PHOTO"
        ? { companyName: identity.companyName, licenseNumber: identity.licenseNumber, unionCode: identity.unionCode,
            issueDate: `${jalaliToGregorian(identity.issueYear, identity.issueMonth, identity.issueDay)}T00:00:00.000Z` }
        : {};

    const docResult = await submitBusinessDocumentAction({
      businessId,
      type,
      fileId: uploadResult.fileId,
      ...licenseInfo,
    });
    if (!docResult.success) throw new Error(docResult.message);

    setSubmitted((prev) => new Set(prev).add(type));
    onDocumentSubmitted?.({ type, fileId: uploadResult.fileId, status: 'PENDING', ...licenseInfo });
  }

  async function handleSubmit() {
    if (inFlight.current) return;
    if ((!front && !submitted.has("NATIONAL_ID_FRONT")) || (!back && !submitted.has("NATIONAL_ID_BACK")) || (!licensePhoto && !submitted.has("BUSINESS_LICENSE_PHOTO"))) {
      toast.error("لطفاً هر سه تصویر (پشت کارت ملی، روی کارت ملی و پروانه کسب) را انتخاب کنید");
      return;
    }

    if (!review) { setReview(true); return; }
    if (!confirmed) { toast.error('ابتدا صحت اطلاعات را تأیید کنید'); return; }
    inFlight.current = true;
    setIsPending(true);
    try {
      const result = await saveRegistrationIdentity(identity);
      if (!result.success) throw new Error(result.message);
      const license = existingDocuments.find(d => d.type === 'BUSINESS_LICENSE_PHOTO');
      const issueDate = `${jalaliToGregorian(identity.issueYear, identity.issueMonth, identity.issueDay)}T00:00:00.000Z`;
      if (submitted.has('BUSINESS_LICENSE_PHOTO') && license?.fileId && (
        license.companyName !== identity.companyName || license.licenseNumber !== identity.licenseNumber ||
        license.unionCode !== identity.unionCode || license.issueDate !== issueDate
      )) {
        const metadata = { companyName: identity.companyName, licenseNumber: identity.licenseNumber, unionCode: identity.unionCode, issueDate };
        const saved = await submitBusinessDocumentAction({ businessId, type: 'BUSINESS_LICENSE_PHOTO', fileId: license.fileId, ...metadata });
        if (!saved.success) throw new Error(saved.message);
        onDocumentSubmitted?.({ ...license, ...metadata, status: 'PENDING' });
      }
      if (front && !submitted.has("NATIONAL_ID_FRONT")) await uploadAndSubmit(front, "NATIONAL_ID_FRONT");
      if (back && !submitted.has("NATIONAL_ID_BACK")) await uploadAndSubmit(back, "NATIONAL_ID_BACK");
      if (licensePhoto && !submitted.has("BUSINESS_LICENSE_PHOTO")) await uploadAndSubmit(licensePhoto, "BUSINESS_LICENSE_PHOTO");
      onDone();
      router.refresh();
    } catch (err) {
      // فقط همون مدرکی که خطا خورده باقی می‌مونه؛ بقیه که موفق شدن دیگه دوباره ارسال نمی‌شن
      toast.error(err instanceof Error ? err.message : "خطایی رخ داد");
    } finally {
      setIsPending(false);
      inFlight.current = false;
    }
  }

  if (review) {
    const values = [
      ['نام کسب‌وکار', businessValues?.name], ['شماره تماس', businessValues?.phone],
      ['دسته‌بندی', categories.find(c => c.id === businessValues?.categoryId)?.name],
      ['استان و شهر', [businessValues?.province, businessValues?.city].filter(Boolean).join('، ')], ['بیوگرافی', businessValues?.bio],
      ['نام و نام خانوادگی', `${identity.firstName} ${identity.lastName}`], ['نام پدر', identity.fatherName],
      ['کد ملی', identity.nationalCode], ['تاریخ تولد', `${identity.birthYear}/${identity.birthMonth}/${identity.birthDay}`],
      ['ایمیل', identity.email], ['نام شرکت', identity.companyName], ['شماره پروانه', identity.licenseNumber], ['کد آپسیک', identity.unionCode],
      ['تاریخ صدور', `${identity.issueYear}/${identity.issueMonth}/${identity.issueDay}`],
      ['روی کارت ملی', submitted.has('NATIONAL_ID_FRONT') ? 'قبلاً ثبت شده' : front?.name],
      ['پشت کارت ملی', submitted.has('NATIONAL_ID_BACK') ? 'قبلاً ثبت شده' : back?.name],
      ['پروانه کسب', submitted.has('BUSINESS_LICENSE_PHOTO') ? 'قبلاً ثبت شده' : licensePhoto?.name],
    ];
    return <div className="space-y-4">
      <h2 className="font-bold text-lg">آیا همه اطلاعات درست است؟</h2>
      <p className="text-sm text-neutral-600">اطلاعات و مدارک را مرور کنید؛ با تأیید نهایی، مدارک برای بررسی ادمین ارسال می‌شوند.</p>
      <dl className="space-y-2 text-sm">{values.map(([label, value]) => <div key={label} className="border-b pb-2"><dt className="text-neutral-500">{label}</dt><dd className="break-words">{value || '—'}</dd></div>)}</dl>
      <label className="flex gap-2 text-sm"><input type="checkbox" checked={confirmed} disabled={isPending} onChange={e => setConfirmed(e.target.checked)} />صحت اطلاعات و مدارک بالا را تأیید می‌کنم.</label>
      <Button className="w-full" disabled={isPending || !confirmed} onClick={handleSubmit}>{isPending ? 'در حال ارسال...' : 'تأیید نهایی و ارسال برای بررسی'}</Button>
      <Button variant="outline" className="w-full" disabled={isPending} onClick={() => { setReview(false); setConfirmed(false); }}>بازگشت و ویرایش</Button>
    </div>;
  }

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

      <p className="text-xs text-neutral-500 mb-4">مدارک ثبت‌شده حفظ می‌شوند. فایل‌هایی که هنوز ارسال نکرده‌اید پس از خروج باید دوباره انتخاب شوند.</p>
      <Button onClick={handleSubmit} className="w-full" disabled={isPending}>
        مرور اطلاعات و تأیید نهایی
      </Button>
      {onBack && <Button variant="outline" onClick={onBack} className="w-full mt-2" disabled={isPending}>بازگشت به اطلاعات هویتی</Button>}
    </div>
  );
}
