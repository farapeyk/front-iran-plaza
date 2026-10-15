import type { CSSProperties, ReactNode } from "react";
import type { RichTextNode } from "@/features/content/types";

const fonts = new Set(["IRANSansX", "sans-serif", "serif", "monospace"]);
const sizes = new Set(["14px", "16px", "18px", "20px", "24px", "30px"]);

function safeHref(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.toString() : null;
  } catch { return null; }
}

function renderNode(node: RichTextNode, key: string): ReactNode {
  if (node.type === "text") {
    let child: ReactNode = node.text || "";
    for (const [index, mark] of (node.marks || []).entries()) {
      const markKey = `${key}-mark-${index}`;
      if (mark.type === "bold") child = <strong key={markKey}>{child}</strong>;
      else if (mark.type === "italic") child = <em key={markKey}>{child}</em>;
      else if (mark.type === "underline") child = <u key={markKey}>{child}</u>;
      else if (mark.type === "strike") child = <s key={markKey}>{child}</s>;
      else if (mark.type === "code") child = <code key={markKey} className="rounded bg-neutral-100 px-1">{child}</code>;
      else if (mark.type === "link") {
        const href = safeHref(mark.attrs?.href);
        if (href) child = <a key={markKey} href={href} target="_blank" rel="noopener noreferrer" className="font-medium text-emerald-800 underline">{child}</a>;
      } else if (mark.type === "textStyle") {
        const style: CSSProperties = {};
        if (typeof mark.attrs?.color === "string" && /^#[0-9a-f]{6}$/i.test(mark.attrs.color)) style.color = mark.attrs.color;
        if (typeof mark.attrs?.fontFamily === "string" && fonts.has(mark.attrs.fontFamily)) style.fontFamily = mark.attrs.fontFamily;
        if (typeof mark.attrs?.fontSize === "string" && sizes.has(mark.attrs.fontSize)) style.fontSize = mark.attrs.fontSize;
        child = <span key={markKey} style={style}>{child}</span>;
      }
    }
    return child;
  }
  const children = (node.content || []).map((child, index) => renderNode(child, `${key}-${index}`));
  if (node.type === "doc") return children;
  if (node.type === "paragraph") return <p key={key}>{children.length ? children : <br />}</p>;
  if (node.type === "heading") {
    const level = node.attrs?.level === 3 ? 3 : node.attrs?.level === 4 ? 4 : 2;
    if (level === 3) return <h3 key={key} className="text-xl font-black">{children}</h3>;
    if (level === 4) return <h4 key={key} className="text-lg font-black">{children}</h4>;
    return <h2 key={key} className="text-2xl font-black">{children}</h2>;
  }
  if (node.type === "bulletList") return <ul key={key} className="list-disc space-y-2 pr-6">{children}</ul>;
  if (node.type === "orderedList") return <ol key={key} start={typeof node.attrs?.start === "number" ? node.attrs.start : 1} className="list-decimal space-y-2 pr-6">{children}</ol>;
  if (node.type === "listItem") return <li key={key}>{children}</li>;
  if (node.type === "blockquote") return <blockquote key={key} className="border-r-4 border-emerald-700 pr-4 text-neutral-700">{children}</blockquote>;
  if (node.type === "hardBreak") return <br key={key} />;
  if (node.type === "horizontalRule") return <hr key={key} className="border-neutral-200" />;
  return null;
}

export function RichTextRenderer({ document }: { document: RichTextNode }) {
  return <div className="space-y-4 leading-8 text-[var(--text-body)]">{renderNode(document, "rich-text")}</div>;
}
