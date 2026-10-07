import { LayoutDashboard, Store, User, Heart, Bell, type LucideIcon } from 'lucide-react';
type NavItem = { title: string; href: string; icon: LucideIcon; roles: string[] };
const roles = ['CUSTOMER', 'BUSINESS_OWNER', 'ADMIN', 'SUPER_ADMIN'];
export const dashboardNav: NavItem[] = [
  { title: 'داشبورد', href: '/dashboard', icon: LayoutDashboard, roles },
  { title: 'مدیریت کسب‌وکار', href: '/dashboard/business/profile', icon: Store, roles },
  { title: 'حساب کاربری', href: '/dashboard/profile', icon: User, roles },
  { title: 'علاقه‌مندی‌ها', href: '/dashboard/favorites', icon: Heart, roles },
  { title: 'اعلان‌ها', href: '/dashboard/notifications', icon: Bell, roles },
];
