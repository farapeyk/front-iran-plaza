import { LogOut } from "lucide-react";
import { logoutAction } from "@/features/auth/actions/logout.action";
import { DashboardMenuItem } from "./dashboard-menu-item";

export function DashboardLogoutItem() {
  return (
    <form action={logoutAction}>
      <button type="submit" className="w-full text-right">
        <DashboardMenuItem 
          title="خروج از حساب" 
          subtitle="خروج امن از حساب کاربری" 
          icon={LogOut} 
          tone="danger" 
        />
      </button>
    </form>
  );
}