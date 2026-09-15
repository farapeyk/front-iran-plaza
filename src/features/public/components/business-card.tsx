import Link from "next/link";
import { Building2, MapPin, CreditCard, ShieldCheck } from "lucide-react";
import type { PublicBusinessSummary } from "@/features/public/types/public-business";

function fileUrl(fileId: string) {
  return `/api/backend/files/${fileId}`;
}

export function BusinessCard({ business }: { business: PublicBusinessSummary }) {
  const isVip = business.planType === "VIP";

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-4 relative">
      {isVip && <span className="absolute top-3 right-3 bg-emerald-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">VIP</span>}

      <div className="flex items-start gap-3 mt-4">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-neutral-900 truncate">{business.name}</p>
          {business.description && <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{business.description}</p>}
        </div>
        <div className="w-14 h-14 rounded-lg bg-neutral-100 overflow-hidden shrink-0 flex items-center justify-center text-neutral-400">
          {business.logoId ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={fileUrl(business.logoId)} alt={business.name} className="w-full h-full object-cover" />
          ) : (
            <Building2 size={22} />
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <Link href={`/businesses/${business.slug}`} className="text-xs font-medium border border-neutral-300 rounded-full px-4 py-1.5 hover:bg-neutral-50">
          مشاهده پروفایل
        </Link>

        <div className="flex items-center gap-2">
          {business.hasInstallment && (
            <span title="امکان خرید اقساطی" className="text-blue-600">
              <CreditCard size={16} />
            </span>
          )}
          {isVip && (
            <span title="تایید‌شده" className="text-emerald-700">
              <ShieldCheck size={16} />
            </span>
          )}
          {(business.city || business.neighborhood) && (
            <span className="flex items-center gap-0.5 text-xs text-neutral-500">
              <MapPin size={12} />
              {business.neighborhood ?? business.city}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}