"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, FilePlus2, FolderTree, Images, LogOut, MessageSquare } from "lucide-react";
import { logoutAction } from "@/features/auth/actions/logout.action";

export function ContentSidebar({ canPublish }: { canPublish: boolean }) {
  const pathname = usePathname();
  const items = [
    { href: "/content", label: "مقاله‌ها", icon: BookOpen },
    { href: "/content/articles/new", label: "مقاله جدید", icon: FilePlus2 },
    { href: "/content/media", label: "کتابخانه رسانه", icon: Images },
    ...(canPublish ? [
      { href: "/content/categories", label: "دسته‌بندی‌ها", icon: FolderTree },
      { href: "/content/banners", label: "بنرهای مقاله", icon: Images },
      { href: "/content/feedback", label: "نظرات مقاله‌ها", icon: MessageSquare },
    ] : []),
  ];
  return (
    <aside className="flex w-full shrink-0 flex-col border-b bg-white md:min-h-screen md:w-64 md:border-b-0 md:border-l">
      <div className="border-b px-5 py-5"><strong className="text-emerald-950">تحریریه ایران پلازا</strong></div>
      <nav className="flex-1 py-3">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/content" && pathname.startsWith(href));
          return <Link key={href} href={href} className={`flex items-center gap-3 px-5 py-3 text-sm ${active ? "bg-emerald-50 font-medium text-emerald-950" : "text-neutral-700 hover:bg-neutral-50"}`}><Icon size={18} />{label}</Link>;
        })}
      </nav>
      <form action={logoutAction} className="border-t p-3"><button type="submit" className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm text-red-600 hover:bg-red-50"><LogOut size={18} />خروج</button></form>
    </aside>
  );
}
