export const ARTICLE_SEARCH_MIN_QUERY_LENGTH = 2;
export const ARTICLE_SEARCH_DEBOUNCE_MS = 400;
export const ARTICLE_SEARCH_SUGGESTION_LIMIT = 5;
const ARTICLE_SEARCH_CACHE_LIMIT = 100;

export type ArticleSuggestion = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: { name: string; slug: string } | null;
};

export function articleSearchQueryKey(query: string, category?: string) {
  return `${category ?? ""}\u0000${query.trim()}`;
}

export function articleSearchSuggestionsUrl(query: string, category?: string) {
  const params = new URLSearchParams({
    search: query.trim(),
    page: "1",
    limit: String(ARTICLE_SEARCH_SUGGESTION_LIMIT),
  });
  if (category) params.set("category", category);
  return `/api/backend/articles?${params.toString()}`;
}

export class ArticleSuggestionCache {
  private readonly entries = new Map<string, ArticleSuggestion[]>();

  get(query: string, category?: string) {
    const key = articleSearchQueryKey(query, category);
    const items = this.entries.get(key);
    if (!items) return undefined;
    this.entries.delete(key);
    this.entries.set(key, items);
    return items;
  }

  set(query: string, category: string | undefined, items: ArticleSuggestion[]) {
    const key = articleSearchQueryKey(query, category);
    this.entries.delete(key);
    this.entries.set(key, items);
    if (this.entries.size > ARTICLE_SEARCH_CACHE_LIMIT) {
      const oldestKey = this.entries.keys().next().value;
      if (oldestKey) this.entries.delete(oldestKey);
    }
  }
}
