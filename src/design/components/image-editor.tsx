"use client"
import Image from "next/image";

import { useEffect, useRef, useState } from "react"
import { Button } from "@/design/components/ui/button"
import { useModalFocus } from "@/design/lib/use-modal-focus"
import {
  clampCropPan,
  coverScale,
  sourceCropRect,
  type ImagePoint,
  type ImageSize,
} from "@/design/lib/image-crop"

const closeIcon = "/design/icons/close-x.svg"
const galleryIcon = "/design/icons/gallery.svg"

export type ImageAspect = "original" | "square" | "portrait" | "landscape" | "wide"

const aspectOptions: Array<{ id: ImageAspect; label: string; ratio?: number }> = [
  { id: "original", label: "اصلی" },
  { id: "square", label: "مربع", ratio: 1 },
  { id: "portrait", label: "عمودی", ratio: 4 / 5 },
  { id: "landscape", label: "افقی", ratio: 4 / 3 },
  { id: "wide", label: "عریض", ratio: 16 / 9 },
]

type ImageEditorProps = {
  file: File | null
  title?: string
  initialAspect?: ImageAspect
  aspects?: ImageAspect[]
  maxOutputWidth?: number
  onCancel: () => void
  onConfirm: (file: File) => void | Promise<void>
}

type ImageEditorDialogProps = Omit<Required<ImageEditorProps>, "file"> & { file: File }

function canvasBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("ساخت تصویر نهایی انجام نشد.")), type, quality)
  })
}

function editedFileName(file: File, mimeType: string) {
  const extension = mimeType === "image/png" ? "png" : mimeType === "image/webp" ? "webp" : "jpg"
  const base = file.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9\u0600-\u06ff_-]+/g, "-") || "image"
  return `${base}-edited.${extension}`
}

export function ImageEditor({
  file,
  title = "ویرایش تصویر",
  initialAspect = "square",
  aspects = ["original", "square", "portrait", "landscape", "wide"],
  maxOutputWidth = 1920,
  onCancel,
  onConfirm,
}: ImageEditorProps) {
  if (!file) return null
  return <ImageEditorDialog
    key={`${file.name}-${file.lastModified}-${file.size}`}
    file={file}
    title={title}
    initialAspect={initialAspect}
    aspects={aspects}
    maxOutputWidth={maxOutputWidth}
    onCancel={onCancel}
    onConfirm={onConfirm}
  />
}

function ImageEditorDialog({file,title,initialAspect,aspects,maxOutputWidth,onCancel,onConfirm}:ImageEditorDialogProps) {
  const [aspect,setAspect]=useState<ImageAspect>(initialAspect)
  const [zoom,setZoom]=useState(1)
  const [pan,setPan]=useState<ImagePoint>({x:0,y:0})
  const [sourceSize,setSourceSize]=useState<ImageSize>({width:0,height:0})
  const [frameSize,setFrameSize]=useState<ImageSize>({width:0,height:0})
  const [processing,setProcessing]=useState(false)
  const [message,setMessage]=useState("")
  const [objectUrl,setObjectUrl]=useState("")
  const imageRef=useRef<HTMLImageElement>(null)
  const frameRef=useRef<HTMLDivElement>(null)
  const dragRef=useRef<{pointerId:number;x:number;y:number;pan:ImagePoint}|null>(null)
  const requestClose=()=>{if(!processing)onCancel()}
  const modalRef=useModalFocus(true,requestClose)

  useEffect(()=>{
    const url=URL.createObjectURL(file)
    // Blob URLs are browser resources. Recreating them in the effect keeps the
    // preview valid when React intentionally remounts effects in development.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setObjectUrl(url)
    return ()=>URL.revokeObjectURL(url)
  },[file])

  useEffect(()=>{
    const frame=frameRef.current
    if(!frame)return
    const update=()=>setFrameSize({width:frame.clientWidth,height:frame.clientHeight})
    update()
    const observer=new ResizeObserver(update)
    observer.observe(frame)
    return ()=>observer.disconnect()
  },[aspect])

  const sourceRatio=sourceSize.width&&sourceSize.height?sourceSize.width/sourceSize.height:1
  const selectedOption=aspectOptions.find(option=>option.id===aspect)??aspectOptions[1]
  const aspectRatio=selectedOption.ratio??sourceRatio
  const visibleOptions=aspectOptions.filter(option=>aspects.includes(option.id))
  const scale=coverScale(sourceSize,frameSize,zoom)
  const renderedSize={width:sourceSize.width*scale,height:sourceSize.height*scale}
  const effectivePan=clampCropPan(pan,sourceSize,frameSize,zoom)

  function changeAspect(next:ImageAspect) {
    setAspect(next)
    setZoom(1)
    setPan({x:0,y:0})
  }

  function moveImage(clientX:number,clientY:number) {
    const drag=dragRef.current
    if(!drag)return
    setPan(clampCropPan({x:drag.pan.x+clientX-drag.x,y:drag.pan.y+clientY-drag.y},sourceSize,frameSize,zoom))
  }

  async function confirm() {
    const image=imageRef.current
    if(!image||!sourceSize.width||!frameSize.width)return
    setProcessing(true)
    setMessage("")
    try {
      const crop=sourceCropRect(sourceSize,frameSize,effectivePan,zoom)
      const outputWidth=Math.max(1,Math.min(maxOutputWidth,Math.round(crop.width)))
      const outputHeight=Math.max(1,Math.round(outputWidth/aspectRatio))
      const canvas=document.createElement("canvas")
      canvas.width=outputWidth
      canvas.height=outputHeight
      const context=canvas.getContext("2d")
      if(!context)throw new Error("مرورگر امکان ویرایش این تصویر را ندارد.")
      context.imageSmoothingEnabled=true
      context.imageSmoothingQuality="high"
      context.drawImage(image,crop.x,crop.y,crop.width,crop.height,0,0,outputWidth,outputHeight)
      // Encode the edited pixels once as high-quality WebP. The backend
      // validates existing WebP without applying another lossy conversion.
      const mimeType="image/webp"
      const blob=await canvasBlob(canvas,mimeType,.92)
      await onConfirm(new File([blob],editedFileName(file,mimeType),{type:mimeType,lastModified:Date.now()}))
    } catch(error) {
      setMessage(error instanceof Error?error.message:"ویرایش تصویر انجام نشد.")
    } finally {
      setProcessing(false)
    }
  }

  return <div ref={modalRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="image-editor-title" className="fixed inset-0 z-[70] flex items-end justify-center bg-[var(--opacity-dark-56)] p-0 sm:items-center sm:p-6" dir="rtl">
    <div className="flex max-h-[100dvh] w-full max-w-[860px] flex-col overflow-hidden rounded-t-[var(--radius-lg)] bg-[var(--surface)] shadow-2xl sm:max-h-[92dvh] sm:rounded-[var(--radius-lg)]">
      <header className="flex items-center justify-between border-b border-[var(--border-subtle)] px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-primary-50"><Image src={galleryIcon} width={22} height={22} alt=""/></span>
          <div><h2 id="image-editor-title" className="font-black text-[var(--text-title)]">{title}</h2><p className="text-xs text-[var(--text-muted)]">قاب مناسب را انتخاب و تصویر را جابه‌جا کنید</p></div>
        </div>
        <button type="button" aria-label="بستن ویرایشگر تصویر" onClick={requestClose} disabled={processing} className="flex size-10 items-center justify-center rounded-full border border-[var(--border-subtle)]"><Image src={closeIcon} width={22} height={22} alt=""/></button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="انتخاب قاب تصویر">
          {visibleOptions.map(option=><button key={option.id} type="button" aria-pressed={aspect===option.id} onClick={()=>changeAspect(option.id)} disabled={processing} className={`shrink-0 rounded-full border px-4 py-2 text-sm ${aspect===option.id?'border-primary-700 bg-primary-950 font-bold text-white':'border-[var(--border-subtle)] text-[var(--text-body)]'}`}>{option.label}</button>)}
        </div>

        <div
          ref={frameRef}
          className="relative mx-auto max-w-full touch-none cursor-grab overflow-hidden rounded-[var(--radius-md)] bg-primary-950 select-none active:cursor-grabbing"
          style={{aspectRatio:String(aspectRatio),width:`min(100%, ${(55*aspectRatio).toFixed(2)}dvh)`}}
          onPointerDown={event=>{if(processing)return;event.currentTarget.setPointerCapture(event.pointerId);dragRef.current={pointerId:event.pointerId,x:event.clientX,y:event.clientY,pan:effectivePan}}}
          onPointerMove={event=>{if(dragRef.current?.pointerId===event.pointerId)moveImage(event.clientX,event.clientY)}}
          onPointerUp={event=>{if(dragRef.current?.pointerId===event.pointerId)dragRef.current=null}}
          onPointerCancel={()=>{dragRef.current=null}}
        >
          {objectUrl?<Image
            ref={imageRef}
            src={objectUrl}
            width={1600}
            height={1600}
            unoptimized
            alt="پیش‌نمایش تصویر انتخاب‌شده"
            draggable={false}
            onLoad={event=>{setMessage("");setSourceSize({width:event.currentTarget.naturalWidth,height:event.currentTarget.naturalHeight})}}
            onError={()=>setMessage("پیش‌نمایش تصویر آماده نشد؛ لطفاً یک تصویر JPG، PNG یا WebP دیگر انتخاب کنید.")}
            className="pointer-events-none absolute max-w-none"
            style={{width:renderedSize.width||undefined,height:renderedSize.height||undefined,left:`calc(50% + ${effectivePan.x}px)`,top:`calc(50% + ${effectivePan.y}px)`,transform:"translate(-50%, -50%)"}}
          />:<span className="absolute inset-0 flex items-center justify-center text-sm text-white/80">در حال آماده‌سازی تصویر…</span>}
          <div className="pointer-events-none absolute inset-0 border border-white/70 shadow-[inset_0_0_0_1px_rgba(0,0,0,.15)]"/>
          <div className="pointer-events-none absolute inset-x-0 top-1/3 border-t border-white/35"/><div className="pointer-events-none absolute inset-x-0 top-2/3 border-t border-white/35"/><div className="pointer-events-none absolute inset-y-0 left-1/3 border-l border-white/35"/><div className="pointer-events-none absolute inset-y-0 left-2/3 border-l border-white/35"/>
        </div>

        <div className="mx-auto mt-5 flex max-w-[640px] items-center gap-3">
          <span className="shrink-0 text-sm font-bold text-[var(--text-title)]">زوم</span>
          <input type="range" min="1" max="3" step="0.01" value={zoom} disabled={processing} aria-label="بزرگ‌نمایی تصویر" onChange={event=>setZoom(Number(event.target.value))} className="w-full accent-[var(--primary-700)]"/>
          <span className="w-12 shrink-0 text-left text-xs text-[var(--text-muted)]">{Math.round(zoom*100).toLocaleString('fa-IR')}٪</span>
          <button type="button" disabled={processing} onClick={()=>{setZoom(1);setPan({x:0,y:0})}} className="shrink-0 text-sm font-bold text-primary-700">بازنشانی</button>
        </div>
        <p className="mt-3 text-center text-xs text-[var(--text-muted)]">خروجی با کیفیت بالا ساخته می‌شود و فقط نسخه ویرایش‌شده بارگذاری خواهد شد.</p>
        {message&&<p role="alert" className="mt-3 text-center text-sm text-[var(--danger)]">{message}</p>}
      </div>

      <footer className="flex gap-3 border-t border-[var(--border-subtle)] px-4 py-4 sm:px-6">
        <Button type="button" onClick={confirm} disabled={processing||!sourceSize.width} className="flex-1">{processing?'در حال آماده‌سازی…':'تأیید و بارگذاری'}</Button>
        <Button type="button" variant="outline" onClick={requestClose} disabled={processing}>انصراف</Button>
      </footer>
    </div>
  </div>
}
