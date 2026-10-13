"use client"

import { useState } from "react"
import { useModalFocus } from '@/design/lib/use-modal-focus'
import { cn } from "@/design/lib/utils"
import { ModalHeader } from "@/design/components/modal-header"
import { UserAvatar } from "@/design/components/user-avatar"
import { Button } from "@/design/components/ui/button"

type ReplyComment = {
  name: string
  date: string
  text: string
}

type ReplyCommentSheetProps = {
  open: boolean
  onClose: () => void
  comment?: ReplyComment | null
  onSubmit?: (reply: string) => void
  className?: string
}

/** Figma reply comment — 7098:7660 */
function ReplyCommentSheet({
  open,
  onClose,
  comment,
  onSubmit,
  className,
}: ReplyCommentSheetProps) {
  const [reply, setReply] = useState("")
  const modalRef = useModalFocus(open && !!comment, onClose)

  if (!open || !comment) return null

  function handleSend() {
    const trimmed = reply.trim()
    if (!trimmed) return
    onSubmit?.(trimmed)
    setReply("")
    onClose()
  }

  return (
    <div
      ref={modalRef}
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-end justify-center bg-[var(--backdrop)] lg:items-center"
      role="dialog"
      aria-modal
      aria-label="پاسخ به نظر"
    >
      <button
        type="button"
        className="absolute inset-0"
        aria-label="بستن"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative z-10 flex max-h-[90svh] w-full max-w-lg flex-col overflow-hidden rounded-t-[var(--radius-lg)] bg-[var(--main-bg)] lg:rounded-[var(--radius-xs)]",
          className
        )}
      >
        <ModalHeader
          title="پاسخ به نظر"
          showBack
          showClose={false}
          onBack={onClose}
        />

        <div className="flex flex-1 flex-col justify-between gap-[var(--2xl)] overflow-y-auto px-[var(--2xl)] pb-[var(--2xl)]">
          <div className="flex flex-col gap-[var(--2xl)]">
            <article className="space-y-4 rounded-[var(--radius-xs)] bg-secondary-100 px-[var(--lg)] pb-[var(--2xl)] pt-[var(--lg)] text-right">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-[var(--text-subtitle)]">{comment.date}</p>
                <div className="flex items-center gap-[var(--sm)]">
                  <p className="text-base font-bold text-[var(--text-title)]">
                    {comment.name}
                  </p>
                  <UserAvatar size={32} color="gold-neutral" />
                </div>
              </div>
              <p className="text-base leading-relaxed text-[var(--text-body)]">
                {comment.text}
              </p>
            </article>

            <div className="space-y-1 text-right">
              <p className="text-lg font-bold text-[var(--text-body)]">پاسخ شما</p>
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="پاسخ خود را بنویسید..."
                rows={4}
                className="h-[120px] w-full resize-none rounded-[var(--radius-xs)] border border-[var(--input-border)] bg-transparent p-[var(--lg)] text-right text-base text-[var(--input-value)] outline-none placeholder:text-[var(--input-placeholder)] focus:border-[var(--opacity-dark-16)]"
              />
            </div>
          </div>

          <Button
            size="lg"
            className="h-12 w-full"
            disabled={!reply.trim()}
            onClick={handleSend}
          >
            ارسال
          </Button>
        </div>
      </div>
    </div>
  )
}

export { ReplyCommentSheet }
export type { ReplyComment }
