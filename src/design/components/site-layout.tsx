"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import { cn } from "@/design/lib/utils"
import { SiteHeader } from "@/design/components/site-header"
import { MobileHeader } from "@/design/components/mobile-header"
import { SiteFooter } from "@/design/components/site-footer"
import { BottomNav } from "@/design/components/bottom-nav"
import { MobileSideMenu, type MenuAuth } from "@/design/components/mobile-side-menu"
import { useDesignUser } from "@/design/provider"

type SiteLayoutProps = {
  children: ReactNode
  className?: string
  showFooter?: boolean
  showBottomNav?: boolean
  /** When false, hides the desktop marketing header (dashboard chrome). */
  showHeader?: boolean
  /** When false, hides the mobile logo/menu bar (use with in-page back headers). */
  showMobileHeader?: boolean
  auth?: "logout" | "login" | "dashboard"
}

function SiteLayout({
  children,
  className,
  showFooter = true,
  showBottomNav = true,
  showHeader = true,
  showMobileHeader = true,
  auth: requestedAuth,
}: SiteLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const user = useDesignUser()
  const auth = requestedAuth ?? (user ? "dashboard" : "logout")
  const menuAuth: MenuAuth =
    auth === "dashboard" ? "member" : auth === "login" ? "login" : "logout"

  return (
    <div className={cn("flex min-h-svh flex-col bg-[var(--surface-muted)]", className)}>
      {showHeader ? <SiteHeader auth={auth} className="hidden lg:block" /> : null}
      {showMobileHeader ? (
        <MobileHeader onMenuClick={() => setMenuOpen(true)} />
      ) : null}
      <MobileSideMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        auth={menuAuth}
      />
      <main className={cn("flex-1", showBottomNav && "pb-[82px] lg:pb-0")}>
        {children}
      </main>
      {showFooter ? <SiteFooter /> : null}
      {showBottomNav ? <BottomNav /> : null}
    </div>
  )
}

export { SiteLayout }
