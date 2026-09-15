// src/features/public/components/site-header.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, UserCircle } from "lucide-react";
import type { CurrentUser } from "@/types/auth"; 

interface SiteHeaderProps {
  user?: CurrentUser | null; 
}

export function SiteHeader({ user }: SiteHeaderProps) {
  const [businessesOpen, setBusinessesOpen] = useState(false);

  return (
    <header className="border-b border-neutral-200 bg-[#FBF1E8]" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-emerald-950">
          Iran Plaza
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-neutral-700">
          <Link href="/" className="hover:text-emerald-900">
            خانه
          </Link>

          <div className="relative" onMouseEnter={() => setBusinessesOpen(true)} onMouseLeave={() => setBusinessesOpen(false)}>
            <button className="flex items-center gap-1 hover:text-emerald-900">
              کسب‌وکارها
              <ChevronDown size={14} />
            </button>
            {businessesOpen && (
              <div className="absolute top-full right-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-sm py-2 min-w-[180px] z-10">
                <Link href="/businesses" className="block px-4 py-2 text-sm hover:bg-neutral-50">
                  مرور همه کسب‌وکارها
                </Link>
              </div>
            )}
          </div>

          <span className="text-neutral-400 cursor-not-allowed">مقالات</span>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/business/new"
            className="hidden sm:inline-flex text-sm border border-emerald-800 text-emerald-900 rounded-full px-4 py-2 hover:bg-emerald-50"
          >
            ثبت رایگان کسب‌وکار
          </Link>
          
          {/* ✅ شرط لاگین بودن یا نبودن */}
          {user ? (
            <Link href="/dashboard" className="flex items-center gap-1.5 text-sm border border-emerald-800 text-emerald-900 rounded-full px-4 py-2 hover:bg-emerald-50">
              <UserCircle size={16} />
              {user.fullName || user.phone}
            </Link>
          ) : (
            <Link href="/login" className="flex items-center gap-1.5 text-sm border border-neutral-300 rounded-full px-4 py-2 hover:bg-white">
              <UserCircle size={16} />
              ورود / ثبت‌نام
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}