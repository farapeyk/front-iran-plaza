import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAccessTokenCookie } from '@/lib/auth/cookies';
import { getBusinessPage, pageNumber } from '@/features/admin/lib/get-business-page';
import { Pagination } from '@/components/pagination';

export default async function SuspendedBusinessesPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const token = await getAccessTokenCookie();
  if (!token) redirect('/admin/login');
  const page = pageNumber((await searchParams).page);
  const result = await getBusinessPage<{ id: string; name: string }>(token, page, 'SUSPENDED');
  return <div dir="rtl" className="space-y-5"><h1 className="text-lg font-bold">کسب‌وکارهای معلق</h1>
    <p className="text-sm">این کسب‌وکارها در سایت نمایش داده نمی‌شوند. برای بررسی یا رفع تعلیق، جزئیات را باز کنید.</p>
    {result.data.length === 0 && <p>کسب‌وکار معلقی وجود ندارد.</p>}
    {result.data.map(business => <Link key={business.id} href={`/admin/businesses/${business.id}`} className="block space-y-2 rounded-lg border bg-white p-4">
      <strong>{business.name}</strong><p className="text-sm">مشاهده دلیل و مدیریت وضعیت کسب‌وکار</p>
    </Link>)}
    <Pagination base="/admin/businesses/suspended" page={page} total={result.total} take={result.take} />
  </div>;
}
