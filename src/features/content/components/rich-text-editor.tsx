"use client";

import { useEffect, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyleKit } from "@tiptap/extension-text-style";
import type { RichTextNode } from "@/features/content/types";

type RichTextEditorProps = {
  value?: RichTextNode;
  fallbackText?: string;
  onChange: (richText: RichTextNode, plainText: string) => void;
};

const controlClass = "h-9 rounded border border-neutral-300 bg-white px-2 text-sm disabled:opacity-40";

function initialDocument(value?: RichTextNode, fallbackText?: string): RichTextNode {
  if (value?.type === "doc") return value;
  return {
    type: "doc",
    content: [{ type: "paragraph", content: fallbackText ? [{ type: "text", text: fallbackText }] : [] }],
  };
}

export function RichTextEditor({ value, fallbackText, onChange }: RichTextEditorProps) {
  const onChangeRef = useRef(onChange);
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
      }),
      TextStyleKit,
    ],
    content: initialDocument(value, fallbackText),
    editorProps: {
      attributes: {
        class: "min-h-44 px-4 py-3 text-base leading-8 outline-none [&_blockquote]:border-r-4 [&_blockquote]:border-emerald-700 [&_blockquote]:pr-4 [&_h2]:text-2xl [&_h2]:font-black [&_h3]:text-xl [&_h3]:font-bold [&_h4]:text-lg [&_h4]:font-bold [&_ol]:list-decimal [&_ol]:pr-6 [&_ul]:list-disc [&_ul]:pr-6",
      },
    },
    onUpdate: ({ editor: current }) => {
      onChangeRef.current(current.getJSON() as RichTextNode, current.getText({ blockSeparator: "\n" }));
    },
  });

  if (!editor) return <div className="min-h-44 animate-pulse rounded-md border bg-neutral-50" />;

  const setLink = () => {
    const previous = editor.getAttributes("link").href as string | undefined;
    const href = window.prompt("آدرس لینک را با http یا https وارد کنید:", previous || "https://");
    if (href === null) return;
    if (!href.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    try {
      const url = new URL(href);
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error("invalid");
      editor.chain().focus().extendMarkRange("link").setLink({ href: url.toString() }).run();
    } catch {
      window.alert("آدرس لینک معتبر نیست.");
    }
  };

  return (
    <div className="overflow-hidden rounded-md border border-neutral-300 bg-white focus-within:border-emerald-700">
      <div className="flex flex-wrap gap-1 border-b bg-neutral-50 p-2" aria-label="ابزارهای ویرایش متن">
        <button type="button" title="پررنگ" aria-pressed={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} className={`${controlClass} font-black ${editor.isActive("bold") ? "bg-emerald-100" : ""}`}>B</button>
        <button type="button" title="مورب" aria-pressed={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} className={`${controlClass} italic ${editor.isActive("italic") ? "bg-emerald-100" : ""}`}>I</button>
        <button type="button" title="زیرخط" aria-pressed={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} className={`${controlClass} underline ${editor.isActive("underline") ? "bg-emerald-100" : ""}`}>U</button>
        <button type="button" title="خط‌خورده" aria-pressed={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()} className={`${controlClass} line-through ${editor.isActive("strike") ? "bg-emerald-100" : ""}`}>S</button>
        <select aria-label="نوع متن" value={editor.isActive("heading", { level: 2 }) ? "h2" : editor.isActive("heading", { level: 3 }) ? "h3" : editor.isActive("heading", { level: 4 }) ? "h4" : "p"} onChange={event => { const value = event.target.value; if (value === "p") editor.chain().focus().setParagraph().run(); else editor.chain().focus().toggleHeading({ level: Number(value.slice(1)) as 2 | 3 | 4 }).run(); }} className={controlClass}>
          <option value="p">متن معمولی</option><option value="h2">تیتر ۲</option><option value="h3">تیتر ۳</option><option value="h4">تیتر ۴</option>
        </select>
        <select aria-label="فونت" defaultValue="" onChange={event => event.target.value ? editor.chain().focus().setFontFamily(event.target.value).run() : editor.chain().focus().unsetFontFamily().run()} className={controlClass}>
          <option value="">فونت پیش‌فرض</option><option value="IRANSansX">ایران‌سنس</option><option value="sans-serif">بدون سریف</option><option value="serif">سریف</option><option value="monospace">تک‌فاصله</option>
        </select>
        <select aria-label="اندازه فونت" defaultValue="" onChange={event => event.target.value ? editor.chain().focus().setFontSize(event.target.value).run() : editor.chain().focus().unsetFontSize().run()} className={controlClass}>
          <option value="">اندازه پیش‌فرض</option>{[14, 16, 18, 20, 24, 30].map(size => <option key={size} value={`${size}px`}>{size.toLocaleString("fa-IR")}</option>)}
        </select>
        <label className={`${controlClass} flex items-center gap-2`}>رنگ<input type="color" aria-label="رنگ متن" defaultValue="#1f2937" onChange={event => editor.chain().focus().setColor(event.target.value).run()} className="size-6 border-0 bg-transparent p-0" /></label>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`${controlClass} ${editor.isActive("bulletList") ? "bg-emerald-100" : ""}`}>فهرست</button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`${controlClass} ${editor.isActive("orderedList") ? "bg-emerald-100" : ""}`}>شماره‌دار</button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`${controlClass} ${editor.isActive("blockquote") ? "bg-emerald-100" : ""}`}>نقل‌قول</button>
        <button type="button" onClick={setLink} className={`${controlClass} ${editor.isActive("link") ? "bg-emerald-100" : ""}`}>لینک</button>
        <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className={controlClass}>واگرد</button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className={controlClass}>ازنو</button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
