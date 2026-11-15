import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { backendGet, BackendError } from "@/lib/api/backend-get";

type Profile = { slug: string; displayName: string; bio: string; articles: { title: string; slug: string; excerpt: string; publishedAt: string | null }[] };

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const profile = await backendGet<Profile>(`/api/articles/authors/${encodeURIComponent(slug)}`);
    return { title: `${profile.displayName} | نویسندگان ایران پلازا`, description: profile.bio, alternates: { canonical: `/authors/${encodeURIComponent(profile.slug)}/` } };
  } catch (error) { if (error instanceof BackendError && error.status === 404) return { title: "نویسنده پیدا نشد", robots: { index: false } }; throw error; }
}

export default async function AuthorProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let profile: Profile;
  try { profile = await backendGet<Profile>(`/api/articles/authors/${encodeURIComponent(slug)}`); }
  catch (error) { if (error instanceof BackendError && error.status === 404) notFound(); throw error; }
  return <main dir="rtl" className="mx-auto min-h-[60vh] max-w-4xl px-5 py-16"><p className="text-sm font-bold text-emerald-800">تحریریه ایران پلازا</p><h1 className="mt-3 text-3xl font-black">{profile.displayName}</h1><p className="mt-5 max-w-2xl whitespace-pre-line leading-8 text-neutral-700">{profile.bio}</p><section className="mt-12"><h2 className="text-xl font-black">آخرین مقاله‌ها</h2>{profile.articles.length ? <ul className="mt-5 space-y-4">{profile.articles.map(article => <li key={article.slug} className="rounded-xl border p-5"><Link className="text-lg font-bold text-emerald-900 hover:underline" href={`/${encodeURIComponent(article.slug)}/`}>{article.title}</Link><p className="mt-2 text-sm leading-7 text-neutral-600">{article.excerpt}</p></li>)}</ul> : <p className="mt-4 text-neutral-500">هنوز مقاله‌ای منتشر نشده است.</p>}</section></main>;
}
