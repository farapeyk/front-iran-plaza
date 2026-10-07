"use client";

import Link from "next/link";
import { 
  Home, 
  LayoutGrid, 
  Briefcase, 
  FileText, 
  HelpCircle, 
  PhoneCall, 
  Info, 
  ShieldCheck, 
  User, 
  ChevronLeft,
  Plus
} from "lucide-react";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface MobileDrawerProps {
  isLoggedIn?: boolean;
  isAdmin?: boolean;
  user?: {
    name: string;
    phone: string;
  };
}

const menuItems = [
  { title: "خانه", href: "/", icon: Home, active: true },
  { title: "دسته‌بندی کسب‌ و کارها", href: "/businesses", icon: LayoutGrid },
  { title: "ثبت رایگان کسب‌ و کار", href: "/dashboard/business/new", icon: Briefcase },
  { title: "مقالات", href: "/articles", disabled: true, icon: FileText },
  { title: "سوالات متداول", href: "/#faq", icon: HelpCircle, divider: true },
  { title: "تماس با ما", href: "/contact", disabled: true, icon: PhoneCall },
  { title: "درباره ما", href: "/#about", icon: Info },
  { title: "قوانین و مقررات", href: "/terms", disabled: true, icon: ShieldCheck },
];

export function MobileDrawer({ isLoggedIn = false, isAdmin = false, user }: MobileDrawerProps) {
  const registrationHref = isAdmin ? "/admin/businesses/new" : "/dashboard/business/new";
  const registrationLabel = isAdmin ? "ثبت کسب‌وکار توسط مدیر" : "ثبت رایگان کسب و کار";
  return (
    <SheetContent 
      side="right" 
      dir="rtl" 
      className="w-[300px] bg-[#0B3C26] text-white border-none p-6 flex flex-col justify-between overflow-y-auto text-right"
    >
      <div>
        {/* Header Logo */}
        <SheetHeader className="text-right pb-6 border-b border-white/10">
          <SheetTitle className="text-2xl font-bold text-[#E8D4B0] text-center">Iran Plaza</SheetTitle>
          <p className="text-xs text-emerald-100/80 text-center">مرجع معرفی بهترین کسب و کارها</p>
        </SheetHeader>

        {/* User Card or Login Button */}
        <div className="my-6">
          {isLoggedIn && user ? (
            <Link href={isAdmin ? "/admin" : "/dashboard"} className="flex items-center justify-between p-3 bg-[#082D1C] border border-white/10 rounded-xl hover:bg-emerald-900/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center text-white">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{user.name}</div>
                  <div className="text-xs text-emerald-200/70">{user.phone}</div>
                </div>
              </div>
              <ChevronLeft className="w-5 h-5 text-emerald-300" />
            </Link>
          ) : (
            <Link href="/login" className="block">
              <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10 rounded-full py-5 text-sm font-medium">
                ورود / ثبت نام
              </Button>
            </Link>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <div key={item.title}>
              {item.divider && <div className="my-3 border-t border-white/10" />}
              {item.disabled ? <span aria-disabled="true" className="flex items-center gap-3 px-3 py-2.5 text-sm text-white/50"><item.icon className="w-5 h-5" />{item.title} (به‌زودی)</span> : <Link
                href={item.href === "/dashboard/business/new" ? registrationHref : item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  item.active 
                    ? "bg-white/10 text-[#E8D4B0]" 
                    : "text-emerald-100/90 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5 opacity-80" />
                <span>{item.href === "/dashboard/business/new" ? registrationLabel : item.title}</span>
              </Link>}
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom CTA Button */}
      <div className="pt-6 mt-auto">
        <Link href={registrationHref}><Button className="w-full bg-[#E8D4B0] text-[#0B3C26] hover:bg-[#dfc498] font-bold rounded-full py-6 flex items-center justify-center gap-2">
          <Plus className="w-5 h-5" />
          {registrationLabel}
        </Button></Link>
      </div>
    </SheetContent>
  );
}
