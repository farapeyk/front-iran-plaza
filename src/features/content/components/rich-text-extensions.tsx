"use client";

import { Node, mergeAttributes } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer, type NodeViewProps } from "@tiptap/react";
import { BusinessPicker } from "./business-picker";
import type { ContentBusiness } from "../types";

function BusinessView({ node, updateAttributes, deleteNode, extension }: NodeViewProps) {
  return <NodeViewWrapper className="my-4 space-y-3 rounded-xl border border-emerald-300 bg-emerald-50/40 p-4" contentEditable={false}>
    <div className="flex items-center justify-between gap-2"><strong>معرفی کسب‌وکار در متن</strong><button type="button" onClick={deleteNode} className="text-red-700">حذف معرفی</button></div>
    <label className="block text-sm">عنوان فهرست<input aria-label="عنوان معرفی کسب‌وکار" maxLength={160} value={node.attrs.listTitle} onChange={event => updateAttributes({ listTitle: event.target.value })} className="mt-1 w-full rounded border bg-white p-2" /></label>
    <BusinessPicker selected={node.attrs.businessIds} initial={extension.options.businesses} onChange={businessIds => updateAttributes({ businessIds })} />
  </NodeViewWrapper>;
}

export const RichBusinessList = Node.create<{ businesses: ContentBusiness[] }>({
  name: "businessList", group: "block", atom: true, draggable: true,
  addOptions() { return { businesses: [] }; },
  addAttributes() {
    return {
      businessIds: {
        default: [],
        parseHTML: element => (element.getAttribute("data-business-ids") || "").split(",").filter(Boolean),
        renderHTML: attrs => ({ "data-business-ids": attrs.businessIds.join(",") }),
      },
      listTitle: {
        default: "",
        parseHTML: element => element.getAttribute("data-list-title") || "",
        renderHTML: attrs => ({ "data-list-title": attrs.listTitle }),
      },
    };
  },
  parseHTML() { return [{ tag: 'section[data-business-list]' }]; },
  renderHTML({ HTMLAttributes }) { return ["section", mergeAttributes(HTMLAttributes, { "data-business-list": "true" }), "معرفی کسب‌وکار"]; },
  renderText({ node }) { return node.attrs.listTitle || "معرفی کسب‌وکار"; },
  addNodeView() { return ReactNodeViewRenderer(BusinessView); },
});

export const RichFaq = Node.create({
  name: "faq", group: "block", content: "faqQuestion faqAnswer", defining: true,
  addAttributes() { return { isActive: {
    default: true,
    parseHTML: element => element.getAttribute("data-active") !== "false",
    renderHTML: attrs => ({ "data-active": String(attrs.isActive) }),
  } }; },
  parseHTML() { return [{ tag: 'section[data-faq]' }]; },
  renderHTML({ HTMLAttributes }) { return ["section", mergeAttributes(HTMLAttributes, { "data-faq": "true", class: "my-4 rounded-xl border border-slate-300 p-4" }), 0]; },
});
export const RichFaqQuestion = Node.create({
  name: "faqQuestion", priority: 1000, content: "inline*", defining: true,
  parseHTML() { return [{ tag: '[data-faq-question]' }]; },
  renderHTML() { return ["h3", { "data-faq-question": "true", class: "font-bold" }, 0]; },
});
export const RichFaqAnswer = Node.create({
  name: "faqAnswer", content: "block+", defining: true,
  parseHTML() { return [{ tag: '[data-faq-answer]' }]; },
  renderHTML() { return ["div", { "data-faq-answer": "true", class: "mt-3" }, 0]; },
});
export const RichCallout = Node.create({
  name: "callout", group: "block", content: "block+", defining: true,
  parseHTML() { return [{ tag: 'aside[data-callout]' }]; },
  renderHTML() { return ["aside", { "data-callout": "true", class: "my-4 rounded-xl border border-amber-200 bg-amber-50 p-4" }, 0]; },
});
