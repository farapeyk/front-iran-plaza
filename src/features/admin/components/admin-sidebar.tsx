"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Building2, Wallet, ShieldCheck, Tags, MessageSquare, LogOut , Users } from "lucide-react";
import { adminLogoutAction } from "@/features/admin/actions/admin-auth.action";
const NAV_ITEMS = [
  { href: "/admin", label: "داشبورد", icon: LayoutDashboard },
  { href: "/admin/businesses", label: "تمام کسب‌وکارها", icon: Building2 }, // این خط اضافه شد
  { href: "/admin/businesses/pending", label: "کسب‌وکارهای در انتظار", icon: Building2 },
  { href: "/admin/users", label: "کاربران", icon: Users },
  { href: "/admin/wallet", label: "کیف پول و تراکنش‌ها", icon: Wallet },
  { href: "/admin/roles", label: "نقش‌ها (RBAC)", icon: ShieldCheck },
  { href: "/admin/plans", label: "پلن‌ها", icon: Tags },
  { href: "/admin/messages", label: "پیام به کاربران", icon: MessageSquare },
];
export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-l border-neutral-200 bg-white min-h-screen flex flex-col">
      <div className="px-5 py-5 border-b border-neutral-200">
        <span className="font-bold text-emerald-950">پنل ادمین — ایران پلازا</span>
      </div>

      <nav className="flex-1 py-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={["flex items-center gap-3 px-5 py-2.5 text-sm", active ? "bg-emerald-50 text-emerald-950 font-medium" : "text-neutral-700 hover:bg-neutral-50"].join(" ")}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <form action={adminLogoutAction} className="border-t border-neutral-200 p-3">
        <button type="submit" className="w-full flex items-center gap-3 px-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md">
          <LogOut size={18} />
          خروج از پنل
        </button>
      </form>
    </aside>
  );
}