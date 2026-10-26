export function normalizeRichTextLinkHref(value: string, origin: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  try {
    const candidate = trimmed.startsWith("/") || trimmed.startsWith("#")
      ? new URL(trimmed, origin)
      : new URL(/^[a-z][a-z\d+.-]*:/iu.test(trimmed) ? trimmed : `https://${trimmed}`);
    return candidate.protocol === "http:" || candidate.protocol === "https:" ? candidate.toString() : null;
  } catch {
    return null;
  }
}
