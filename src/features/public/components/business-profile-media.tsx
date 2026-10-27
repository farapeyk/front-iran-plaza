"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { MediaPlayer } from "@/design/components/media-player";
import { ModalHeader } from "@/design/components/modal-header";
import { useModalFocus } from "@/design/lib/use-modal-focus";

const fileUrl = (id: string) => "/api/backend/files/" + encodeURIComponent(id);

export function BusinessBrandVideo({
  videoId,
  imageSrc,
  name,
  size = "large",
  layout = "stacked",
}: {
  videoId: string | null;
  imageSrc: string;
  name: string;
  size?: "large" | "small";
  layout?: "stacked" | "overlay";
}) {
  const [open, setOpen] = useState(false);
  const modalRef = useModalFocus(open, () => setOpen(false));
  const imageSize = size === "large" ? "size-[100px] lg:size-[140px]" : "size-[100px]";

  const overlay = layout === "overlay";

  return (
    <div className={overlay ? "relative shrink-0" : "flex shrink-0 flex-col items-center gap-2"}>
      <Image src={imageSrc} width={140} height={140} alt={name} className={`${imageSize} rounded-full border-[6px] border-secondary-25 object-cover`} />
      {videoId && overlay && (
        <button
          type="button"
          aria-label="پخش ویدیوی معرفی"
          className="absolute bottom-0 left-1/2 flex size-8 -translate-x-1/2 items-center justify-center rounded-full border-2 border-secondary-25 bg-secondary-200 ps-0.5 transition-opacity hover:opacity-90"
          onClick={() => setOpen(true)}
        >
          <Image alt="" className="h-[13px] w-[11px]" height={13} src="/design/icons/play-fill.svg" width={11} />
        </button>
      )}
      {videoId && !overlay && (
        <button type="button" className="flex items-center gap-2 text-sm font-medium text-primary-700" onClick={() => setOpen(true)}>
          <MediaPlayer decorative size="mobile" />
          ویدیوی معرفی
        </button>
      )}
      {open && videoId && (
        <div ref={modalRef} tabIndex={-1} className="fixed inset-0 z-50 flex flex-col bg-[var(--main-bg)]" role="dialog" aria-modal="true" aria-label={`ویدیوی معرفی ${name}`}>
          <ModalHeader title="ویدیوی معرفی" showClose onClose={() => setOpen(false)} />
          <div className="flex min-h-0 flex-1 items-center justify-center p-4">
            <video key={videoId} controls autoPlay playsInline preload="metadata" src={fileUrl(videoId)} className="max-h-full max-w-full rounded object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}

export function AboutText({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const [clamped, setClamped] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const element = textRef.current;
    if (!element) return;
    setClamped(element.scrollHeight > element.clientHeight + 1);
  }, [text]);
  if (!text.trim()) return <p>اطلاعاتی ثبت نشده است.</p>;

  return (
    <div className="space-y-2">
      <p
        className="whitespace-pre-line"
        style={!expanded ? { display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 10, overflow: "hidden" } : undefined}
        ref={textRef}
      >
        {text}
      </p>
      {clamped && <button type="button" className="text-sm font-medium text-primary-700" onClick={() => setExpanded((value) => !value)}>{expanded ? "نمایش کمتر" : "مشاهده بیشتر"}</button>}
    </div>
  );
}
