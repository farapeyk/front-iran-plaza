"use client"
import Image from "next/image";

import { cn } from "@/design/lib/utils"
import { ModalHeader } from "@/design/components/modal-header"
import { Button } from "@/design/components/ui/button"
const trashIcon = "/design/icons/trash.svg"

type ConfirmDeleteSheetProps = {
  open: boolean
  onClose: () => void
  onConfirm?: () => void
  title?: string
  description?: string
  className?: string
}

/** Figma delete confirmation — 7466:60408 */
function ConfirmDeleteSheet({
  open,
  onClose,
  onConfirm,
  title = "از حذف مطمعن هستید؟",
  description = "با حذف این مورد، اطلاعات مرتبط نیز حذف خواهند شد.",
  className,
}: ConfirmDeleteSheetProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[var(--backdrop)] lg:items-center"
      role="dialog"
      aria-modal
      aria-label={title}
    >
      <button
        type="button"
        className="absolute inset-0"
        aria-label="بستن"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative z-10 w-full max-w-md overflow-hidden rounded-t-[var(--radius-lg)] bg-[var(--main-bg)] lg:rounded-[var(--radius-xs)]",
          className
        )}
      >
        <ModalHeader showClose showDragHandle onClose={onClose} />
        <div className="flex flex-col items-center gap-[var(--5xl)] px-[var(--3xl)] pb-[var(--5xl)]">
          <div className="flex flex-col items-center gap-[var(--lg)] text-center">
            <div className="flex size-12 items-center justify-center rounded-full border-8 border-red-25 bg-red-500">
              <Image
                alt=""
                className="size-6 brightness-0 invert"
                height={24}
                src={trashIcon}
                width={24}
              />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-red-500">{title}</h2>
              <p className="text-lg leading-relaxed text-[var(--text-body)]">
                {description}
              </p>
            </div>
          </div>
          <div className="flex w-full gap-[var(--lg)]">
            <Button
              variant="destructive"
              size="lg"
              className="h-12 flex-1"
              onClick={() => {
                onConfirm?.()
                onClose()
              }}
            >
              بله حذف شود
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 flex-1 border-[var(--border-default)]"
              onClick={onClose}
            >
              نه حذف نشود
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export { ConfirmDeleteSheet }
