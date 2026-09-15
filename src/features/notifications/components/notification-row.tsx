"use client";

import { useState, useTransition } from "react";
import { Bell } from "lucide-react";
import { markNotificationReadAction } from "@/features/notifications/actions/notifications.action";
import type { NotificationItem } from "@/features/notifications/types";

export function NotificationRow({ notification }: { notification: NotificationItem }) {
  const [isPending, startTransition] = useTransition();
  const [isRead, setIsRead] = useState(notification.isRead);

  function handleClick() {
    if (isRead) return;
    startTransition(async () => {
      const result = await markNotificationReadAction(notification.id);
      if (result.success) setIsRead(true);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={["w-full text-right flex items-start gap-3 border-b border-neutral-100 px-4 py-3 last:border-0", isRead ? "bg-white" : "bg-emerald-50/50"].join(" ")}
    >
      <Bell className={isRead ? "text-neutral-300" : "text-emerald-700"} size={18} />
      <div className="flex-1">
        <p className={["text-sm", isRead ? "text-neutral-700" : "font-bold text-neutral-900"].join(" ")}>{notification.title}</p>
        <p className="text-sm text-neutral-500 mt-0.5">{notification.message}</p>
        <p className="text-xs text-neutral-400 mt-1">{new Date(notification.createdAt).toLocaleDateString("fa-IR")}</p>
      </div>
    </button>
  );
}