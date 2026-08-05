"use client";

import Link from "next/link";
import { Menu, User, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { MobileDrawer } from "./mobile-drawer";

export function Navbar() {
  return (
    <header className="w-full bg-[#FAF7F0] border-b border-amber-900/5 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Desktop Navigation Links & Logo */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-2xl font-black text-[#0B3C26]">
            ایران<span className="text-[#C39E67]">پلازا</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium text-gray-700">
            <Link href="/" className="text-[#0B3C26] font-bold">خانه</Link>
            <Link href="/categories" className="hover:text-[#0B3C26] transition-colors">دسته‌بندی‌ها</Link>
            <Link href="/articles" className="hover:text-[#0B3C26] transition-colors">مقالات</Link>
            <Link href="/about" className="hover:text-[#0B3C26] transition-colors">درباره ما</Link>
          </nav>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/register-business">
            <Button className="bg-[#0B3C26] hover:bg-[#082D1C] text-white rounded-full px-6 py-2.5 font-medium flex items-center gap-2">
              <Plus className="w-4 h-4" />
              ثبت رایگان کسب و کار
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" className="rounded-full border-gray-300 text-gray-700 hover:bg-gray-100">
              <User className="w-4 h-4 ml-2" />
              ورود / ثبت نام
            </Button>
          </Link>
        </div>

        {/* Mobile Header Elements - ✅ راه‌حل جدید */}
        <div className="flex md:hidden items-center justify-between w-full">
          <Sheet>
            <SheetTrigger className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Menu className="w-6 h-6 text-gray-800" />
            </SheetTrigger>
            <MobileDrawer isLoggedIn={false} />
          </Sheet>

          <Link href="/" className="text-xl font-black text-[#0B3C26]">
            ایران پلازا
          </Link>

          <Link href="/login">
            <Button variant="ghost" size="icon" className="text-gray-800">
              <User className="w-6 h-6" />
            </Button>
          </Link>
        </div>

      </div>
    </header>
  );
}