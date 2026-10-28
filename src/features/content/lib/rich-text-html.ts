import type { RichTextNode } from "@/features/content/types";

export const MAX_RICH_TEXT_HTML_LENGTH = 50_000;

export function customHtmlFromDocument(document: RichTextNode): string | null {
  if (document.type !== "doc" || document.content?.length !== 1) return null;
  const node = document.content[0];
  const html = node.type === "rawHtml" ? node.attrs?.html : null;
  return typeof html === "string" ? html : null;
}

export function customHtmlDocument(html: string): RichTextNode {
  return { type: "doc", content: [{ type: "rawHtml", attrs: { html } }] };
}

function comparableHtml(html: string): string {
  return html.replace(/\r\n?/gu, "\n").trim();
}

export function hasCustomHtmlChanged(draft: string, snapshot: string): boolean {
  return comparableHtml(draft) !== comparableHtml(snapshot);
}

export function plainTextFromCustomHtml(html: string): string {
  if (typeof DOMParser === "undefined") return "";
  const parsed = new DOMParser().parseFromString(html, "text/html");
  parsed.querySelectorAll("script, style, noscript, template").forEach(element => element.remove());
  return (parsed.body.textContent || "").replace(/\s+/gu, " ").trim();
}
