"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteArticleAction } from "@/features/content/actions/content.action";

export function ArticleDeleteButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function remove() {
    if (!window.confirm(`مقالهٔ «${title}» برای همیشه حذف شود؟`)) return;
    setError("");
    startTransition(async () => {
      const result = await deleteArticleAction(id);
      if (result.success) router.refresh();
      else setError(result.message);
    });
  }

  return <span className="inline-flex flex-col items-end gap-1">
    <button type="button" disabled={pending} onClick={remove} className="inline-flex items-center gap-1 rounded-xl border border-red-200 px-3 py-2 font-bold text-red-700 disabled:opacity-50">
      <Trash2 className="size-4" />{pending ? "در حال حذف…" : "حذف کامل"}
    </button>
    {error ? <span role="alert" className="max-w-48 text-xs text-red-700">{error}</span> : null}
  </span>;
}
