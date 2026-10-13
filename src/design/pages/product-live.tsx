"use client";
import {useState,useTransition} from 'react';
import {useRouter} from 'next/navigation';
import {DashboardAccountLayout} from '@/design/components/dashboard-account-layout';
import {Field} from '@/design/components/ui/field';
import {Button} from '@/design/components/ui/button';
import {addProductAction} from '@/features/business/actions/products.action';
import {uploadFileAction} from '@/features/business/actions/upload-file.action';
import type {ProductCategoryItem} from '@/features/business/types/business-extras';
export function ProductLivePage({businessId,categories}:{businessId:string;categories:ProductCategoryItem[]}){
  const router=useRouter();const [pending,startTransition]=useTransition();const [uploading,setUploading]=useState(false);const [imageId,setImageId]=useState<string|null>(null);const [message,setMessage]=useState('');
  return <DashboardAccountLayout title="افزودن محصول" backTo="/profile/edit/products"><form className="design-form space-y-6" onSubmit={event=>{event.preventDefault();const form=new FormData(event.currentTarget);startTransition(async()=>{const result=await addProductAction(businessId,{name:String(form.get('name')).trim(),description:String(form.get('description')).trim()||undefined,price:Number(form.get('price')),productCategoryId:String(form.get('categoryId'))||undefined,imageId:imageId??undefined});if(result.success)router.push('/dashboard/business/profile/products');else setMessage(result.message);});}}>
    <label className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center gap-3 rounded-[var(--radius-xs)] border border-dashed bg-[var(--surface)] p-4">{imageId?<img src={'/api/backend/files/'+encodeURIComponent(imageId)} alt="تصویر محصول" className="max-h-[180px] rounded object-contain"/>:<img src="/design/icons/categories.svg" width={32} height={32} alt=""/>}<span>{uploading?'در حال بارگذاری…':'تصویر محصول'}</span><input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading||pending} onChange={async event=>{const file=event.target.files?.[0];if(!file)return;setUploading(true);const data=new FormData();data.set('file',file);try{const result=await uploadFileAction(data);if(result.success)setImageId(result.fileId);else setMessage(result.message);}finally{setUploading(false);}}}/></label>
    <div className="grid gap-5 md:grid-cols-2"><label className="space-y-2"><span className="text-lg font-bold">دسته‌بندی</span><select name="categoryId" className="h-14 w-full rounded border px-4"><option value="">بدون دسته‌بندی</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label><Field label="نام محصول" name="name" required maxLength={180}/><label className="space-y-2 md:col-span-2"><span className="text-lg font-bold">توضیح</span><textarea name="description" maxLength={100} rows={4} className="w-full rounded border p-4"/><span className="text-sm">حداکثر ۱۰۰ کاراکتر</span></label><Field label="قیمت (تومان)" name="price" type="number" required min={0} step="1"/></div>
    {message&&<p role="status">{message}</p>}<Button type="submit" disabled={pending||uploading} className="h-12 w-full max-w-md">{pending?'در حال ثبت…':'ثبت محصول'}</Button>
  </form></DashboardAccountLayout>;
}
