import { ChevronLeft, type LucideIcon } from "lucide-react";
import Link from "next/link";

interface DashboardMenuItemProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  href?: string;
  disabled?: boolean;
  tone?: "default" | "danger";
}

export function DashboardMenuItem({
  title,
  subtitle,
  icon: Icon,
  href,
  disabled,
  tone = "default",
}: DashboardMenuItemProps) {
  const isDanger = tone === "danger";

  const content = (
    <div
      className={[
        "flex items-center gap-4 px-4 py-4 transition-colors",
        disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-neutral-50",
      ].join(" ")}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDanger ? "bg-red-50" : "bg-[#0F6B62]/5"}`}>
        <Icon className={isDanger ? "text-red-500" : "text-[#0F6B62]"} size={20} />
      </div>

      <div className="flex-1 text-right">
        <p className={`font-bold text-sm ${isDanger ? "text-red-600" : "text-neutral-800"}`}>{title}</p>
        <p className="text-xs text-neutral-500 mt-0.5">{subtitle}</p>
      </div>

      {!disabled && <ChevronLeft className="text-neutral-300" size={20} />}
    </div>
  );

  if (disabled || !href) {
    return <div>{content}</div>;
  }

  return <Link href={href} className="block border-b border-neutral-100 last:border-0">{content}</Link>;
}