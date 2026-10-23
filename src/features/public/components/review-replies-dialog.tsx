"use client";

import { useState } from "react";
import { ModalHeader } from "@/design/components/modal-header";
import { useModalFocus } from "@/design/lib/use-modal-focus";
import type { ReviewReplyData } from "@/features/public/types/review";

function Reply({ reply }: { reply: ReviewReplyData }) {
  return (
    <article key={reply.id} className="rounded-md bg-neutral-50 px-3 py-2 text-sm">
      {reply.isFromOwner && <strong className="me-1">پاسخ صاحب کسب‌وکار:</strong>}
      <span>{reply.comment}</span>
    </article>
  );
}

export function ReviewRepliesDialog({ replies }: { replies: ReviewReplyData[] }) {
  const [open, setOpen] = useState(false);
  const modalRef = useModalFocus(open, () => setOpen(false));
  if (!replies.length) return null;

  return (
    <div className="space-y-2">
      <div className="space-y-2">{replies.slice(0, 2).map((reply) => <Reply key={reply.id} reply={reply} />)}</div>
      {replies.length > 2 && (
        <button type="button" className="text-sm font-medium text-primary-700" onClick={() => setOpen(true)}>
          مشاهده همه پاسخ‌ها ({replies.length.toLocaleString("fa-IR")})
        </button>
      )}
      {open && (
        <div
          ref={modalRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label="پاسخ‌های نظر"
          className="fixed inset-0 z-50 flex items-end justify-center bg-[var(--backdrop)] lg:items-center"
        >
          <button type="button" className="absolute inset-0" aria-label="بستن" onClick={() => setOpen(false)} />
          <section className="relative z-10 flex max-h-[90svh] w-full max-w-xl flex-col overflow-hidden rounded-t-[var(--radius-lg)] bg-[var(--main-bg)] lg:rounded-[var(--radius-xs)]">
            <ModalHeader title="پاسخ‌های نظر" showClose onClose={() => setOpen(false)} />
            <div className="space-y-3 overflow-y-auto p-5">{replies.map((reply) => <Reply key={reply.id} reply={reply} />)}</div>
          </section>
        </div>
      )}
    </div>
  );
}
