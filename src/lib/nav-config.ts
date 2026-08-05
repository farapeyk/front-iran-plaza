import {
  LayoutDashboard,
  Store,
  Wallet,
  FileText,
  Settings,
  type LucideIcon,
} from "lucide-react";

type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  roles: string[]; // کدام نقش‌ها دسترسی دارند
};

export const dashboardNav: NavItem[] = [
  {
    title: "داشبورد",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["BUSINESS_OWNER", "ADMIN", "SUPER_ADMIN"],
  },
  {
    title: "مدیریت کسب‌وکار",
    href: "/dashboard/business",
    icon: Store,
    roles: ["BUSINESS_OWNER", "ADMIN", "SUPER_ADMIN"],
  },
  {
    title: "کیف پول و تراکنش‌ها",
    href: "/dashboard/wallet",
    icon: Wallet,
    roles: ["BUSINESS_OWNER", "ADMIN", "SUPER_ADMIN"],
  },
  {
    title: "فاکتورها",
    href: "/dashboard/invoices",
    icon: FileText,
    roles: ["BUSINESS_OWNER"],
  },
  {
    title: "تنظیمات",
    href: "/dashboard/settings",
    icon: Settings,
    roles: ["BUSINESS_OWNER", "ADMIN", "SUPER_ADMIN"],
  },
];