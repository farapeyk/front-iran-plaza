import { notFound } from "next/navigation";
import { ArticleEditorForm } from "@/features/content/components/article-editor-form";
import type { ContentCategory, ContentIdentity, EditorArticle } from "@/features/content/types";
import { BackendError, backendGet } from "@/lib/api/backend-get";
import { getAccessTokenCookie } from "@/lib/auth/cookies";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = await getAccessTokenCookie();
  let data: [EditorArticle, ContentCategory[], ContentIdentity];
  try {
    data = await Promise.all([
      backendGet<EditorArticle>(`/api/content/articles/${encodeURIComponent(id)}`, token as string),
      backendGet<ContentCategory[]>("/api/content/categories", token as string),
      backendGet<ContentIdentity>("/api/content/me", token as string),
    ]);
  } catch (error) {
    if (error instanceof BackendError && error.status === 404) notFound();
    throw error;
  }
  const [article, categories, identity] = data;
  return <ArticleEditorForm article={article} categories={categories} canPublish={identity.canPublish} />;
}
