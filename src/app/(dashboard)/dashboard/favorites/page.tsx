import Link from "next/link";
import { Heart } from "lucide-react";
import { getAccessTokenCookie } from "@/lib/auth/cookies";

interface FavoriteBusiness {
  id: string;
  name: string;
  slug: string;
  logoId: string | null;
}

function fileUrl(fileId: string) {
  return `/api/backend/files/${fileId}`;
}

async function getFavorites(accessToken: string): Promise<FavoriteBusiness[]> {
  const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}/api/users/me/favorites`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function FavoritesPage() {
  const accessToken = await getAccessTokenCookie();
  const favorites = accessToken ? await getFavorites(accessToken) : [];

  return (
    <div className="min-h-screen bg-[#FBF1E8] px-4 py-8" dir="rtl">
      <div className="max-w-md mx-auto">
        <h1 className="text-lg font-bold text-neutral-900 mb-1">علاقه‌مندی‌ها</h1>
        <p className="text-sm text-neutral-500 mb-6">{favorites.length} کسب‌وکار</p>

        {favorites.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-neutral-200">
            <Heart className="mx-auto text-neutral-300 mb-3" size={28} />
            <p className="text-sm text-neutral-500">هنوز کسب‌وکاری را به علاقه‌مندی‌ها اضافه نکرده‌اید.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {favorites.map((b) => (
              <Link key={b.id} href={`/businesses/${b.slug}`} className="flex items-center gap-3 bg-white border border-neutral-200 rounded-lg p-3 hover:border-emerald-300 transition-colors">
                <div className="w-10 h-10 rounded-full bg-neutral-100 overflow-hidden shrink-0">
                  {b.logoId && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={fileUrl(b.logoId)} alt={b.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <span className="font-medium text-neutral-900">{b.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}