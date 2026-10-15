import { ArticleEditorForm } from "@/features/content/components/article-editor-form";
import type { ContentCategory, ContentIdentity } from "@/features/content/types";
import { backendGet } from "@/lib/api/backend-get";
import { getAccessTokenCookie } from "@/lib/auth/cookies";

export default async function NewArticlePage() {
  const token = await getAccessTokenCookie();
  const [categories, identity] = await Promise.all([
    backendGet<ContentCategory[]>("/api/content/categories", token as string),
    backendGet<ContentIdentity>("/api/content/me", token as string),
  ]);
  return <ArticleEditorForm categories={categories} canPublish={identity.canPublish} />;
}
