"use client"
import Image from "next/image";

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { DashboardAccountLayout } from "@/design/components/dashboard-account-layout"
import { ImageEditor } from "@/design/components/image-editor"
import { Field } from "@/design/components/ui/field"
import { Button } from "@/design/components/ui/button"
import { addProductAction } from "@/features/business/actions/products.action"
import { uploadFileAction } from "@/features/business/actions/upload-file.action"
import { isFileTooLarge } from "@/lib/validate-file"
import type { ProductCategoryItem } from "@/features/business/types/business-extras"

export function ProductLivePage({businessId,categories}:{businessId:string;categories:ProductCategoryItem[]}) {
  const router=useRouter()
  const [pending,startTransition]=useTransition()
  const [uploading,setUploading]=useState(false)
  const [imageId,setImageId]=useState<string|null>(null)
  const [imageToEdit,setImageToEdit]=useState<File|null>(null)
  const [message,setMessage]=useState("")

  function selectImage(file:File|null) {
    if(!file)return
    if(isFileTooLarge(file,20)) {
      setMessage("حجم تصویر نباید بیشتر از ۲۰ مگابایت باشد.")
      return
    }
    setMessage("")
    setImageToEdit(file)
  }

  async function uploadImage(file:File) {
    setUploading(true)
    const data=new FormData()
    data.set("file",file)
    try {
      const result=await uploadFileAction(data)
      if(result.success) {
        setImageId(result.fileId)
        setImageToEdit(null)
        setMessage("تصویر ویرایش و آپلود شد.")
      } else {
        setMessage(result.message)
        throw new Error(result.message)
      }
    } finally {
      setUploading(false)
    }
  }

  return <DashboardAccountLayout title="افزودن محصول" backTo="/profile/edit/products">
    <form className="design-form space-y-6" onSubmit={event=>{
      event.preventDefault()
      const form=new FormData(event.currentTarget)
      startTransition(async()=>{
        const result=await addProductAction(businessId,{
          name:String(form.get("name")).trim(),
          description:String(form.get("description")).trim()||undefined,
          price:Number(form.get("price")),
          productCategoryId:String(form.get("categoryId"))||undefined,
          imageId:imageId??undefined,
        })
        if(result.success)router.push("/dashboard/business/profile/products")
        else setMessage(result.message)
      })
    }}>
      <label className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center gap-3 rounded-[var(--radius-xs)] border border-dashed bg-[var(--surface)] p-4">
        {imageId?<Image unoptimized src={`/api/backend/files/${encodeURIComponent(imageId)}`} alt="تصویر محصول" width={320} height={180} sizes="320px" className="max-h-[180px] rounded object-contain"/>:<Image src="/design/icons/categories.svg" width={32} height={32} alt=""/>}
        <span>{uploading?"در حال بارگذاری…":imageId?"تغییر تصویر محصول":"انتخاب تصویر محصول"}</span>
        <small className="text-[var(--text-muted)]">پس از انتخاب، امکان کراپ و تنظیم قاب دارید.</small>
        <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={uploading||pending} onChange={event=>{selectImage(event.target.files?.[0]??null);event.currentTarget.value=""}}/>
      </label>

      <ImageEditor file={imageToEdit} title="تنظیم تصویر محصول" initialAspect="square" aspects={["square","portrait","landscape","original"]} maxOutputWidth={1600} onCancel={()=>setImageToEdit(null)} onConfirm={uploadImage}/>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2"><span className="text-lg font-bold">دسته‌بندی</span><select name="categoryId" className="h-14 w-full rounded border px-4"><option value="">بدون دسته‌بندی</option>{categories.map(category=><option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
        <Field label="نام محصول" name="name" required maxLength={180}/>
        <label className="space-y-2 md:col-span-2"><span className="text-lg font-bold">توضیح</span><textarea name="description" maxLength={100} rows={4} className="w-full rounded border p-4"/><span className="text-sm">حداکثر ۱۰۰ کاراکتر</span></label>
        <Field label="قیمت (تومان)" name="price" type="number" required min={0} step="1"/>
      </div>
      {message&&<p role="status">{message}</p>}
      <Button type="submit" disabled={pending||uploading} className="h-12 w-full max-w-md">{pending?"در حال ثبت…":"ثبت محصول"}</Button>
    </form>
  </DashboardAccountLayout>
}
