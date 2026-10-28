export const MAX_EDITORIAL_TAGS = 20;

function comparableTag(tag: string): string {
  return tag.toLocaleLowerCase("fa");
}

export function appendEditorialTag(tags: string[], draft: string): string[] {
  const normalized = draft.trim().replace(/^#+/u, "").slice(0, 60);
  if (!normalized || tags.length >= MAX_EDITORIAL_TAGS) return tags;
  if (tags.some(tag => comparableTag(tag) === comparableTag(normalized))) return tags;
  return [...tags, normalized];
}

export function shouldCommitEditorialTag(key: string, isComposing: boolean): boolean {
  return key === "Enter" && !isComposing;
}
