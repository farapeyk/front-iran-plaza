import Form from "next/form";
import Link from "next/link";

interface BusinessListFiltersProps {
  action: string;
  search: string;
  status?: string;
  registrationType?: string;
  showStatus?: boolean;
}

export function BusinessListFilters({
  action,
  search,
  status = "",
  registrationType = "",
  showStatus = false,
}: BusinessListFiltersProps) {
  const hasFilters = Boolean(search || status || registrationType);

  return (
    <Form action={action} className={`mb-6 grid gap-3 rounded-lg border border-neutral-200 bg-white p-4 ${showStatus ? "md:grid-cols-[minmax(220px,1fr)_180px_180px_auto_auto]" : "md:grid-cols-[minmax(220px,1fr)_180px_auto_auto]"}`}>
      <label className="space-y-1 text-xs font-medium text-neutral-600">
        جست‌وجو
        <input
          type="search"
          name="search"
          defaultValue={search}
          maxLength={120}
          placeholder="نام یا شماره تماس کسب‌وکار"
          className="h-10 w-full rounded-md border border-neutral-300 px-3 text-sm font-normal outline-none focus:border-emerald-700"
        />
      </label>

      {showStatus && (
        <label className="space-y-1 text-xs font-medium text-neutral-600">
          وضعیت
          <select name="status" defaultValue={status} className="h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm font-normal">
            <option value="">همه وضعیت‌ها</option>
            <option value="PENDING">در انتظار</option>
            <option value="APPROVED">تأییدشده</option>
            <option value="REJECTED">ردشده</option>
            <option value="SUSPENDED">معلق</option>
          </select>
        </label>
      )}

      <label className="space-y-1 text-xs font-medium text-neutral-600">
        نوع ثبت
        <select name="registrationType" defaultValue={registrationType} className="h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm font-normal">
          <option value="">همه روش‌های ثبت</option>
          <option value="USER_SELF">ثبت توسط کاربر</option>
          <option value="ADMIN_MANUAL">ثبت دستی قدیمی</option>
          <option value="IN_PERSON">ثبت حضوری</option>
          <option value="TELEPHONE">ثبت تلفنی</option>
        </select>
      </label>

      <button type="submit" className="h-10 self-end rounded-md bg-emerald-950 px-5 text-sm font-medium text-white hover:bg-emerald-900">
        اعمال فیلتر
      </button>
      {hasFilters && (
        <Link href={action} className="flex h-10 items-center justify-center self-end rounded-md border border-neutral-300 px-4 text-sm text-neutral-600 hover:bg-neutral-50">
          پاک‌کردن
        </Link>
      )}
    </Form>
  );
}
