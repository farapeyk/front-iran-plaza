"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Trash2, Plus, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  addProductCategoryAction,
  removeProductCategoryAction,
  addProductAction,
  removeProductAction,
} from "@/features/business/actions/products.action";
import { uploadFileAction } from "@/features/business/actions/upload-file.action";
import type { ProductCategoryItem, ProductItem } from "@/features/business/types/business-extras";

export function ProductsManager({
  businessId,
  initialCategories,
  initialProducts,
}: {
  businessId: string;
  initialCategories: ProductCategoryItem[];
  initialProducts: ProductItem[];
}) {
  const [isPending, startTransition] = useTransition();
  const [categories, setCategories] = useState(initialCategories);
  const [products, setProducts] = useState(initialProducts);

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [categoryName, setCategoryName] = useState("");

  const [addingProductFor, setAddingProductFor] = useState<string | null>(null);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState(""); // ✅ اضافه شد
  
  // ✅ استیت‌های مربوط به آپلود تصویر محصول
  const [imageId, setImageId] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!categoryName.trim()) {
      toast.error("نام دسته‌بندی الزامی است");
      return;
    }
    startTransition(async () => {
      const result = await addProductCategoryAction(businessId, { name: categoryName });
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      setCategories((prev) => [...prev, result.data]);
      setCategoryName("");
      setShowAddCategory(false);
    });
  }

  function handleRemoveCategory(categoryId: string) {
    startTransition(async () => {
      const result = await removeProductCategoryAction(businessId, categoryId);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    });
  }

  // ✅ تابع آپلود تصویر محصول
  async function handleImageChange(file: File | null) {
    if (!file) return;
    setIsUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadFileAction(formData);
    setIsUploadingImage(false);
    
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    setImageId(result.fileId);
    toast.success("تصویر محصول آپلود شد");
  }

  function handleAddProduct(e: React.FormEvent, categoryId: string) {
    e.preventDefault();
    if (!productName.trim() || !productPrice) {
      toast.error("نام و قیمت محصول الزامی است");
      return;
    }

    startTransition(async () => {
      const result = await addProductAction(businessId, {
        name: productName,
        price: Number(productPrice),
        productCategoryId: categoryId,
        description: productDescription || undefined, // ✅ ارسال توضیحات به بک‌اند
        imageId: imageId || undefined, 
      });
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      setProducts((prev) => [...prev, result.data]);
      setProductName("");
      setProductPrice("");
      setProductDescription(""); // ✅ ریست کردن فیلد توضیحات
      setImageId(null); 
      setAddingProductFor(null);
      toast.success("محصول اضافه شد");
    });
  }

  function handleRemoveProduct(productId: string) {
    startTransition(async () => {
      const result = await removeProductAction(businessId, productId);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    });
  }

  return (
    <div dir="rtl" className="space-y-5">
      {categories.length === 0 && !showAddCategory && (
        <p className="text-sm text-neutral-500">هنوز دسته‌بندی‌ای نساخته‌اید.</p>
      )}

      {categories.map((cat) => {
        const catProducts = products.filter((p) => p.productCategoryId === cat.id);
        return (
          <div key={cat.id} className="border border-neutral-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold text-neutral-900">{cat.name}</p>
              <button onClick={() => handleRemoveCategory(cat.id)} disabled={isPending} className="text-red-500">
                <Trash2 size={16} />
              </button>
            </div>

            {catProducts.length > 0 && (
              <div className="space-y-2 mb-2">
                {catProducts.map((p) => (
                  <div key={p.id} className="flex items-center justify-between bg-neutral-50 rounded-md px-3 py-2">
                    <div className="flex items-center gap-2">
                      {p.imageId && (
                       <img src={`/api/backend/files/${p.imageId}`} alt={p.name} className="w-10 h-10 rounded object-cover" />
                      )}
                      <div>
                        <p className="text-sm text-neutral-800">{p.name}</p>
                        <p className="text-xs text-neutral-500">{p.price.toLocaleString("fa-IR")} تومان</p>
                      </div>
                    </div>
                    <button onClick={() => handleRemoveProduct(p.id)} disabled={isPending} className="text-red-500">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {addingProductFor === cat.id ? (
              <form onSubmit={(e) => handleAddProduct(e, cat.id)} className="space-y-3 border-t border-neutral-100 pt-3">
                <Input value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="نام محصول" disabled={isPending} />
                
                {/* ✅ فیلد توضیحات محصول اضافه شد */}
                <textarea 
                  value={productDescription} 
                  onChange={(e) => setProductDescription(e.target.value)} 
                  placeholder="توضیحات محصول (اختیاری)" 
                  rows={2} 
                  disabled={isPending} 
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />

                <Input value={productPrice} onChange={(e) => setProductPrice(e.target.value)} placeholder="قیمت (تومان)" inputMode="numeric" dir="ltr" className="text-left" disabled={isPending} />
                
                {/* ✅ بخش آپلود تصویر محصول */}
                <label className="flex items-center gap-3 border border-dashed border-neutral-300 rounded-lg p-2 cursor-pointer hover:bg-neutral-50">
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)} disabled={isPending || isUploadingImage} />
                  <div className="w-10 h-10 rounded bg-neutral-100 shrink-0 flex items-center justify-center text-neutral-400">
                    {imageId ? "✓" : <UploadCloud size={18} />}
                  </div>
                  <span className="text-xs text-neutral-600">
                    {isUploadingImage ? "در حال آپلود..." : imageId ? "تصویر انتخاب شد" : "آپلود تصویر محصول (اختیاری)"}
                  </span>
                </label>

                <div className="flex gap-2">
                  <Button type="submit" size="sm" className="flex-1" disabled={isPending || isUploadingImage}>
                    {isPending ? "در حال ثبت..." : "ثبت محصول"}
                  </Button>
                  <button type="button" onClick={() => { setAddingProductFor(null); setImageId(null); setProductDescription(""); }} className="text-xs text-neutral-500 px-2">
                    انصراف
                  </button>
                </div>
              </form>
            ) : (
              <button onClick={() => { setAddingProductFor(cat.id); setImageId(null); setProductDescription(""); }} className="flex items-center gap-1 text-xs text-emerald-800 font-medium">
                <Plus size={14} />
                افزودن محصول به این دسته
              </button>
            )}
          </div>
        );
      })}

      {showAddCategory ? (
        <form onSubmit={handleAddCategory} className="flex gap-2">
          <Input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="نام دسته‌بندی (مثلاً تخت خواب)" disabled={isPending} className="flex-1" />
          <Button type="submit" disabled={isPending}>ثبت</Button>
          <button type="button" onClick={() => setShowAddCategory(false)} className="text-sm text-neutral-500 px-2">انصراف</button>
        </form>
      ) : (
        <button onClick={() => setShowAddCategory(true)} className="flex items-center gap-1 text-sm text-emerald-800 font-medium">
          <Plus size={16} />
          افزودن دسته‌بندی جدید
        </button>
      )}
    </div>
  );
}