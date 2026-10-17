const SEARCH_HISTORY_KEY = "iran-plaza:search-history"
const MAX_SEARCH_HISTORY_ITEMS = 6

type SearchHistoryItem = {
  label: string
  subtitle: string
  icon: string
  href: string
}

type ReadableStorage = Pick<Storage, "getItem">
type WritableStorage = Pick<Storage, "getItem" | "setItem">

function isSearchHistoryItem(value: unknown): value is SearchHistoryItem {
  if (!value || typeof value !== "object") return false
  const item = value as Record<string, unknown>
  return (
    typeof item.label === "string" &&
    item.label.trim().length > 0 &&
    item.label.length <= 80 &&
    typeof item.subtitle === "string" &&
    item.subtitle.length <= 120 &&
    typeof item.icon === "string" &&
    item.icon.startsWith("/design/icons/") &&
    typeof item.href === "string" &&
    item.href.startsWith("/businesses?")
  )
}

function readSearchHistory(storage: ReadableStorage): SearchHistoryItem[] {
  try {
    const parsed: unknown = JSON.parse(storage.getItem(SEARCH_HISTORY_KEY) ?? "[]")
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isSearchHistoryItem).slice(0, MAX_SEARCH_HISTORY_ITEMS)
  } catch {
    return []
  }
}

function prependSearchHistory(storage: WritableStorage, item: SearchHistoryItem) {
  if (!isSearchHistoryItem(item)) return []
  const normalized = { ...item, label: item.label.trim() }
  const next = [
    normalized,
    ...readSearchHistory(storage).filter(
      (entry) => entry.href !== normalized.href && entry.label !== normalized.label
    ),
  ].slice(0, MAX_SEARCH_HISTORY_ITEMS)
  storage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(next))
  return next
}

export { prependSearchHistory, readSearchHistory, SEARCH_HISTORY_KEY }
export type { SearchHistoryItem }
