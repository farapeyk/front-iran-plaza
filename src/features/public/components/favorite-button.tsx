"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { toggleFavoriteAction } from "@/features/public/actions/favorite.action";

export function FavoriteButton({ businessId, initialFavorited }: { businessId: string; initialFavorited: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [favorited, setFavorited] = useState(initialFavorited);

  function handleClick() {
    startTransition(async () => {
      const result = await toggleFavoriteAction(businessId);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      setFavorited(result.favorited);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      aria-label={favorited ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
      className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center shrink-0 disabled:opacity-50"
    >
      <Heart size={18} className={favorited ? "fill-red-500 text-red-500" : "text-neutral-400"} />
    </button>
  );
}