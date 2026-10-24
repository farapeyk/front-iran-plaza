import { notFound } from "next/navigation";
import { ArticleEditorForm } from "@/features/content/components/article-editor-form";
import type { ArticleRevision, ContentCategory, ContentIdentity, EditorArticle } from "@/features/content/types";
import { BackendError, backendGet } from "@/lib/api/backend-get";
import { getAccessTokenCookie } from "@/lib/auth/cookies";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = await getAccessTokenCookie();
  let data: [EditorArticle, ContentCategory[], ContentIdentity, ArticleRevision[]];
  try {
    data = await Promise.all([
      backendGet<EditorArticle>(`/api/content/articles/${encodeURIComponent(id)}`, token as string),
      backendGet<ContentCategory[]>("/api/content/categories", token as string),
      backendGet<ContentIdentity>("/api/content/me", token as string),
      backendGet<ArticleRevision[]>(`/api/content/articles/${encodeURIComponent(id)}/revisions`, token as string),
    ]);
  } catch (error) {
    if (error instanceof BackendError && error.status === 404) notFound();
    throw error;
  }
  const [article, categories, identity, revisions] = data;
  return <ArticleEditorForm article={article} categories={categories} canPublish={identity.canPublish} revisions={revisions} />;
}
