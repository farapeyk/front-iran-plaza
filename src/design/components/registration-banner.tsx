"use client"
import Image from "next/image";

import { Link } from "@/design/navigation"
import { cn } from "@/design/lib/utils"
import { buttonVariants } from "@/design/components/ui/button-variants"
const addIcon = "/design/icons/add.svg"

type RegistrationBannerProps = {
  className?: string
  variant?: "footer-strip" | "promo" | "sidebar"
}

function RegistrationBanner({
  className,
  variant = "promo",
}: RegistrationBannerProps) {
  if (variant === "footer-strip") {
    return (
      <div
        className={cn(
          "flex items-center justify-between gap-4 bg-secondary-100 px-[var(--page-gutter)] py-4",
          className
        )}
      >
        <div className="text-start">
          <p className="text-lg font-black text-primary-950">ثبت رایگان کسب و کار</p>
          <p className="text-sm text-[var(--text-title)]">
            پروفایل رایگان برای معرفی کسب‌وکار شما
          </p>
        </div>
        <Link to="/business-registration" className={buttonVariants({ size: "sm" })}>
          ثبت نام
        </Link>
      </div>
    )
  }

  if (variant === "sidebar") {
    return (
      <div
        className={cn(
          "flex w-full items-center gap-3 overflow-hidden rounded-[var(--radius-xs)] bg-gradient-to-l from-primary-700 via-primary-950 to-primary-500 p-3",
          className
        )}
      >
        <div className="min-w-0 flex-1 space-y-0.5 text-start">
          <p className="text-sm font-black text-secondary-300">ثبت رایگان کسب و کار</p>
          <p className="text-xs text-[var(--text-light-title)]">
            پروفایل رایگان برای معرفی کسب‌وکار شما
          </p>
        </div>
        <Link
          to="/business-registration"
          className={cn(
            buttonVariants({ variant: "secondary", size: "sm" }),
            "shrink-0 gap-1 bg-secondary-300 text-[var(--text-title)] hover:bg-secondary-400"
          )}
        >
          <Image alt="" className="size-4" height={16} src={addIcon} width={16} />
          ثبت نام
        </Link>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "relative flex flex-col items-stretch justify-between gap-4 overflow-hidden rounded-s-[48px] rounded-e-sm bg-gradient-to-l from-primary-700 via-primary-950 to-primary-500 px-[var(--page-gutter)] py-6 lg:flex-row lg:items-center lg:px-[var(--2xl)]",
        className
      )}
    >
      <p className="text-start text-2xl font-black text-secondary-300 lg:text-[28px]">
        ثبت رایگان کسب و کار
      </p>
      <p className="text-start text-lg text-[var(--text-light-title)] lg:text-xl">
        پروفایل رایگان برای معرفی کسب‌وکار شما
      </p>
      <Link
        to="/business-registration"
        className={cn(
          buttonVariants({ variant: "secondary", size: "default" }),
          "gap-2 bg-secondary-300 text-[var(--text-title)] hover:bg-secondary-400"
        )}
      >
        <span className="size-6 overflow-clip">
          <Image alt="" className="size-full" height={24} src={addIcon} width={24} />
        </span>
        ثبت نام رایگان
      </Link>
    </div>
  )
}

export { RegistrationBanner }
