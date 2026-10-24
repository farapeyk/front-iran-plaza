"use server";

import { revalidatePath } from "next/cache";
import { authedFetch } from "@/features/business/actions/authed-fetch";
import { normalizeCanonicalUrl } from "@/features/content/lib/canonical-url";
import { articlePath } from "@/features/content/lib/public-paths";
import type { ArticleBanner, ArticleBlock, ArticleFaq, ArticleSchemaType, EditorArticle } from "@/features/content/types";

export type ArticleInput = {
  title: string;
  slug: string;
  excerpt: string;
  tags?: string[];
  keyTakeaways?: string[];
  primaryKeyword?: string;
  schemaType?: ArticleSchemaType;
  isFeatured?: boolean;
  featuredOrder?: number;
  bodyBlocks: ArticleBlock[];
  categoryId?: string;
  coverImageId?: string;
  coverImageAlt?: string;
  faqs?: ArticleFaq[];
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  robotsIndex?: boolean;
  robotsFollow?: boolean;
  showBanners?: boolean;
  expectedRevision?: number;
  changeNote?: string;
};

function prepareArticleInput<T extends ArticleInput>(input: T): T | null {
  const canonicalUrl = normalizeCanonicalUrl(input.canonicalUrl);
  return canonicalUrl === null ? null : { ...input, canonicalUrl };
}

export async function createArticleAction(input: ArticleInput) {
  const prepared = prepareArticleInput(input);
  if (!prepared) return { success: false as const, message: "آدرس Canonical معتبر نیست؛ دامنه کامل یا آدرس دارای http/https وارد کنید." };
  const result = await authedFetch<EditorArticle>("/api/content/articles", "POST", prepared);
  if (result.success) revalidatePath("/content");
  return result;
}

export async function updateArticleAction(id: string, input: ArticleInput & { expectedRevision: number }) {
  const prepared = prepareArticleInput(input);
  if (!prepared) return { success: false as const, message: "آدرس Canonical معتبر نیست؛ دامنه کامل یا آدرس دارای http/https وارد کنید." };
  const result = await authedFetch<EditorArticle>(`/api/content/articles/${encodeURIComponent(id)}`, "PATCH", prepared);
  if (result.success) {
    revalidatePath("/content");
    revalidatePath(`/content/articles/${id}`);
    revalidatePath(articlePath(result.data.slug));
  }
  return result;
}

export async function articleWorkflowAction(
  id: string,
  action: "submit" | "approve" | "request-changes" | "publish" | "unpublish" | "archive",
  note?: string,
) {
  const result = await authedFetch<{ id: string; status: string; slug?: string }>(
    `/api/content/articles/${encodeURIComponent(id)}/${action}`,
    "POST",
    action === "approve" || action === "request-changes" ? { note } : undefined,
  );
  if (result.success) {
    revalidatePath("/content");
    revalidatePath(`/content/articles/${id}`);
    revalidatePath("/articles/");
  }
  return result;
}

export async function createContentCategoryAction(input: { name: string; slug: string; description?: string; parentId?: string; sortOrder?: number }) {
  const result = await authedFetch("/api/content/categories", "POST", input);
  if (result.success) revalidatePath("/content/categories");
  return result;
}

export async function updateContentCategoryAction(id: string, input: { name?: string; slug?: string; description?: string; parentId?: string; sortOrder?: number; isActive?: boolean }) {
  const result = await authedFetch(`/api/content/categories/${encodeURIComponent(id)}`, "PATCH", input);
  if (result.success) revalidatePath("/content/categories");
  return result;
}

export async function moderateArticleFeedbackAction(id: string, status: "APPROVED" | "REJECTED") {
  const result = await authedFetch(`/api/content/feedback/${encodeURIComponent(id)}`, "PATCH", { status });
  if (result.success) revalidatePath("/content/feedback");
  return result;
}

export type ArticleBannerInput = {
  title: string;
  imageId: string;
  altText: string;
  targetUrl: string;
  placement: "TOP" | "SIDEBAR";
  isActive?: boolean;
  startsAt?: string | null;
  endsAt?: string | null;
  sortOrder?: number;
};

export async function createArticleBannerAction(input: ArticleBannerInput) {
  const result = await authedFetch<ArticleBanner>("/api/content/banners", "POST", input);
  if (result.success) revalidatePath("/content/banners");
  return result;
}

export async function updateArticleBannerAction(id: string, input: Partial<ArticleBannerInput>) {
  const result = await authedFetch<ArticleBanner>(`/api/content/banners/${encodeURIComponent(id)}`, "PATCH", input);
  if (result.success) {
    revalidatePath("/content/banners");
    revalidatePath("/articles/");
  }
  return result;
}

export async function deleteArticleBannerAction(id: string) {
  const result = await authedFetch<{ id: string; deleted: true }>(`/api/content/banners/${encodeURIComponent(id)}`, "DELETE");
  if (result.success) {
    revalidatePath("/content/banners");
    revalidatePath("/articles/");
  }
  return result;
}

export async function assignContentAuthorAction(input: { phone: string; fullName: string; email?: string }) {
  const result = await authedFetch("/api/admin/content/authors", "POST", input);
  if (result.success) revalidatePath("/admin/content/authors");
  return result;
}

export async function revokeContentAuthorAction(userId: string) {
  const result = await authedFetch(`/api/admin/content/authors/${encodeURIComponent(userId)}`, "DELETE");
  if (result.success) revalidatePath("/admin/content/authors");
  return result;
}
