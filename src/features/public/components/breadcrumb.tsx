import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { CategorySummary } from "@/features/public/types/public-business";

function buildChain(categories: CategorySummary[], selectedId?: string): CategorySummary[] {
  if (!selectedId) return [];
  const byId = new Map(categories.map((c) => [c.id, c]));
  const chain: CategorySummary[] = [];
  let current = byId.get(selectedId);
  while (current) {
    chain.unshift(current);
    current = current.parentId ? byId.get(current.parentId) : undefined;
  }
  return chain;
}

export function Breadcrumb({ categories, selectedCategoryId, currentLabel }: { categories: CategorySummary[]; selectedCategoryId?: string; currentLabel: string }) {
  const chain = buildChain(categories, selectedCategoryId);

  return (
    <div className="flex items-center gap-1.5 text-xs text-neutral-500 flex-wrap" dir="rtl">
      <Link href="/" className="hover:text-emerald-800">
        خانه
      </Link>
      {chain.map((c) => (
        <span key={c.id} className="flex items-center gap-1.5">
          <ChevronLeft size={12} />
          <Link href={`/businesses?categoryId=${c.id}`} className="hover:text-emerald-800">
            {c.name}
          </Link>
        </span>
      ))}
      <span className="flex items-center gap-1.5">
        <ChevronLeft size={12} />
        <span className="text-neutral-700">{currentLabel}</span>
      </span>
    </div>
  );
}