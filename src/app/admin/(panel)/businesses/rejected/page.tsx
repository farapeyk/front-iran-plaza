import { Pagination } from '@/components/pagination';
import { getBusinessPage, pageNumber } from '@/features/admin/lib/get-business-page';
// src/app/admin/(panel)/businesses/rejected/page.tsx
import { getAccessTokenCookie } from "@/lib/auth/cookies";
import { PendingBusinessRow } from "@/features/admin/components/pending-business-row";

interface BusinessListItem {
  id: string;
  name: string;
  phone: string;
  status: string;
  address: string | null;
  createdAt: string;
}

export default async function RejectedBusinessesPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const page = pageNumber((await searchParams).page);
  const accessToken = await getAccessTokenCookie();
  const result = accessToken ? await getBusinessPage<BusinessListItem>(accessToken, page, 'REJECTED') : { data: [], total: 0, take: 20, page };
  const businesses = result.data;

  return (
    <div dir="rtl">
      <h1 className="text-lg font-bold text-neutral-900 mb-1">کسب‌وکارهای رد شده</h1>
      <p className="text-sm text-neutral-500 mb-6">{result.total} مورد یافت شد</p>

      {businesses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-neutral-200">
          <p className="text-sm text-neutral-500">هیچ کسب‌وکار رد شده‌ای وجود ندارد.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {businesses.map((b) => (
            <PendingBusinessRow 
              key={b.id} 
              id={b.id} 
              name={b.name} 
              phone={b.phone} 
              address={b.address} 
              createdAt={b.createdAt} 
            />
          ))}
        </div>
      )}
      <Pagination base="/admin/businesses/rejected" page={page} total={result.total} take={result.take} />
    </div>
  );
}