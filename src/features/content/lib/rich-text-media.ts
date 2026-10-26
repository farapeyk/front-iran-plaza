const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
  "youtu.be",
  "www.youtu.be",
]);

export function normalizeRichTextImageSrc(value: string, origin: string): string | null {
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 500) return null;
  try {
    const url = new URL(trimmed, origin);
    if (!["http:", "https:"].includes(url.protocol)) return null;
    return url.toString();
  } catch { return null; }
}

export function normalizeRichTextYoutubeSrc(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 500) return null;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:" || !YOUTUBE_HOSTS.has(url.hostname.toLocaleLowerCase("en-US"))) return null;
    return url.toString();
  } catch { return null; }
}

export function getRichTextYoutubeEmbedSrc(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const normalized = normalizeRichTextYoutubeSrc(value);
  if (!normalized) return null;
  const url = new URL(normalized);
  let id = "";
  if (url.hostname.endsWith("youtu.be")) id = url.pathname.split("/").filter(Boolean)[0] ?? "";
  else if (url.pathname === "/watch") id = url.searchParams.get("v") ?? "";
  else if (url.pathname.startsWith("/embed/") || url.pathname.startsWith("/shorts/")) id = url.pathname.split("/")[2] ?? "";
  if (!/^[A-Za-z0-9_-]{6,20}$/.test(id)) return null;
  return `https://www.youtube-nocookie.com/embed/${id}`;
}
