import { ContentMediaLibrary } from "@/features/content/components/content-media-library";
import type { ContentIdentity, ContentMediaResponse } from "@/features/content/types";
import { backendGet } from "@/lib/api/backend-get";
import { getAccessTokenCookie } from "@/lib/auth/cookies";

export default async function ContentMediaPage() {
  const token = await getAccessTokenCookie();
  const [result, identity] = await Promise.all([
    backendGet<ContentMediaResponse>("/api/content/media?page=1&limit=60", token as string),
    backendGet<ContentIdentity>("/api/content/me", token as string),
  ]);
  return <ContentMediaLibrary items={result.data} currentUserId={identity.id} />;
}
