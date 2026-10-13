"use client"

import { useState } from "react"
import { cn } from "@/design/lib/utils"
import { ModalHeader } from "@/design/components/modal-header"
import { Button } from "@/design/components/ui/button"
import { Field } from "@/design/components/ui/field"
const folderIcon = "/design/icons/briefcase.svg"

type AddCategorySheetProps = {
  open: boolean
  onClose: () => void
  onSave?: (name: string) => void
  className?: string
}

/** Figma add category — 7735:40091 */
function AddCategorySheet({
  open,
  onClose,
  onSave,
  className,
}: AddCategorySheetProps) {
  const [name, setName] = useState("")

  if (!open) return null

  const valid = name.trim().length > 0

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[var(--backdrop)] lg:items-center"
      role="dialog"
      aria-modal
      aria-label="افزودن دسته بندی"
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
        <ModalHeader
          title="افزودن دسته بندی"
          showClose
          showDragHandle
          showIcon
          iconSrc={folderIcon}
          onClose={onClose}
        />
        <div className="flex flex-col gap-[var(--5xl)] px-[var(--2xl)] pb-[var(--2xl)]">
          <Field
            label="نام دسته بندی"
            requiredMark
            placeholder="نام دسته بندی را وارد کنید..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button
            size="lg"
            className="h-12 w-full"
            disabled={!valid}
            onClick={() => {
              if (!valid) return
              onSave?.(name.trim())
              setName("")
              onClose()
            }}
          >
            ذخیره دسته بندی
          </Button>
        </div>
      </div>
    </div>
  )
}

export { AddCategorySheet }
