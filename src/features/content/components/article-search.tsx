"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { articlePath } from "@/features/content/lib/public-paths";
import {
  ARTICLE_SEARCH_DEBOUNCE_MS,
  ARTICLE_SEARCH_MIN_QUERY_LENGTH,
  ARTICLE_SEARCH_SUGGESTION_LIMIT,
  ArticleSuggestionCache,
  articleSearchSuggestionsUrl,
  type ArticleSuggestion,
} from "@/features/content/lib/article-search";
import type { PublicArticleListResponse } from "@/features/content/types";

const suggestionsByQuery = new ArticleSuggestionCache();

export function ArticleSearch({ archivePath, initialQuery = "", category, initialSuggestions = [] }: { archivePath: string; initialQuery?: string; category?: string; initialSuggestions?: ArticleSuggestion[] }) {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<ArticleSuggestion[]>(initialSuggestions);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(initialQuery.trim() && !initialSuggestions.length ? "مقاله‌ای با این عبارت پیدا نشد." : "");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const sequence = useRef(0);
  const normalizedQuery = query.trim();
  const listId = "article-search-suggestions";

  useEffect(() => {
    if (initialQuery.trim()) suggestionsByQuery.set(initialQuery.trim(), category, initialSuggestions);
  }, [category, initialQuery, initialSuggestions]);

  useEffect(() => {
    const requestId = ++sequence.current;
    if (normalizedQuery.length < ARTICLE_SEARCH_MIN_QUERY_LENGTH) return;

    const cached = suggestionsByQuery.get(normalizedQuery, category);
    if (cached) return;

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(articleSearchSuggestionsUrl(normalizedQuery, category), {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });
        if (response.status === 429) {
          throw new Error("جستجوها در فاصلهٔ کوتاه زیاد شده‌اند؛ کمی بعد دوباره تلاش کنید.");
        }
        if (!response.ok) throw new Error("پیشنهادهای مقاله فعلاً بارگذاری نشدند.");
        const result = await response.json() as PublicArticleListResponse;
        const items = result.data.slice(0, ARTICLE_SEARCH_SUGGESTION_LIMIT).map(({ id, title, slug, excerpt, category }) => ({ id, title, slug, excerpt, category }));
        if (requestId !== sequence.current) return;
        suggestionsByQuery.set(normalizedQuery, category, items);
        setSuggestions(items);
        setMessage(items.length ? "" : "مقاله‌ای با این عبارت پیدا نشد.");
        setOpen(true);
      } catch (error) {
        if (controller.signal.aborted || requestId !== sequence.current) return;
        setSuggestions([]);
        setMessage(error instanceof Error ? error.message : "پیشنهادهای مقاله فعلاً بارگذاری نشدند.");
        setOpen(true);
      } finally {
        if (requestId === sequence.current) setLoading(false);
      }
    }, ARTICLE_SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [category, normalizedQuery]);

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    } else if (event.key === "ArrowDown" && suggestions.length) {
      event.preventDefault();
      setOpen(true);
      setActiveIndex(index => (index + 1) % suggestions.length);
    } else if (event.key === "ArrowUp" && suggestions.length) {
      event.preventDefault();
      setActiveIndex(index => (index <= 0 ? suggestions.length - 1 : index - 1));
    } else if (event.key === "Enter" && activeIndex >= 0 && suggestions[activeIndex]) {
      event.preventDefault();
      window.location.assign(articlePath(suggestions[activeIndex].slug));
    }
  }

  return (
    <div className="relative w-full max-w-[420px]">
      <form action={archivePath} role="search" className="flex h-14 w-full items-center gap-[var(--md)] rounded-full border border-[var(--border-default)] bg-[var(--surface)] px-[var(--lg)]">
        <input
          name="q"
          value={query}
          onChange={event => {
            const nextQuery = event.target.value;
            const normalizedNextQuery = nextQuery.trim();
            const cached = normalizedNextQuery.length >= ARTICLE_SEARCH_MIN_QUERY_LENGTH
              ? suggestionsByQuery.get(normalizedNextQuery, category)
              : undefined;
            setQuery(nextQuery);
            setActiveIndex(-1);
            setSuggestions(cached ?? []);
            setMessage(cached ? (cached.length ? "" : "مقاله‌ای با این عبارت پیدا نشد.") : "");
            setLoading(normalizedNextQuery.length >= ARTICLE_SEARCH_MIN_QUERY_LENGTH && !cached);
            setOpen(normalizedNextQuery.length >= ARTICLE_SEARCH_MIN_QUERY_LENGTH);
          }}
          onFocus={() => { if (normalizedQuery.length >= ARTICLE_SEARCH_MIN_QUERY_LENGTH) setOpen(true); }}
          onKeyDown={handleKeyDown}
          placeholder="جستجوی مقاله"
          maxLength={120}
          autoComplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open && normalizedQuery.length >= ARTICLE_SEARCH_MIN_QUERY_LENGTH}
          aria-controls={listId}
          aria-activedescendant={activeIndex >= 0 ? `${listId}-option-${activeIndex}` : undefined}
          className="h-full min-w-0 flex-1 bg-transparent text-start text-base outline-none placeholder:text-[var(--input-placeholder)]"
        />
        <button type="submit" className="shrink-0 font-bold text-primary-700">جستجو</button>
      </form>
      {open && normalizedQuery.length >= ARTICLE_SEARCH_MIN_QUERY_LENGTH ? (
        <div className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] text-start shadow-xl" dir="rtl">
          {loading ? <p className="px-4 py-3 text-sm text-[var(--text-body)]" role="status">در حال جستجوی مقاله‌ها…</p> : null}
          {!loading && message ? <p className="px-4 py-3 text-sm text-[var(--text-body)]" role="status">{message}</p> : null}
          {!loading && suggestions.length ? (
            <ul id={listId} role="listbox" aria-label="پیشنهاد مقاله‌ها" className="max-h-80 overflow-y-auto py-1">
              {suggestions.map((article, index) => (
                <li key={article.id} id={`${listId}-option-${index}`} role="option" aria-selected={activeIndex === index}>
                  <a
                    href={articlePath(article.slug)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`block px-4 py-3 hover:bg-black/5 ${activeIndex === index ? "bg-black/5" : ""}`}
                  >
                    <span className="block font-bold text-[var(--text-title)]">{article.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
          <p className="border-t border-[var(--border-default)] px-4 py-2 text-xs text-[var(--text-body)]">برای جستجوی همهٔ مقاله‌ها، عبارت را بنویسید و «جستجو» را بزنید.</p>
        </div>
      ) : null}
    </div>
  );
}
