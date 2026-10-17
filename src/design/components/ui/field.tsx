"use client"
import Image from "next/image";

import * as React from "react"
import { cn } from "@/design/lib/utils"
import { Input } from "@/design/components/ui/input"
import { Label } from "@/design/components/ui/label"
const lockIcon = "/design/icons/lock.svg"
const infoCircleIcon = "/design/icons/info-circle.svg"

type FieldProps = {
  label?: string
  error?: string
  locked?: boolean
  requiredMark?: boolean
  className?: string
  inputClassName?: string
} & React.ComponentProps<"input">

function Field({
  label,
  error,
  locked = false,
  requiredMark = false,
  className,
  inputClassName,
  id,
  disabled,
  ...props
}: FieldProps) {
  const generatedId = React.useId()
  const inputId = id ?? generatedId
  const describedBy = error ? `${inputId}-error` : undefined

  return (
    <div className={cn("flex w-full flex-col gap-1", className)}>
      {label ? (
        <Label
          htmlFor={inputId}
          className="text-right text-lg font-bold text-[var(--input-label)]"
        >
          {label}
          {requiredMark ? (
            <span className="ms-0.5 text-[var(--danger)]">*</span>
          ) : null}
        </Label>
      ) : null}

      <div className="relative">
        {locked ? (
          <span className="pointer-events-none absolute start-4 top-1/2 size-6 -translate-y-1/2 overflow-clip">
            <Image alt="" className="size-full" height={24} src={lockIcon} width={24} />
          </span>
        ) : null}
        <Input
          id={inputId}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy}
          disabled={disabled || locked}
          readOnly={locked || props.readOnly}
          className={cn(locked && "ps-12", inputClassName)}
          {...props}
        />
      </div>

      {error ? (
        <div
          id={describedBy}
          className="flex items-center justify-start gap-2 text-sm leading-relaxed text-[var(--danger)]"
        >
          <span>{error}</span>
          <span className="size-6 shrink-0 overflow-clip">
            <Image
              alt=""
              className="size-full"
              height={24}
              src={infoCircleIcon}
              width={24}
            />
          </span>
        </div>
      ) : null}
    </div>
  )
}

export { Field }
