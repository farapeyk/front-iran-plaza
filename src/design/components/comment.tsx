"use client"

import { cn } from "@/design/lib/utils"
import { UserAvatar } from "@/design/components/user-avatar"
import { LikeButton } from "@/design/components/like-button"
const undoIcon = "/design/icons/undo.svg"
const addIcon = "/design/icons/add.svg"

type CommentReply = {
  name: string
  date: string
  text: string
}

type CommentProps = {
  className?: string
  name?: string
  date?: string
  text?: string
  replies?: CommentReply[]
  repliesCount?: number
  onReply?: () => void
  onMoreReplies?: () => void
}

/** Figma comment — 0 / 1 / 2+ reply variants */
function Comment({
  className,
  name = "مهدی",
  date = "۱۴۰۴/۰۶/۲۸",
  text = "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است",
  replies = [],
  repliesCount,
  onReply,
  onMoreReplies,
}: CommentProps) {
  const count = repliesCount ?? replies.length
  const shown = replies.slice(0, 2)

  return (
    <article
      data-slot="comment"
      data-replies={count}
      className={cn(
        "flex w-full max-w-[345px] items-start justify-start gap-[var(--lg)] border-b border-[var(--opacity-dark-8)] pb-[var(--2xl)]",
        className
      )}
    >
      <UserAvatar size={40} className="shrink-0" />
      <div className="flex min-w-0 flex-1 flex-col items-start gap-4">
        <div className="flex w-full flex-col items-start leading-normal">
          <p className="w-full text-right text-base font-bold text-[var(--text-title)]">
            {name}
          </p>
          <p className="text-sm text-[var(--text-subtitle)]">{date}</p>
        </div>

        <p className="w-full text-right text-lg leading-relaxed text-[var(--text-body)]">
          {text}
        </p>

        <div className="flex w-full items-center justify-start gap-[var(--lg)]">
          <button
            type="button"
            onClick={onReply}
            className="flex h-8 items-center gap-2 rounded-full border border-[var(--opacity-dark-16)] px-3 text-sm font-bold text-[var(--text-body)]"
          >
            پاسخ
            <img alt="" className="size-4" height={16} src={undoIcon} width={16} />
          </button>
          <LikeButton type="dislike" pressed={false} />
          <LikeButton type="like" pressed={false} />
        </div>

        {count > 0 ? (
          <div className="flex w-full flex-col items-start gap-3">
            <p className="text-sm font-normal text-[var(--text-success)]">
              {count} پاسخ ثبت شده
            </p>
            {shown.map((r) => (
              <div
                key={`${r.name}-${r.date}`}
                className="flex w-full flex-col items-start gap-4 rounded-[var(--radius-xs)] border border-[var(--opacity-dark-8)] bg-secondary-50 p-[var(--lg)]"
              >
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserAvatar size={32} />
                    <p className="text-base font-bold text-[var(--text-title)]">
                      {r.name}
                    </p>
                  </div>
                  <p className="text-sm text-[var(--text-subtitle)]">{r.date}</p>
                </div>
                <p className="w-full text-right text-base leading-relaxed text-[var(--text-body)]">
                  {r.text}
                </p>
                <div className="flex items-start gap-4">
                  <LikeButton type="dislike" pressed={false} />
                  <LikeButton type="like" pressed={false} />
                </div>
              </div>
            ))}
            {count > 2 ? (
              <button
                type="button"
                onClick={onMoreReplies}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-full text-base font-bold text-[var(--text-body)]"
              >
                پاسخ های بیشتر
                <img alt="" className="size-6" height={24} src={addIcon} width={24} />
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  )
}

export { Comment }
export type { CommentReply, CommentProps }
