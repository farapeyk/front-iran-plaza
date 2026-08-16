"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { suspendUserAction, reinstateUserAction } from "@/features/admin/actions/users.action";

export function UserSuspensionActions({ userId, isSuspended }: { userId: string; isSuspended: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [showReason, setShowReason] = useState(false);
  const [reason, setReason] = useState("");

  function handleReinstate() {
    startTransition(async () => {
      const result = await reinstateUserAction(userId);
      if (!result.success) toast.error(result.message);
      else toast.success("تعلیق کاربر رفع شد");
    });
  }

  function handleSuspend() {
    if (reason.trim().length < 5) {
      toast.error("دلیل تعلیق باید حداقل ۵ کاراکتر باشد");
      return;
    }
    startTransition(async () => {
      const result = await suspendUserAction(userId, reason);
      if (!result.success) toast.error(result.message);
      else {
        toast.success("کاربر تعلیق شد");
        setShowReason(false);
      }
    });
  }

  if (isSuspended) {
    return (
      <button
        onClick={handleReinstate}
        disabled={isPending}
        className="text-sm px-4 py-2 rounded-md bg-emerald-950 text-white hover:bg-emerald-900 disabled:opacity-50"
      >
        رفع تعلیق
      </button>
    );
  }

  return (
    <div>
      <button
        onClick={() => setShowReason((v) => !v)}
        disabled={isPending}
        className="text-sm px-4 py-2 rounded-md border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-50"
      >
        تعلیق کاربر
      </button>

      {showReason && (
        <div className="mt-2 flex gap-2">
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="دلیل تعلیق (حداقل ۵ کاراکتر)"
            className="flex-1 h-9 rounded-md border border-input px-3 text-sm"
            disabled={isPending}
          />
          <button
            onClick={handleSuspend}
            disabled={isPending}
            className="text-sm px-3 rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
          >
            ثبت تعلیق
          </button>
        </div>
      )}
    </div>
  );
}