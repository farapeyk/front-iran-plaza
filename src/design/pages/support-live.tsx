import { DashboardAccountLayout } from '@/design/components/dashboard-account-layout';
import { Link } from '@/design/navigation';
export function SupportLivePage() {
  return <DashboardAccountLayout title="پشتیبانی"><section className="space-y-4 rounded border bg-[var(--surface)] p-5"><h2 className="text-xl font-bold">پشتیبانی</h2><p role="status">ثبت و پیگیری پیام پشتیبانی در حال حاضر در دسترس نیست.</p><Link to="/faq" className="font-bold text-primary-700">سوالات متداول</Link></section></DashboardAccountLayout>;
}
