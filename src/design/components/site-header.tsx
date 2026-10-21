"use client"

import { Link } from "@/design/navigation"
import { User } from "lucide-react"
import { cn } from "@/design/lib/utils"
import { buttonVariants } from "@/design/components/ui/button-variants"
import { Logo } from "@/design/components/logo"
import { MenuDesktopLink } from "@/design/components/menu-desktop-link"
import { DashboardLoginButton } from "@/design/components/dashboard-login-button"

type SiteHeaderProps = {
  auth?: "logout" | "login" | "dashboard"
  className?: string
  divider?: boolean
}

function SiteHeader({
  auth = "logout",
  className,
  divider = false,
}: SiteHeaderProps) {
  return (
    <header
      data-slot="site-header"
      data-auth={auth}
      className={cn(
        "sticky top-0 z-50 w-full bg-[var(--surface-muted)]",
        divider && "border-b border-[var(--border-default)]",
        className
      )}
    >
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between gap-6 px-[var(--page-gutter)] lg:px-[var(--page-gutter-lg)]">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          <MenuDesktopLink to="/" end>
            خانه
          </MenuDesktopLink>
          <MenuDesktopLink to="/businesses" icon>
            کسب و کارها
          </MenuDesktopLink>
          <MenuDesktopLink to="/articles">مقالات</MenuDesktopLink>
        </nav>

        <div className="flex items-center gap-2">
          {auth === "dashboard" ? (
            <DashboardLoginButton />
          ) : (
            <>
              {auth === "logout" ? (
                <Link
                  to="/business-registration"
                  className="hidden text-sm text-[var(--text-title)] hover:text-primary-700 md:inline"
                >
                  ثبت رایگان کسب و کار
                </Link>
              ) : null}
              <Link
                to="/login"
                className={buttonVariants({ variant: "outline", size: "default" })}
              >
                <User className="size-5" />
                ورود / ثبت نام
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export { SiteHeader }
