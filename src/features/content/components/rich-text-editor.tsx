"use client";

import ImagePreview from "next/image";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { Node, createNodeFromContent } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { TextStyleKit } from "@tiptap/extension-text-style";
import Image from "@tiptap/extension-image";
import { TableKit } from "@tiptap/extension-table";
import TextAlign from "@tiptap/extension-text-align";
import YoutubeExtension from "@tiptap/extension-youtube";
import {
  AlignCenter, AlignLeft, AlignRight, Bold, Braces, Code2, Eraser, FileCode2, FileText,
  ImagePlus, Images, Italic, Link2, List, ListOrdered, Maximize2, Minimize2, Minus, Quote,
  Phone, Redo2, Strikethrough, Table2, Underline, Undo2, Upload, Video,
} from "lucide-react";
import type { ContentBusiness, ContentMediaResponse, RichTextNode } from "@/features/content/types";
import { RichBusinessList, RichFaq, RichFaqQuestion, RichFaqAnswer, RichCallout } from "./rich-text-extensions";
import { uploadFileAction } from "@/features/business/actions/upload-file.action";
import { canonicalizeRichTextDocument, normalizeRichTextLinkHref, normalizeTelephoneHref } from "@/features/content/lib/rich-text-links";
import { normalizeRichTextImageSrc, normalizeRichTextYoutubeSrc } from "@/features/content/lib/rich-text-media";
import { customHtmlDocument, customHtmlFromDocument, hasCustomHtmlChanged, MAX_RICH_TEXT_HTML_LENGTH, plainTextFromCustomHtml } from "@/features/content/lib/rich-text-html";

type RichTextEditorProps = {
  value?: RichTextNode;
  fallbackText?: string;
  businesses?: ContentBusiness[];
  onValidityChange?: (valid: boolean) => void;
  onChange: (richText: RichTextNode, plainText: string) => void;
};

type LinkDraft = { from: number; to: number; href: string; selectedText: string };
type InsertPanel = "image" | "youtube" | "table" | "html" | null;

const toolbarButtonClass = "inline-flex h-10 min-w-10 items-center justify-center gap-1.5 rounded-xl border px-2.5 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-40";
const activeButtonClass = "border-slate-900 bg-slate-900 text-white hover:bg-slate-800";
const toolbarSelectClass = "h-10 rounded-xl border border-slate-400 bg-white px-2 text-sm font-bold text-slate-800 outline-none focus:border-emerald-700";
const insertFieldClass = "h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-emerald-700";

const CustomHtml = Node.create({
  name: "rawHtml",
  group: "block",
  atom: true,
  addAttributes() { return { html: {
    default: "",
    parseHTML: element => element.getAttribute("data-html") || "",
    renderHTML: attrs => ({ "data-html": attrs.html }),
  } }; },
  parseHTML() { return [{ tag: "div[data-rich-html]" }]; },
  renderHTML({ HTMLAttributes }) { return ["div", { ...HTMLAttributes, "data-rich-html": "true" }, "HTML/CSS سفارشی"]; },
  renderText({ node }) { return plainTextFromCustomHtml(String(node.attrs.html || "")); },
  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement("div");
      dom.contentEditable = "false";
      dom.className = "m-4 overflow-hidden rounded-xl border border-slate-300 bg-white";

      const label = document.createElement("div");
      label.className = "border-b border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700";
      label.textContent = "پیش‌نمایش امن HTML/CSS سفارشی — برای ویرایش، تب HTML را باز کنید";

      const preview = document.createElement("iframe");
      preview.title = "پیش‌نمایش HTML/CSS سفارشی";
      preview.setAttribute("sandbox", "");
      preview.setAttribute("referrerpolicy", "no-referrer");
      preview.className = "block h-80 w-full border-0 bg-white";
      preview.srcdoc = String(node.attrs.html || "");
      dom.append(label, preview);

      return {
        dom,
        update(updatedNode) {
          if (updatedNode.type.name !== "rawHtml") return false;
          preview.srcdoc = String(updatedNode.attrs.html || "");
          return true;
        },
      };
    };
  },
});

function initialDocument(value?: RichTextNode, fallbackText?: string): RichTextNode {
  if (value?.type === "doc") return value;
  return { type: "doc", content: [{ type: "paragraph", content: fallbackText ? [{ type: "text", text: fallbackText }] : [] }] };
}

function ToolbarButton({ label, active = false, disabled = false, onClick, children, className = "" }: {
  label: string; active?: boolean; disabled?: boolean; onClick: () => void; children: ReactNode; className?: string;
}) {
  return (
    <button type="button" title={label} aria-label={label} aria-pressed={active} disabled={disabled}
      onMouseDown={event => event.preventDefault()} onClick={onClick}
      className={`${toolbarButtonClass} ${active ? activeButtonClass : "border-slate-400 bg-white text-slate-800 hover:border-slate-700 hover:bg-slate-50"} ${className}`}>
      {children}
    </button>
  );
}

export function RichTextEditor({ value, fallbackText, businesses = [], onChange, onValidityChange }: RichTextEditorProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const onChangeRef = useRef(onChange);
  const htmlSnapshotRef = useRef("");
  const [mode, setMode] = useState<"text" | "html">("text");
  const [isCompact, setIsCompact] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [htmlDraft, setHtmlDraft] = useState("");
  const [customHtmlDraft, setCustomHtmlDraft] = useState("");
  const [preserveCustomHtml, setPreserveCustomHtml] = useState(false);
  const [linkDraft, setLinkDraft] = useState<LinkDraft | null>(null);
  const [insertPanel, setInsertPanel] = useState<InsertPanel>(null);
  const [imageDraft, setImageDraft] = useState({ src: "", alt: "" });
  const [youtubeDraft, setYoutubeDraft] = useState("");
  const [tableDraft, setTableDraft] = useState({ rows: 3, cols: 3, withHeaderRow: true });
  const [toolError, setToolError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [library, setLibrary] = useState<ContentMediaResponse["data"]>([]);

  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] }, link: { openOnClick: false, autolink: true, defaultProtocol: "https" } }),
      TextStyleKit.configure({ backgroundColor: false, lineHeight: false }),
      TextAlign.configure({ types: ["heading", "paragraph"], alignments: ["right", "center", "left"] }),
      Image.configure({ inline: false, allowBase64: false, resize: { enabled: false } }),
      TableKit.configure({ table: { resizable: false } }),
      YoutubeExtension.configure({ controls: true, nocookie: true, modestBranding: true }),
      CustomHtml,
      RichBusinessList.configure({ businesses }), RichFaq, RichFaqQuestion, RichFaqAnswer, RichCallout,
    ],
    content: initialDocument(value, fallbackText),
    editorProps: {
      attributes: {
        dir: "rtl",
        class: "min-h-56 px-4 py-4 text-base leading-8 outline-none [&_a]:text-emerald-800 [&_a]:no-underline [&_blockquote]:my-4 [&_blockquote]:border-r-4 [&_blockquote]:border-emerald-700 [&_blockquote]:bg-emerald-50/50 [&_blockquote]:py-2 [&_blockquote]:pr-4 [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1 [&_h2]:my-4 [&_h2]:text-2xl [&_h2]:font-black [&_h3]:my-3 [&_h3]:text-xl [&_h3]:font-bold [&_h4]:my-3 [&_h4]:text-lg [&_h4]:font-bold [&_hr]:my-5 [&_hr]:border-slate-200 [&_iframe]:aspect-video [&_iframe]:h-auto [&_iframe]:max-w-full [&_img]:my-4 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-xl [&_ol]:list-decimal [&_ol]:pr-6 [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-slate-900 [&_pre]:p-4 [&_pre]:text-slate-50 [&_table]:my-4 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-slate-300 [&_td]:p-2 [&_th]:border [&_th]:border-slate-300 [&_th]:bg-slate-100 [&_th]:p-2 [&_ul]:list-disc [&_ul]:pr-6",
      },
    },
    onUpdate: ({ editor: current }) => {
      const richText = canonicalizeRichTextDocument(current.getJSON() as RichTextNode, window.location.origin);
      const customHtml = customHtmlFromDocument(richText);
      onChangeRef.current(richText, customHtml ? plainTextFromCustomHtml(customHtml) : current.getText({ blockSeparator: "\n" }));
    },
  });

  useEffect(() => {
    const handleFullscreen = () => setIsFullscreen(document.fullscreenElement === shellRef.current);
    document.addEventListener("fullscreenchange", handleFullscreen);
    return () => document.removeEventListener("fullscreenchange", handleFullscreen);
  }, []);

  if (!editor) return <div className="min-h-56 animate-pulse rounded-2xl border bg-slate-50" />;

  const closePanels = () => { setLinkDraft(null); setInsertPanel(null); setToolError(""); };

  const insertionPosition = (): number | undefined => {
    const { $from } = editor.state.selection;
    for (let depth = $from.depth; depth > 0; depth--) {
      if ($from.node(depth).type.name === "faq") return $from.after(depth);
    }
    return undefined;
  };
  const insertStructured = (node: RichTextNode) => {
    const position = insertionPosition();
    if (position !== undefined) editor.chain().focus().insertContentAt(position, node).run();
    else editor.chain().focus().insertContent(node).run();
  };

  const applyHtmlDraft = (draft: string, preserve = preserveCustomHtml): boolean => {
    try {
      const trimmedHtml = draft.trim();
      const plainText = plainTextFromCustomHtml(trimmedHtml);
      if (!trimmedHtml || !plainText) {
        setToolError("کد HTML باید حداقل یک متن قابل‌نمایش داشته باشد.");
        onValidityChange?.(false); return false;
      }
      if (trimmedHtml.length > MAX_RICH_TEXT_HTML_LENGTH) {
        setToolError("حجم کد HTML/CSS بیشتر از حد مجاز ۵۰ هزار نویسه است.");
        onValidityChange?.(false); return false;
      }
      const parsed = new DOMParser().parseFromString(trimmedHtml, "text/html");
      const hasStructuredContent = Boolean(parsed.querySelector("[data-faq], [data-business-list], [data-callout]"));
      if (parsed.querySelector("style") && hasStructuredContent) {
        setToolError("برای حفظ اجزای قابل ویرایش، CSS را با style روی همان عنصر اعمال کنید؛ تگ style را در باکس HTML جداگانه قرار دهید.");
        onValidityChange?.(false); return false;
      }
      // CSS documents keep their explicit HTML representation. Normal editor HTML
      // is parsed back into editable nodes, including FAQ and business references.
      if (hasStructuredContent && preserve) {
        setToolError("FAQ و معرفی کسب‌وکار باید در حالت HTML قابل ویرایش باقی بمانند؛ گزینهٔ HTML/CSS سفارشی را بردارید.");
        onValidityChange?.(false); return false;
      }
      const custom = Boolean(parsed.querySelector("style")) || preserve;
      if (!custom) {
        const allowedTags = new Set(["P", "BR", "H2", "H3", "H4", "UL", "OL", "LI", "BLOCKQUOTE", "PRE", "CODE", "HR", "IMG", "IFRAME", "TABLE", "TR", "TH", "TD", "COLGROUP", "COL", "TBODY", "THEAD", "TFOOT", "SECTION", "ASIDE", "DIV", "SPAN", "A", "STRONG", "B", "EM", "I", "U", "S", "STRIKE", "DEL"]);
        if (Array.from(parsed.body.querySelectorAll("*")).some(element => !allowedTags.has(element.tagName))) {
          setToolError("این تگ در متن قابل ویرایش پشتیبانی نمی‌شود؛ آن را در باکس HTML/CSS سفارشی قرار دهید.");
          onValidityChange?.(false); return false;
        }
        for (const faq of parsed.querySelectorAll("[data-faq]")) {
          const question = faq.querySelector(":scope > [data-faq-question]");
          const answer = faq.querySelector(":scope > [data-faq-answer]");
          if (!question?.textContent?.trim() || !answer?.textContent?.trim()) {
            setToolError("ساختار FAQ باید یک پرسش و یک پاسخ دارای متن داشته باشد.");
            onValidityChange?.(false); return false;
          }
        }
      }
      // TipTap's strict HTML check rejects its own colgroup/tbody wrappers.
      // Check supported HTML above, parse normally, then strictly validate JSON.
      const content = custom ? customHtmlDocument(trimmedHtml)
        : createNodeFromContent(trimmedHtml, editor.schema, { slice: false }).toJSON();
      editor.commands.setContent(content, { emitUpdate: true, errorOnInvalidContent: true });
      setToolError("");
      onValidityChange?.(true); return true;
    } catch { setToolError("ساختار HTML قابل تبدیل به محتوای غنی نیست."); onValidityChange?.(false); return false; }
  };

  const switchMode = (nextMode: "text" | "html") => {
    if (nextMode === mode) return;
    closePanels();
    if (nextMode === "html") {
      const currentDocument = editor.getJSON() as RichTextNode;
      const source = customHtmlFromDocument(currentDocument) ?? editor.getHTML();
      htmlSnapshotRef.current = source;
      setPreserveCustomHtml(customHtmlFromDocument(currentDocument) !== null);
      setHtmlDraft(source);
      setMode("html");
      return;
    }
    if (!hasCustomHtmlChanged(htmlDraft, htmlSnapshotRef.current)) {
      onValidityChange?.(true); setMode("text"); return;
    }
    if (applyHtmlDraft(htmlDraft)) setMode("text");
  };

  const toggleFullscreen = async () => {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await shellRef.current?.requestFullscreen();
  };

  const openLinkEditor = (telephone = false) => {
    setInsertPanel(null); setToolError("");
    if (editor.isActive("link")) editor.chain().extendMarkRange("link").run();
    const { from, to } = editor.state.selection;
    if (from === to) { setLinkDraft(null); setToolError("ابتدا بخشی از متن را انتخاب کنید، سپس دکمه لینک را بزنید."); return; }
    const selectedText = editor.state.doc.textBetween(from, to, " ");
    const currentHref = (editor.getAttributes("link").href as string | undefined) ?? "";
    const href = telephone ? normalizeTelephoneHref(currentHref || selectedText) ?? "tel:" : currentHref;
    setLinkDraft({ from, to, href, selectedText });
  };

  const applyLink = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!linkDraft) return;
    const href = normalizeRichTextLinkHref(linkDraft.href, window.location.origin);
    if (!href) { setToolError("آدرس یا شماره معتبر وارد کنید؛ لینک داخلی، http/https، شماره تماس یا tel: پذیرفته می‌شود."); return; }
    editor.chain().focus().setTextSelection({ from: linkDraft.from, to: linkDraft.to }).setLink({ href }).run();
    closePanels();
  };

  const removeLink = () => {
    if (!linkDraft) return;
    editor.chain().focus().setTextSelection({ from: linkDraft.from, to: linkDraft.to }).unsetLink().run();
    closePanels();
  };

  const applyImage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const src = normalizeRichTextImageSrc(imageDraft.src, window.location.origin);
    if (!src) { setToolError("نشانی تصویر معتبر نیست. فقط آدرس داخلی یا http/https پذیرفته می‌شود."); return; }
    editor.chain().focus().setImage({ src, alt: imageDraft.alt.trim().slice(0, 160) }).run();
    setImageDraft({ src: "", alt: "" }); closePanels();
  };

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setUploading(true); setToolError("");
    const data = new FormData(); data.set("file", file);
    const result = await uploadFileAction(data);
    setUploading(false);
    if (!result.success) { setToolError(result.message); return; }
    const src = `/api/backend/files/${encodeURIComponent(result.fileId)}`;
    editor.chain().focus().setImage({ src, alt: file.name.replace(/\.[^.]+$/, "").slice(0, 160) }).run();
    setImageDraft({ src: "", alt: "" });
    setInsertPanel(null);
  };

  const openLibrary = async () => {
    setLinkDraft(null); setInsertPanel(null); setToolError(""); setLibraryOpen(true); setLibraryLoading(true);
    try {
      const response = await fetch("/api/backend/content/media?page=1&limit=60", { cache: "no-store" });
      if (!response.ok) throw new Error("MEDIA_LIBRARY_FAILED");
      setLibrary((await response.json() as ContentMediaResponse).data);
    } catch { setToolError("بارگذاری کتابخانه رسانه انجام نشد. دوباره تلاش کنید."); }
    finally { setLibraryLoading(false); }
  };

  const applyYoutube = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const src = normalizeRichTextYoutubeSrc(youtubeDraft);
    if (!src) { setToolError("لینک معتبر YouTube یا youtu.be وارد کنید."); return; }
    editor.chain().focus().setYoutubeVideo({ src, width: 640, height: 360 }).run();
    setYoutubeDraft(""); closePanels();
  };

  const applyTable = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const rows = Math.min(10, Math.max(1, tableDraft.rows));
    const cols = Math.min(8, Math.max(1, tableDraft.cols));
    const chain = editor.chain().focus();
    const position = insertionPosition();
    if (position !== undefined) chain.insertContentAt(position, { type: "paragraph" }).setTextSelection(position + 1);
    chain.insertTable({ rows, cols, withHeaderRow: tableDraft.withHeaderRow }).run();
    closePanels();
  };

  const openInsertPanel = (panel: Exclude<InsertPanel, null>) => {
    setLinkDraft(null); setToolError(""); setInsertPanel(current => current === panel ? null : panel);
  };

  return (
    <div ref={shellRef} className={`overflow-auto rounded-2xl border border-slate-300 bg-white shadow-sm ${isFullscreen ? "h-screen w-screen rounded-none p-4" : ""}`}>
      <div className="space-y-2 border-b border-slate-200 bg-slate-50/90 p-2.5" aria-label="ابزارهای ویرایش متن">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            <ToolbarButton label="حالت متن" active={mode === "text"} onClick={() => switchMode("text")} className="min-w-20"><FileText className="size-4" /> متن</ToolbarButton>
            <ToolbarButton label="ویرایش HTML" active={mode === "html"} onClick={() => switchMode("html")} className="min-w-24"><FileCode2 className="size-4" /> HTML</ToolbarButton>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <ToolbarButton label={isCompact ? "کادر بزرگ" : "کادر کوچک"} onClick={() => setIsCompact(current => !current)} className="min-w-28">
              {isCompact ? <Minus className="size-4" /> : <Maximize2 className="size-4" />}{isCompact ? "کادر کوچک" : "کادر بزرگ"}
            </ToolbarButton>
            <ToolbarButton label={isFullscreen ? "خروج از تمام‌صفحه" : "تمام‌صفحه"} onClick={() => void toggleFullscreen()} className="min-w-28">
              {isFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}{isFullscreen ? "خروج" : "تمام‌صفحه"}
            </ToolbarButton>
          </div>
        </div>

        {mode === "text" ? <>
          <div className="flex flex-wrap gap-1.5">
            <select aria-label="نوع متن" value={editor.isActive("heading", { level: 2 }) ? "h2" : editor.isActive("heading", { level: 3 }) ? "h3" : editor.isActive("heading", { level: 4 }) ? "h4" : "p"}
              onChange={event => { const next = event.target.value; if (next === "p") editor.chain().focus().setParagraph().run(); else editor.chain().focus().setHeading({ level: Number(next.slice(1)) as 2 | 3 | 4 }).run(); }} className={`${toolbarSelectClass} min-w-28`}>
              <option value="p">پاراگراف</option><option value="h2">تیتر ۲</option><option value="h3">تیتر ۳</option><option value="h4">تیتر ۴</option>
            </select>
            <ToolbarButton label="پررنگ" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="size-4" /></ToolbarButton>
            <ToolbarButton label="مورب" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="size-4" /></ToolbarButton>
            <ToolbarButton label="زیرخط" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}><Underline className="size-4" /></ToolbarButton>
            <ToolbarButton label="خط‌خورده" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough className="size-4" /></ToolbarButton>
            <ToolbarButton label="کد درون‌خطی" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}><Code2 className="size-4" /></ToolbarButton>
            <select aria-label="فونت" defaultValue="" onChange={event => event.target.value ? editor.chain().focus().setFontFamily(event.target.value).run() : editor.chain().focus().unsetFontFamily().run()} className={`${toolbarSelectClass} min-w-28`}>
              <option value="">پیش‌فرض</option><option value="IRANSansX">ایران‌سنس</option><option value="sans-serif">بدون سریف</option><option value="serif">سریف</option><option value="monospace">تک‌فاصله</option>
            </select>
            <select aria-label="اندازه فونت" defaultValue="" onChange={event => event.target.value ? editor.chain().focus().setFontSize(event.target.value).run() : editor.chain().focus().unsetFontSize().run()} className={`${toolbarSelectClass} min-w-24`}>
              <option value="">اندازه</option>{[14, 16, 18, 20, 24, 30].map(size => <option key={size} value={`${size}px`}>{size.toLocaleString("fa-IR")}</option>)}
            </select>
            <label className={`${toolbarButtonClass} cursor-pointer`} title="رنگ متن">رنگ<input type="color" aria-label="رنگ متن" defaultValue="#1f2937" onChange={event => editor.chain().focus().setColor(event.target.value).run()} className="size-5 border-0 bg-transparent p-0" /></label>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <ToolbarButton label="راست‌چین" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}><AlignRight className="size-4" /></ToolbarButton>
            <ToolbarButton label="وسط‌چین" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}><AlignCenter className="size-4" /></ToolbarButton>
            <ToolbarButton label="چپ‌چین" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}><AlignLeft className="size-4" /></ToolbarButton>
            <ToolbarButton label="فهرست نشانه‌دار" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}><List className="size-4" /></ToolbarButton>
            <ToolbarButton label="فهرست شماره‌دار" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered className="size-4" /></ToolbarButton>
            <ToolbarButton label="نقل‌قول" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote className="size-4" /></ToolbarButton>
            <ToolbarButton label="بلوک کد" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}><Braces className="size-4" /></ToolbarButton>
            <ToolbarButton label="لینک‌کردن متن انتخابی" active={editor.isActive("link") && !String(editor.getAttributes("link").href || "").startsWith("tel:")} onClick={() => openLinkEditor()}><Link2 className="size-4" /></ToolbarButton>
            <ToolbarButton label="لینک تماس برای متن انتخابی" active={String(editor.getAttributes("link").href || "").startsWith("tel:")} onClick={() => openLinkEditor(true)}><Phone className="size-4" /></ToolbarButton>
            <ToolbarButton label="درج تصویر" active={insertPanel === "image"} onClick={() => openInsertPanel("image")}><ImagePlus className="size-4" /></ToolbarButton>
            <ToolbarButton label="آپلود تصویر" disabled={uploading} onClick={() => uploadInputRef.current?.click()}><Upload className="size-4" /></ToolbarButton>
            <ToolbarButton label="کتابخانه رسانه" active={libraryOpen} onClick={() => void openLibrary()}><Images className="size-4" /></ToolbarButton>
            <ToolbarButton label="درج جدول" active={insertPanel === "table"} onClick={() => openInsertPanel("table")}><Table2 className="size-4" /></ToolbarButton>
            <ToolbarButton label="درج پرسش متداول در متن" onClick={() => insertStructured({ type: "faq", attrs: { isActive: true }, content: [
              { type: "faqQuestion", content: [{ type: "text", text: "پرسش متداول" }] },
              { type: "faqAnswer", content: [{ type: "paragraph", content: [{ type: "text", text: "پاسخ پرسش را اینجا بنویسید." }] }] },
            ] })}>FAQ</ToolbarButton>
            <ToolbarButton label="درج معرفی کسب‌وکار در متن" onClick={() => insertStructured({ type: "businessList", attrs: { businessIds: [], listTitle: "معرفی کسب‌وکار" } })}>کسب‌وکار</ToolbarButton>
            <ToolbarButton label="باکس نکته در متن" active={editor.isActive("callout")} onClick={() => editor.chain().focus().toggleWrap("callout").run()}>باکس نکته</ToolbarButton>
            <ToolbarButton label="درج HTML و CSS سفارشی در متن" onClick={() => openInsertPanel("html")}><FileCode2 className="size-4" /> HTML/CSS</ToolbarButton>
            <ToolbarButton label="درج ویدئوی YouTube" active={insertPanel === "youtube"} onClick={() => openInsertPanel("youtube")}><Video className="size-4" /></ToolbarButton>
            <ToolbarButton label="خط جداکننده" onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus className="size-4" /></ToolbarButton>
          </div>
          {editor.isActive("faq") ? <div className="flex flex-wrap gap-2 text-sm"><ToolbarButton label="فعال یا غیرفعال کردن پرسش" active={editor.getAttributes("faq").isActive !== false} onClick={() => editor.chain().focus().updateAttributes("faq", { isActive: editor.getAttributes("faq").isActive === false }).run()}>انتشار FAQ و اسکیما</ToolbarButton><ToolbarButton label="حذف پرسش از متن" onClick={() => editor.chain().focus().deleteNode("faq").run()}>حذف پرسش</ToolbarButton></div> : null}
          {editor.isActive("table") ? <div className="flex flex-wrap gap-1.5" aria-label="ویرایش ساختار جدول">
            <ToolbarButton label="افزودن سطر قبل" onClick={() => editor.chain().focus().addRowBefore().run()}>سطر قبل</ToolbarButton>
            <ToolbarButton label="افزودن سطر بعد" onClick={() => editor.chain().focus().addRowAfter().run()}>سطر بعد</ToolbarButton>
            <ToolbarButton label="حذف سطر" onClick={() => editor.chain().focus().deleteRow().run()}>حذف سطر</ToolbarButton>
            <ToolbarButton label="افزودن ستون قبل" onClick={() => editor.chain().focus().addColumnBefore().run()}>ستون قبل</ToolbarButton>
            <ToolbarButton label="افزودن ستون بعد" onClick={() => editor.chain().focus().addColumnAfter().run()}>ستون بعد</ToolbarButton>
            <ToolbarButton label="حذف ستون" onClick={() => editor.chain().focus().deleteColumn().run()}>حذف ستون</ToolbarButton>
            <ToolbarButton label="ادغام خانه‌ها" disabled={!editor.can().mergeCells()} onClick={() => editor.chain().focus().mergeCells().run()}>ادغام</ToolbarButton>
            <ToolbarButton label="تفکیک خانه" disabled={!editor.can().splitCell()} onClick={() => editor.chain().focus().splitCell().run()}>تفکیک</ToolbarButton>
            <ToolbarButton label="تغییر سطر عنوان" onClick={() => editor.chain().focus().toggleHeaderRow().run()}>سطر عنوان</ToolbarButton>
            <ToolbarButton label="تغییر ستون عنوان" onClick={() => editor.chain().focus().toggleHeaderColumn().run()}>ستون عنوان</ToolbarButton>
            <ToolbarButton label="حذف جدول" onClick={() => editor.chain().focus().deleteTable().run()}>حذف جدول</ToolbarButton>
          </div> : null}
          <div className="flex flex-wrap justify-center gap-1.5">
            <ToolbarButton label="پاک‌کردن قالب‌بندی" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}><Eraser className="size-4" /></ToolbarButton>
            <ToolbarButton label="واگرد" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}><Undo2 className="size-4" /></ToolbarButton>
            <ToolbarButton label="ازنو" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}><Redo2 className="size-4" /></ToolbarButton>
          </div>
        </> : null}
      </div>

      <input ref={uploadInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={uploading} onChange={event => void uploadImage(event)} className="sr-only" />

      {insertPanel === "html" ? <div className="space-y-2 border-b bg-slate-50 p-3">
        <label className="block text-sm font-bold">باکس HTML/CSS در محل نشانگر<textarea aria-label="HTML سفارشی برای درج" dir="ltr" value={customHtmlDraft} onChange={event => setCustomHtmlDraft(event.target.value)} maxLength={MAX_RICH_TEXT_HTML_LENGTH} className="mt-2 min-h-40 w-full rounded-xl border bg-white p-3 font-mono" /></label>
        <button type="button" onClick={() => {
          if (!plainTextFromCustomHtml(customHtmlDraft)) { setToolError("کد HTML باید متن قابل‌نمایش داشته باشد."); return; }
          insertStructured({ type: "rawHtml", attrs: { html: customHtmlDraft } }); setCustomHtmlDraft(""); closePanels();
        }} className="rounded-xl bg-emerald-700 px-4 py-2 text-white">درج باکس HTML</button>
        <button type="button" onClick={closePanels} className="mx-2 rounded-xl border px-4 py-2">انصراف</button>
      </div> : null}

      {linkDraft ? <form onSubmit={applyLink} className="space-y-2 border-b border-emerald-200 bg-emerald-50/70 p-3">
        <label className="block space-y-1"><span className="text-sm font-bold">آدرس لینک برای «{linkDraft.selectedText.slice(0, 80)}{linkDraft.selectedText.length > 80 ? "…" : ""}»</span>
          <input autoFocus dir="ltr" type="text" inputMode={linkDraft.href.startsWith("tel:") ? "tel" : "url"} value={linkDraft.href} onChange={event => setLinkDraft(current => current ? { ...current, href: event.target.value } : current)} placeholder="https://example.com، /articles/ یا 09121234567" className={insertFieldClass} /></label>
        <p className="text-xs text-emerald-900">برای تماس می‌توانید شماره را مستقیم وارد کنید؛ شماره‌های فارسی و انگلیسی خودکار به لینک tel تبدیل می‌شوند.</p>
        <div className="flex flex-wrap gap-2"><button type="submit" className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-bold text-white">ثبت لینک</button>
          {linkDraft.href ? <button type="button" onClick={removeLink} className="rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-bold text-red-700">حذف لینک</button> : null}
          <button type="button" onClick={closePanels} className="rounded-xl border bg-white px-4 py-2 text-sm font-bold">انصراف</button></div>
      </form> : null}

      {insertPanel === "image" ? <form onSubmit={applyImage} className="grid gap-2 border-b border-emerald-200 bg-emerald-50/70 p-3 sm:grid-cols-2">
        <input autoFocus dir="ltr" type="url" inputMode="url" value={imageDraft.src} onChange={event => setImageDraft(current => ({ ...current, src: event.target.value }))} placeholder="نشانی تصویر https://…" className={insertFieldClass} />
        <input value={imageDraft.alt} onChange={event => setImageDraft(current => ({ ...current, alt: event.target.value }))} placeholder="متن جایگزین تصویر" maxLength={160} className={insertFieldClass} />
        <div className="flex gap-2 sm:col-span-2"><button type="submit" className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-bold text-white">درج تصویر</button><button type="button" onClick={closePanels} className="rounded-xl border bg-white px-4 py-2 text-sm font-bold">انصراف</button></div>
      </form> : null}

      {insertPanel === "youtube" ? <form onSubmit={applyYoutube} className="flex flex-wrap gap-2 border-b border-emerald-200 bg-emerald-50/70 p-3">
        <input autoFocus dir="ltr" type="url" inputMode="url" value={youtubeDraft} onChange={event => setYoutubeDraft(event.target.value)} placeholder="https://youtube.com/watch?v=…" className={`${insertFieldClass} min-w-64 flex-1`} />
        <button type="submit" className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-bold text-white">درج ویدئو</button><button type="button" onClick={closePanels} className="rounded-xl border bg-white px-4 py-2 text-sm font-bold">انصراف</button>
      </form> : null}

      {insertPanel === "table" ? <form onSubmit={applyTable} className="flex flex-wrap items-end gap-3 border-b border-emerald-200 bg-emerald-50/70 p-3">
        <label className="space-y-1 text-sm font-bold"><span className="block">سطر</span><input type="number" min={1} max={10} value={tableDraft.rows} onChange={event => setTableDraft(current => ({ ...current, rows: Number(event.target.value) }))} className={`${insertFieldClass} w-24`} /></label>
        <label className="space-y-1 text-sm font-bold"><span className="block">ستون</span><input type="number" min={1} max={8} value={tableDraft.cols} onChange={event => setTableDraft(current => ({ ...current, cols: Number(event.target.value) }))} className={`${insertFieldClass} w-24`} /></label>
        <label className="flex h-10 items-center gap-2 text-sm font-bold"><input type="checkbox" checked={tableDraft.withHeaderRow} onChange={event => setTableDraft(current => ({ ...current, withHeaderRow: event.target.checked }))} /> سطر عنوان</label>
        <button type="submit" className="h-10 rounded-xl bg-emerald-700 px-4 text-sm font-bold text-white">درج جدول</button><button type="button" onClick={closePanels} className="h-10 rounded-xl border bg-white px-4 text-sm font-bold">انصراف</button>
      </form> : null}

      {toolError ? <p role="alert" className="border-b border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-900">{toolError}</p> : null}
      {libraryOpen ? <div role="dialog" aria-modal="true" aria-label="کتابخانه رسانه" className="fixed inset-0 z-[60] grid place-items-center bg-slate-950/55 p-4">
        <div className="max-h-[80vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl">
          <div className="mb-4 flex items-center justify-between gap-3"><h3 className="text-lg font-black">انتخاب تصویر از کتابخانه رسانه</h3><button type="button" onClick={() => setLibraryOpen(false)} className="rounded-xl border px-3 py-2 text-sm font-bold">بستن</button></div>
          {libraryLoading ? <p className="py-10 text-center text-slate-500">در حال بارگذاری…</p> : <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-4">{library.map(item => <button key={item.id} type="button" onClick={() => { setImageDraft({ src: `/api/backend/files/${encodeURIComponent(item.id)}`, alt: item.fileName.replace(/\.[^.]+$/, "") }); setLibraryOpen(false); setInsertPanel("image"); }} className="overflow-hidden rounded-xl border border-slate-200 text-right hover:border-emerald-600">
            <span className="relative block aspect-[4/3] bg-slate-100"><ImagePreview fill unoptimized src={`/api/backend/files/${encodeURIComponent(item.id)}`} alt={item.fileName} className="object-cover" /></span><span className="block truncate p-2 text-xs font-bold">{item.fileName}</span>
          </button>)}</div>}
          {!libraryLoading && !library.length ? <p className="py-10 text-center text-slate-500">تصویری در کتابخانه پیدا نشد.</p> : null}
        </div>
      </div> : null}
      {mode === "html" ? <div className="space-y-2 p-3">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={preserveCustomHtml} onChange={event => { setPreserveCustomHtml(event.target.checked); applyHtmlDraft(htmlDraft, event.target.checked); }} />حفظ کد به‌صورت یک باکس HTML/CSS سفارشی</label>
        <textarea dir="ltr" spellCheck={false} value={htmlDraft} onChange={event => { setHtmlDraft(event.target.value); applyHtmlDraft(event.target.value); }} className={`${isCompact ? "min-h-56" : "min-h-[32rem]"} w-full resize-y rounded-xl border border-slate-300 bg-slate-950 p-4 font-mono text-sm leading-7 text-slate-100 outline-none focus:border-emerald-600`} aria-label="کد HTML محتوا" />
        <p className="text-xs leading-6 text-slate-600">HTML معمولی به متن، جدول، FAQ و معرفی کسب‌وکار قابل ویرایش برمی‌گردد؛ ویژگی‌های data این اجزا را نگه دارید. برای حفظ دقیق CSS و HTML اختصاصی، گزینهٔ باکس سفارشی را فعال کنید یا از «درج HTML و CSS سفارشی در متن» استفاده کنید. کدهای اجرایی ناامن هنگام ذخیره حذف می‌شوند.</p>
        <button type="button" onClick={() => switchMode("text")} className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-bold text-white">اعمال HTML/CSS و بازگشت به متن</button>
      </div> : <div className={isCompact ? "min-h-56" : "min-h-[32rem]"}><EditorContent editor={editor} /></div>}
    </div>
  );
}
