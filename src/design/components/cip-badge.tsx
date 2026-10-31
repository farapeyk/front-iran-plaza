import { cn } from "@/design/lib/utils";

export function CipBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-7 shrink-0 items-center justify-center rounded-md bg-black px-2.5 text-xs font-black uppercase tracking-[0.08em] text-[#d4af37]",
        className,
      )}
    >
      CIP
    </span>
  );
}
