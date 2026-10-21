import { DesignProvider } from '@/design/provider';
import { getCurrentUser } from '@/lib/auth/get-current-user';
import { redirect } from 'next/navigation';
import { businessControllerGetMine } from '@/design/api/generated/server';
export default async function Layout({children}:{children:React.ReactNode}) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  const businesses = await businessControllerGetMine();
  return <DesignProvider user={user} business={businesses[0] ?? null}>
    {businesses.filter(business => business.status === 'SUSPENDED').map(business => <div key={business.id} role="alert" className="mx-auto my-4 max-w-5xl rounded-lg border border-amber-300 bg-amber-50 p-5 text-amber-950" dir="rtl">
      <p className="font-bold">کسب‌وکار «{business.name}» تعلیق شده است</p>
      <p className="mt-2">این کسب‌وکار تا رفع تعلیق در سایت نمایش داده نمی‌شود.</p>
      <p className="mt-2">دلیل تعلیق: {business.suspendedReason || 'برای اطلاع از دلیل با پشتیبانی تماس بگیرید.'}</p>
    </div>)}
    {children}
  </DesignProvider>;
}
