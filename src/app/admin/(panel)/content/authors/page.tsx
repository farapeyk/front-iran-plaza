import { ContentAuthorsManager } from "@/features/content/components/content-authors-manager";
import type { ContentAuthorAssignment } from "@/features/content/types";
import { backendGet } from "@/lib/api/backend-get";
import { getAccessTokenCookie } from "@/lib/auth/cookies";

export default async function ContentAuthorsPage() {
  const token = await getAccessTokenCookie();
  const assignments = await backendGet<ContentAuthorAssignment[]>("/api/admin/content/authors", token as string);
  return <div className="space-y-6"><header><h1 className="text-2xl font-black">نویسندگان محتوا</h1><p className="mt-1 text-sm text-neutral-500">این کاربران فقط مجوز ساخت و ویرایش مقاله‌های خودشان را می‌گیرند و به مدیریت کسب‌وکار، کاربران یا امور مالی دسترسی ندارند.</p></header><ContentAuthorsManager assignments={assignments} /></div>;
}
