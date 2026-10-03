"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { toggleTrackingAction } from "@/features/admin/actions/settings.action";
import { Loader2 } from "lucide-react";

export function TrackingToggle({ initialEnabled }: { initialEnabled: boolean }) {
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      const result = await toggleTrackingAction(!initialEnabled);
      if (!result.success) {
        toast.error(result.message);
      } else {
        toast.success(`سیستم رهگیری ${!initialEnabled ? "فعال" : "غیرفعال"} شد.`);
      }
    });
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`relative inline-flex items-center h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
        initialEnabled ? "bg-emerald-600" : "bg-neutral-200"
      } disabled:opacity-50`}
    >
      {isPending ? (
        <Loader2 className="size-4 animate-spin text-white absolute right-1" />
      ) : (
        <span
          className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            initialEnabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      )}
    </button>
  );
}