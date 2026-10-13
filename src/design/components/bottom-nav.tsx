"use client"

import { NavLink } from "@/design/navigation"
import { cn } from "@/design/lib/utils"
const homeIcon = "/design/icons/home-2.svg"
const categoriesIcon = "/design/icons/element-3.svg"
const searchIcon = "/design/icons/search.svg"
const profileIcon = "/design/icons/profile-circle.svg"

type BottomNavProps = {
  className?: string
  /** Figma Bottom menu: logout = ورود/ثبت نام | login = پروفایل من + avatar */
  auth?: "logout" | "login"
  avatarSrc?: string
}

/** Figma Bottom menu — logout / login (RTL: خانه سمت راست) */
function BottomNav({ className, auth = "logout", avatarSrc }: BottomNavProps) {
  const items = [
    { to: "/", label: "خانه", icon: homeIcon, end: true as const },
    { to: "/businesses", label: "کسب وکارها", icon: categoriesIcon },
    { to: "/search", label: "جستجو", icon: searchIcon },
    auth === "login"
      ? { to: "/profile", label: "پروفایل من", avatar: true as const }
      : { to: "/login", label: "ورود/ثبت نام", icon: profileIcon },
  ] as const

  return (
    <nav
      data-slot="bottom-nav"
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 flex border-t border-[var(--opacity-dark-8)] bg-secondary-25 lg:hidden",
        className
      )}
    >
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={"end" in item ? item.end : false}
          className={({ isActive }) =>
            cn(
              "flex flex-1 flex-col items-center justify-center gap-[var(--sm)] py-[var(--lg)] text-center text-xs font-bold text-primary-700",
              isActive ? "opacity-100" : "opacity-80"
            )
          }
        >
          {"avatar" in item && item.avatar ? (
            <span className="size-6 overflow-hidden rounded-full border border-[var(--opacity-dark-8)] bg-[var(--opacity-dark-24)]">
              {avatarSrc ? (
                <img alt="" className="size-full object-cover" src={avatarSrc} />
              ) : (
                <span className="block size-full bg-primary-200" />
              )}
            </span>
          ) : (
            <span className="size-6 overflow-clip">
              <img
                alt=""
                className="size-full"
                height={24}
                src={"icon" in item ? item.icon : profileIcon}
                width={24}
              />
            </span>
          )}
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

export { BottomNav }
