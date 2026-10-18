import Image from "next/image";
import { createElement } from "react";
import { getCategoryIcon } from "@/lib/category-icons";

const fallbackIcon = "/design/icons/categories.svg";

interface CategoryIconProps {
  value?: string | null;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  legacyImageClassName?: string;
}

export function CategoryIcon({
  value,
  alt = "",
  width = 32,
  height = 32,
  className,
  legacyImageClassName,
}: CategoryIconProps) {
  const Icon = getCategoryIcon(value);

  if (Icon) {
    return createElement(Icon, { "aria-hidden": alt ? undefined : true, className });
  }

  const source = value?.startsWith("/design/icons/") ? value : fallbackIcon;
  const imageClassName = [className, legacyImageClassName].filter(Boolean).join(" ");
  return <Image alt={alt} className={imageClassName} height={height} src={source} width={width} />;
}
