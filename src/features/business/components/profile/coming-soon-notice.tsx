export function ComingSoonNotice({ title }: { title: string }) {
  return (
    <div className="text-center py-8" dir="rtl">
      <p className="text-sm text-neutral-500">بخش «{title}» به‌زودی تکمیل می‌شود.</p>
    </div>
  );
}