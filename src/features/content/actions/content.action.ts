"use server";

import { revalidatePath } from "next/cache";
import { authedFetch } from "@/features/business/actions/authed-fetch";
import { normalizeCanonicalUrl } from "@/features/content/lib/canonical-url";
import { articlePath } from "@/features/content/lib/public-paths";
import { backendGet, BackendError } from "@/lib/api/backend-get";
import { getActionAccessToken } from "@/lib/auth/action-access-token";
import type { ArticleBanner, ArticleBlock, ArticleFaq, ArticleListResponse, ArticleSchemaType, ContentIdentity, EditorArticle } from "@/features/content/types";

export async function searchBannerArticlesAction(search: string, page = 1) {
  const token = await getActionAccessToken();
  if (!token) return { success: false as const, message: "نشست شما منقضی شده، دوباره وارد شوید." };
  const query = new URLSearchParams({ limit: "50", page: String(Math.max(1, Math.min(Math.trunc(page) || 1, 100000))), title: search.trim().slice(0, 120) });
  try {
    const identity = await backendGet<ContentIdentity>("/api/content/me", token);
    if (!identity.canPublish) return { success: false as const, message: "دسترسی لازم برای مدیریت بنرها را ندارید." };
    const data = await backendGet<ArticleListResponse>(`/api/content/articles?${query.toString()}`, token);
    return { success: true as const, data };
  } catch (error) {
    const status = error instanceof BackendError ? error.status : 0;
    return { success: false as const, message: status === 401 ? "نشست شما منقضی شده، دوباره وارد شوید." : "جستجوی مقاله‌ها انجام نشد. دوباره تلاش کنید." };
  }
}

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

export async function deleteArticleAction(id: string) {
  const result = await authedFetch<{ id: string; deleted: true }>(`/api/content/articles/${encodeURIComponent(id)}`, "DELETE");
  if (result.success) revalidatePath("/content");
  return result;
}

export async function deleteContentMediaAction(id: string) {
  const result = await authedFetch<{ message: string }>(`/api/files/${encodeURIComponent(id)}`, "DELETE");
  if (result.success) revalidatePath("/content/media");
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
  displayMode?: "FULL" | "MATCH_FEATURED";
  showOnAllArticles?: boolean;
  articleIds?: string[];
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
