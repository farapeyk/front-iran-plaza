import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function ProfileEditShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FBF1E8]" dir="rtl">
      <div className="max-w-md mx-auto pt-6 pb-10 px-4">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/dashboard/business/profile" className="text-neutral-500">
            <ChevronRight size={20} />
          </Link>
          <h1 className="text-lg font-bold text-neutral-900">{title}</h1>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-5">{children}</div>
      </div>
    </div>
  );
}