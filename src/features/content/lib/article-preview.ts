import type { ContentIdentity, EditorArticle, PublicArticle } from "@/features/content/types";

export function editorArticleToPreview(article: EditorArticle): PublicArticle {
  return {
    ...article,
    status: "PUBLISHED",
    publishedAt: article.publishedAt ?? article.updatedAt,
    rating: null,
    ratingCount: 0,
    feedback: [],
    banners: [],
  };
}

export function canEditPublicArticle(identity: ContentIdentity | null, authorId: string): boolean {
  return Boolean(identity && (identity.canPublish || identity.id === authorId));
}
