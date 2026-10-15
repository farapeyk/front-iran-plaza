import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { articlePath } from "@/features/content/lib/public-paths";

export const metadata: Metadata = { robots: { index: false, follow: true } };

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  permanentRedirect(articlePath(slug));
}
