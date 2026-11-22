type Engagement = {
  byType: Record<string, number>;
  legacyEstimate: number;
  displayedViews: number;
};

const metrics = [
  ['VIEW_BUSINESS', 'بازدید واقعی پروفایل'],
  ['VIEW_GALLERY', 'مشاهده گالری'],
  ['CLICK_PHONE', 'کلیک تماس'],
  ['CLICK_WHATSAPP', 'کلیک واتساپ'],
  ['CLICK_WEBSITE', 'کلیک وب‌سایت'],
  ['CLICK_LOCATION', 'کلیک آدرس'],
  ['SHARE_BUSINESS', 'اشتراک‌گذاری'],
] as const;

export function BusinessEngagement({ businessId, report }: { businessId: string; report: Engagement | null }) {
  const base = `/api/backend/admin/businesses/${encodeURIComponent(businessId)}/engagement`;
  return <section aria-labelledby="engagement-title" className="rounded-lg border border-neutral-200 bg-white p-5">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><h2 id="engagement-title" className="text-lg font-bold text-neutral-900">آمار تعامل کسب‌وکار</h2><p className="mt-1 text-sm text-neutral-600">از زمان فعال‌شدن ثبت رویداد · فقط برای ادمین</p></div>
      {report && <div className="flex flex-wrap gap-2">
        <a href={`${base}/events.csv`} download className="rounded-md border border-emerald-700 px-3 py-2 text-sm font-bold text-emerald-900">خروجی CSV رویدادهای واقعی</a>
        <a href={`${base}/report.xlsx`} download className="rounded-md bg-emerald-950 px-3 py-2 text-sm font-bold text-white">گزارش Excel</a>
      </div>}
    </div>
    {!report ? <p role="status" className="mt-4 text-sm text-amber-800">دریافت آمار انجام نشد؛ صفحه را دوباره بارگذاری کنید.</p> : <>
      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        {metrics.map(([type, label]) => <div key={type} className="rounded-md border border-neutral-200 p-4"><p className="text-sm text-neutral-600">{label}</p><strong className="mt-2 block text-xl text-neutral-900">{(report.byType[type] ?? 0).toLocaleString('fa-IR')}</strong></div>)}
      </div>
      <div className="mt-4 rounded-md bg-amber-50 p-4 text-sm text-amber-950">
        <p>برآورد نمایشی بازدیدهای قدیمی: <strong>{report.legacyEstimate.toLocaleString('fa-IR')}</strong> · مجموع نمایشی بازدید: <strong>{report.displayedViews.toLocaleString('fa-IR')}</strong></p>
        <p className="mt-1">این برآورد ۵۰ تا ۱۰۰ بازدید برای هر کسب‌وکار ثابت است و رویداد واقعی محسوب نمی‌شود. در CSV وارد نشده و در فایل Excel جداگانه مشخص شده است.</p>
      </div>
    </>}
  </section>;
}
