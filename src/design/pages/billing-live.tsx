import { DashboardAccountLayout } from '@/design/components/dashboard-account-layout';
import { VipBadge } from '@/design/components/vip-badge';
import type { planControllerGetActivePlans } from '@/design/api/generated/server';

type Plans = Awaited<ReturnType<typeof planControllerGetActivePlans>>;
const money = (value: string | number) => Number(value).toLocaleString('fa-IR') + ' تومان';

export function SubscriptionLivePage({ plans, available }: { plans: Plans; available: boolean }) {
  const vipPlans = plans.filter(plan => plan.tier === 'VIP');
  return <DashboardAccountLayout title="اشتراک VIP">
    <div className="space-y-8">
      <div className="space-y-3"><div className="flex items-center gap-3"><VipBadge className="h-10 w-9"/><h2 className="text-2xl font-black">پلن‌های VIP ایران پلازا</h2></div><p className="leading-8 text-[var(--text-body)]">در حال حاضر پرداخت آنلاین فعال نیست و پلن پس از هماهنگی، توسط ادمین به کسب‌وکار شما اختصاص داده می‌شود. اعتبار پیش‌فرض پلن‌ها ۳۰ روز است.</p></div>
      {!available && <p role="status" className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900">دریافت پلن‌ها در حال حاضر امکان‌پذیر نیست.</p>}
      <div className="grid gap-4 sm:grid-cols-2">{vipPlans.map(plan => <article key={plan.id} className="relative space-y-4 rounded-[var(--radius-xs)] border border-primary-100 bg-[var(--surface)] p-5 pt-8"><VipBadge className="absolute -top-4 start-5 h-9 w-8"/><h3 className="text-xl font-black">{plan.name}</h3><p>{plan.durationDays.toLocaleString('fa-IR')} روز اعتبار</p><p className="text-lg font-bold text-primary-700">{money(plan.price)}</p><p className="text-sm leading-7 text-[var(--text-muted)]">برای فعال‌سازی این پلن با پشتیبانی یا ادمین ایران پلازا هماهنگ کنید.</p></article>)}</div>
      {available && vipPlans.length === 0 && <p className="rounded-lg border border-dashed p-6 text-center text-[var(--text-muted)]">هنوز پلن VIP فعالی تعریف نشده است.</p>}
    </div>
  </DashboardAccountLayout>;
}

export function PaymentsLivePage() {
  return <DashboardAccountLayout title="پرداخت‌ها"><p role="status">نمایش سوابق پرداخت در حال حاضر در دسترس نیست.</p></DashboardAccountLayout>;
}
