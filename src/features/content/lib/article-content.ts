import type { ArticleBlock } from "@/features/content/types";

export const ARTICLE_EXCERPT_MAX_LENGTH = 5_000;

export type CompactPaginationItem = number | "ellipsis-start" | "ellipsis-end";

const LEGACY_TOC_HEADING = /^(?:در\s+این\s+مطلب\s+می\s*خوانیم|آنچه\s+در\s+این\s+مقاله\s+می\s*خوانید)\s*:?\s*$/u;
const LEGACY_RATING = /^[0-9۰-۹](?:[.,][0-9۰-۹])?\s*\/\s*[5۵]\s*-?\s*\([0-9۰-۹]+\s*امتیاز\)$/u;
const READ_MORE_SUFFIX = /\s*(?:(?:…|\.{3})\s*)?ادامه\s*مطلب\s*$/u;

function normalizedText(value: string | undefined): string {
  return (value ?? "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * Hides widgets that the WordPress importer used to flatten into leading text
 * blocks. The native article page renders both controls itself.
 */
export function withoutLegacyArticleWidgets(blocks: ArticleBlock[]): ArticleBlock[] {
  const firstHeading = blocks.findIndex(block => block.type === "heading");
  const prefixEnd = firstHeading === -1 ? blocks.length : firstHeading;
  const headings = blocks
    .filter(block => block.type === "heading")
    .map(block => normalizedText(block.text))
    .filter(Boolean);

  return blocks.filter((block, index) => {
    if (index >= prefixEnd || block.type !== "paragraph") return true;
    const text = normalizedText(block.text);
    if (!text) return true;
    if (LEGACY_TOC_HEADING.test(text) || /^toggle$/iu.test(text) || LEGACY_RATING.test(text)) return false;

    let referencedHeadings = 0;
    for (const heading of headings) {
      if (heading.length >= 5 && text.includes(heading)) referencedHeadings += 1;
      if (referencedHeadings >= 2) return false;
    }
    return true;
  });
}

/**
 * Older imports stored WordPress' generated "… ادامه مطلب" snippet as the
 * excerpt. Until those records are synced again, recover the complete leading
 * introduction from the structured article blocks.
 */
export function displayArticleExcerpt(excerpt: string, blocks: ArticleBlock[]): string {
  const normalized = excerpt.replace(/\u00a0/g, " ").trim();
  const wasTruncated = READ_MORE_SUFFIX.test(normalized);
  const cleaned = normalized.replace(READ_MORE_SUFFIX, "").replace(/(?:…|\.{3})\s*$/u, "").trim();
  if (!wasTruncated) return normalized;

  const introduction: string[] = [];
  for (const block of blocks) {
    if (block.type !== "paragraph") break;
    const text = block.text?.trim();
    if (text) introduction.push(text);
  }
  const complete = introduction.join("\n\n").trim();
  const result = complete.length > cleaned.length ? complete : cleaned;
  return result.slice(0, ARTICLE_EXCERPT_MAX_LENGTH);
}

/**
 * Keeps long article archives usable on narrow screens without rendering a
 * link for every page. The first, last and nearby pages always stay visible.
 */
export function compactPaginationItems(currentPage: number, totalPages: number): CompactPaginationItem[] {
  const total = Number.isFinite(totalPages) ? Math.max(1, Math.trunc(totalPages)) : 1;
  const requestedPage = Number.isFinite(currentPage) ? Math.trunc(currentPage) : 1;
  const current = Math.min(total, Math.max(1, requestedPage));

  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "ellipsis-end", total];
  if (current >= total - 3) return [1, "ellipsis-start", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "ellipsis-start", current - 1, current, current + 1, "ellipsis-end", total];
}
