import type { RichTextNode } from "@/features/content/types";

export function normalizeRichTextLinkHref(value: string, origin: string): string | null {
  const trimmed = value.replace(/[\u200e\u200f\u202a-\u202e\u2066-\u2069]/gu, "").trim();
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

const supportedNodeTypes = new Set([
  "doc", "paragraph", "heading", "bulletList", "orderedList", "listItem",
  "blockquote", "codeBlock", "hardBreak", "horizontalRule", "image", "youtube",
  "table", "tableRow", "tableHeader", "tableCell", "rawHtml", "text",
]);

const supportedMarkTypes = new Set(["bold", "italic", "underline", "strike", "code", "link", "textStyle"]);
const supportedFontFamilies = new Set(["IRANSansX", "sans-serif", "serif", "monospace"]);
const supportedFontSizes = new Set(["14px", "16px", "18px", "20px", "24px", "30px"]);

function plainObject(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function canonicalMarks(marks: RichTextNode["marks"], origin: string): NonNullable<RichTextNode["marks"]> {
  if (!Array.isArray(marks)) return [];
  return marks.flatMap(mark => {
    if (!mark || !supportedMarkTypes.has(mark.type)) return [];
    if (mark.type === "link") {
      const href = normalizeRichTextLinkHref(String(plainObject(mark.attrs).href ?? ""), origin);
      return href ? [{ type: "link", attrs: { href } }] : [];
    }
    if (mark.type === "textStyle") {
      const attrs = plainObject(mark.attrs);
      const normalized: Record<string, unknown> = {};
      if (typeof attrs.color === "string" && /^#[0-9a-f]{6}$/iu.test(attrs.color)) normalized.color = attrs.color;
      if (typeof attrs.fontFamily === "string" && supportedFontFamilies.has(attrs.fontFamily)) normalized.fontFamily = attrs.fontFamily;
      if (typeof attrs.fontSize === "string" && supportedFontSizes.has(attrs.fontSize)) normalized.fontSize = attrs.fontSize;
      return Object.keys(normalized).length ? [{ type: "textStyle", attrs: normalized }] : [];
    }
    return [{ type: mark.type }];
  });
}

function canonicalNode(value: RichTextNode, origin: string, isRoot = false): RichTextNode | null {
  if (!value || !supportedNodeTypes.has(value.type) || (isRoot ? value.type !== "doc" : value.type === "doc")) return null;
  if (value.type === "text") {
    if (typeof value.text !== "string") return null;
    const marks = canonicalMarks(value.marks, origin);
    return { type: "text", text: value.text, ...(marks.length ? { marks } : {}) };
  }

  if (value.type === "rawHtml") {
    const html = plainObject(value.attrs).html;
    return typeof html === "string" && html.trim() && html.length <= 50_000
      ? { type: "rawHtml", attrs: { html } }
      : null;
  }

  const node: RichTextNode = { type: value.type };
  const attrs = plainObject(value.attrs);
  const textAlign = ["right", "center", "left"].includes(String(attrs.textAlign)) ? attrs.textAlign : undefined;
  if (value.type === "heading") {
    const level = attrs.level === 3 || attrs.level === 4 ? attrs.level : 2;
    node.attrs = { level, ...(textAlign ? { textAlign } : {}) };
  } else if (value.type === "paragraph" && textAlign) {
    node.attrs = { textAlign };
  } else if (value.type === "orderedList") {
    const start = typeof attrs.start === "number" && Number.isInteger(attrs.start) && attrs.start > 0 ? attrs.start : 1;
    node.attrs = { start };
  } else if (value.type === "image") {
    const src = normalizeRichTextLinkHref(String(attrs.src ?? ""), origin);
    if (!src) return null;
    node.attrs = {
      src,
      ...(typeof attrs.alt === "string" ? { alt: attrs.alt.slice(0, 160) } : {}),
      ...(typeof attrs.title === "string" ? { title: attrs.title.slice(0, 160) } : {}),
    };
  } else if (value.type === "youtube") {
    const src = normalizeRichTextLinkHref(String(attrs.src ?? ""), origin);
    if (!src) return null;
    node.attrs = {
      src,
      width: typeof attrs.width === "number" ? attrs.width : 640,
      height: typeof attrs.height === "number" ? attrs.height : 360,
    };
  } else if (value.type === "tableHeader" || value.type === "tableCell") {
    const span = (input: unknown) => typeof input === "number" && Number.isInteger(input) && input > 0 ? input : 1;
    node.attrs = { colspan: span(attrs.colspan), rowspan: span(attrs.rowspan) };
  }

  if (Array.isArray(value.content)) {
    node.content = value.content.flatMap(child => {
      const normalized = canonicalNode(child, origin);
      return normalized ? [normalized] : [];
    });
  }
  return node;
}

export function canonicalizeRichTextDocument(value: RichTextNode, origin: string): RichTextNode {
  return canonicalNode(value, origin, true) ?? { type: "doc", content: [{ type: "paragraph" }] };
}
