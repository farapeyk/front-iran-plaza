"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Trash2, UploadCloud, Video } from "lucide-react";
import { uploadFileAction } from "@/features/business/actions/upload-file.action";
import { addGalleryImageAction, removeGalleryImageAction } from "@/features/business/actions/gallery.action";
import { updateBusinessProfileAction } from "@/features/business/actions/update-business-profile.action";
import type { GalleryImageData } from "@/features/business/types/business-profile";

function fileUrl(fileId: string) {
  return `/api/backend/files/${fileId}`;
}

export function GalleryManager({ businessId, initialImages, initialIntroVideoId }: { businessId: string; initialImages: GalleryImageData[]; initialIntroVideoId: string | null }) {
  const [images, setImages] = useState(initialImages);
  const [introVideoId, setIntroVideoId] = useState(initialIntroVideoId);
  const [isUploadingImage, startImageUpload] = useTransition();
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  function handleAddImage(file: File | null) {
    if (!file) return;
    startImageUpload(async () => {
      const formData = new FormData();
      formData.append("file", file);
      const uploadResult = await uploadFileAction(formData);
      if (!uploadResult.success) {
        toast.error(uploadResult.message);
        return;
      }

      const addResult = await addGalleryImageAction(businessId, uploadResult.fileId);
      if (!addResult.success) {
        toast.error(addResult.message);
        return;
      }

      setImages((prev) => [...prev, { id: uploadResult.fileId, businessId, fileId: uploadResult.fileId, title: null, sortOrder: prev.length, createdAt: new Date().toISOString() }]);
      toast.success("تصویر اضافه شد");
    });
  }

  function handleRemoveImage(imageId: string) {
    startImageUpload(async () => {
      const result = await removeGalleryImageAction(businessId, imageId);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      setImages((prev) => prev.filter((img) => img.id !== imageId));
    });
  }

  async function handleVideoChange(file: File | null) {
    if (!file) return;
    setIsUploadingVideo(true);

    const formData = new FormData();
    formData.append("file", file);
    const uploadResult = await uploadFileAction(formData);

    if (!uploadResult.success) {
      toast.error(uploadResult.message);
      setIsUploadingVideo(false);
      return;
    }

    const patchResult = await updateBusinessProfileAction(businessId, { introVideoId: uploadResult.fileId });
    setIsUploadingVideo(false);

    if (!patchResult.success) {
      toast.error(patchResult.message);
      return;
    }
    setIntroVideoId(uploadResult.fileId);
    toast.success("ویدیو ذخیره شد");
  }

  return (
    <div dir="rtl" className="space-y-8">
      <div>
        <p className="text-sm font-bold text-neutral-900 mb-3">ویدیو معرفی</p>
        <label className="flex items-center gap-3 border-2 border-dashed border-neutral-300 rounded-xl p-4 cursor-pointer hover:bg-neutral-50">
          <input type="file" accept="video/*" className="hidden" onChange={(e) => handleVideoChange(e.target.files?.[0] ?? null)} />
          <Video className="text-neutral-400 shrink-0" size={22} />
          <span className="text-sm text-neutral-600">
            {isUploadingVideo ? "در حال آپلود..." : introVideoId ? "ویدیو ثبت شده — برای تعویض کلیک کنید" : "برای آپلود یک ویدیوی کوتاه کلیک کنید"}
          </span>
        </label>
      </div>

      <div>
        <p className="text-sm font-bold text-neutral-900 mb-3">تصاویر ({images.length})</p>
        <div className="grid grid-cols-3 gap-2">
          {images.map((img) => (
            <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden border border-neutral-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={fileUrl(img.fileId)} alt={img.title ?? "تصویر گالری"} className="w-full h-full object-cover" />
              <button onClick={() => handleRemoveImage(img.id)} disabled={isUploadingImage} className="absolute top-1 left-1 bg-white/90 rounded-full p-1 text-red-600">
                <Trash2 size={14} />
              </button>
            </div>
          ))}

          <label className="aspect-square rounded-lg border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-neutral-50">
            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleAddImage(e.target.files?.[0] ?? null)} disabled={isUploadingImage} />
            <UploadCloud className="text-neutral-400" size={18} />
            <span className="text-xs text-neutral-500">افزودن</span>
          </label>
        </div>
      </div>
    </div>
  );
}