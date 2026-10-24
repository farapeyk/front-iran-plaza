import type { ArticleBlock, ArticleSchemaType } from "@/features/content/types";

export type SeoAuditInput = {
  title: string;
  slug: string;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  primaryKeyword: string;
  coverImageAlt: string;
  robotsIndex: boolean;
  schemaType: ArticleSchemaType;
  blocks: ArticleBlock[];
};

export type SeoAuditCheck = { label: string; passed: boolean; weight: number };

function includesKeyword(value: string, keyword: string) {
  return keyword.length > 1 && value.toLocaleLowerCase("fa").includes(keyword.toLocaleLowerCase("fa"));
}

export function auditArticleSeo(input: SeoAuditInput) {
  const effectiveTitle = input.seoTitle.trim() || input.title.trim();
  const effectiveDescription = input.seoDescription.trim() || input.excerpt.trim();
  const firstText = input.blocks.find(block => block.type === "paragraph")?.text || "";
  const hasListingSource = input.blocks.some(block =>
    (block.type === "business-list" && Boolean(block.businessIds?.length))
    || (block.type === "table" && Boolean(block.table?.rows.length))
    || (block.type === "heading" && Boolean(block.text?.trim())),
  );
  const checks: SeoAuditCheck[] = [
    { label: "عنوان سئو بین ۳۰ تا ۶۰ نویسه است", passed: effectiveTitle.length >= 30 && effectiveTitle.length <= 60, weight: 14 },
    { label: "توضیحات متا بین ۱۲۰ تا ۱۶۰ نویسه است", passed: effectiveDescription.length >= 120 && effectiveDescription.length <= 160, weight: 14 },
    { label: "نشانی کوتاه و خوانا است", passed: input.slug.length >= 3 && input.slug.length <= 75, weight: 10 },
    { label: "تصویر شاخص متن جایگزین دارد", passed: input.coverImageAlt.trim().length >= 5, weight: 10 },
    { label: "صفحه اجازه ایندکس دارد", passed: input.robotsIndex, weight: 8 },
    { label: "کلیدواژه کانونی تعیین شده است", passed: input.primaryKeyword.trim().length >= 2, weight: 8 },
    { label: "کلیدواژه در عنوان دیده می‌شود", passed: includesKeyword(effectiveTitle, input.primaryKeyword), weight: 12 },
    { label: "کلیدواژه در توضیحات دیده می‌شود", passed: includesKeyword(effectiveDescription, input.primaryKeyword), weight: 10 },
    { label: "کلیدواژه در ابتدای متن دیده می‌شود", passed: includesKeyword(firstText, input.primaryKeyword), weight: 6 },
    { label: "منبع واقعی برای ItemList وجود دارد", passed: input.schemaType === "ARTICLE" || hasListingSource, weight: 8 },
  ];
  const maximum = checks.reduce((sum, check) => sum + check.weight, 0);
  const earned = checks.filter(check => check.passed).reduce((sum, check) => sum + check.weight, 0);
  return { score: Math.round((earned / maximum) * 100), checks };
}
