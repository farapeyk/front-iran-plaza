"use client";
import { useProfileBusy } from "./onboarding-context";

import Image from "next/image";
import Link from 'next/link';
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, UploadCloud } from "lucide-react";
import { Button } from "@/design/components/ui/button";
import { Input } from "@/design/components/ui/input";
import { ImageEditor } from "@/design/components/image-editor";
import {
  addProductCategoryAction,
  removeProductCategoryAction,
  addProductAction,
  updateProductAction,
  removeProductAction,
} from "@/features/business/actions/products.action";
import { uploadFileAction } from "@/features/business/actions/upload-file.action";
import type { ProductCategoryItem, ProductItem } from "@/features/business/types/business-extras";
import { getUncategorizedProducts } from "@/features/business/lib/product-categories";
import { isFileTooLarge } from "@/lib/validate-file";

type EditingProduct = {
  id: string;
  name: string;
  description: string;
  price: string;
  productCategoryId: string;
};

export function ProductsManager({
  businessId,
  initialCategories,
  initialProducts,
  showProductPageLink = true,
}: {
  businessId: string;
  initialCategories: ProductCategoryItem[];
  initialProducts: ProductItem[];
  showProductPageLink?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  useProfileBusy(isPending);
  const [categories, setCategories] = useState(initialCategories);
  const [products, setProducts] = useState(initialProducts);

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [categoryName, setCategoryName] = useState("");

  const [addingProductFor, setAddingProductFor] = useState<string | null>(null);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState(""); // ✅ اضافه شد
  const [editingProduct, setEditingProduct] = useState<EditingProduct | null>(null);
  
  // ✅ استیت‌های مربوط به آپلود تصویر محصول
  const [imageId, setImageId] = useState<string | null>(null);
  const [imageToEdit, setImageToEdit] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  useProfileBusy(isUploadingImage);

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
    setImageToEdit(null);
    toast.success("تصویر محصول آپلود شد");
  }

  function selectProductImage(file: File | null) {
    if (!file) return;
    if (isFileTooLarge(file, 20)) {
      toast.error("حجم تصویر نباید بیشتر از ۲۰ مگابایت باشد");
      return;
    }
    setImageToEdit(file);
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

  function beginEditProduct(product: ProductItem) {
    setAddingProductFor(null);
    setEditingProduct({
      id: product.id,
      name: product.name,
      description: product.description ?? "",
      price: String(product.price),
      productCategoryId: product.productCategoryId ?? "",
    });
  }

  function handleUpdateProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!editingProduct) return;
    if (!editingProduct.name.trim() || !editingProduct.price) {
      toast.error("نام و قیمت محصول الزامی است");
      return;
    }
    if (!editingProduct.productCategoryId) {
      toast.error("انتخاب زیر‌دسته محصول الزامی است");
      return;
    }

    startTransition(async () => {
      const result = await updateProductAction(businessId, editingProduct.id, {
        name: editingProduct.name.trim(),
        price: Number(editingProduct.price),
        productCategoryId: editingProduct.productCategoryId,
        description: editingProduct.description.trim(),
      });
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      setProducts((prev) =>
        prev.map((product) =>
          product.id === editingProduct.id ? result.data : product,
        ),
      );
      setEditingProduct(null);
      toast.success("محصول ویرایش شد");
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
      if (editingProduct?.id === productId) setEditingProduct(null);
    });
  }

  const uncategorizedProducts = getUncategorizedProducts(products, categories);

  function renderProduct(product: ProductItem) {
    if (editingProduct?.id === product.id) {
      return (
        <form
          key={product.id}
          onSubmit={handleUpdateProduct}
          className="space-y-3 rounded-md border border-primary-200 bg-primary-50/40 p-3"
        >
          <Input
            value={editingProduct.name}
            onChange={(e) => setEditingProduct((current) => current ? { ...current, name: e.target.value } : current)}
            placeholder="نام محصول"
            required
            disabled={isPending}
          />
          <textarea
            value={editingProduct.description}
            onChange={(e) => setEditingProduct((current) => current ? { ...current, description: e.target.value } : current)}
            placeholder="توضیحات محصول (اختیاری)"
            maxLength={100}
            rows={2}
            disabled={isPending}
            className="w-full rounded-md border border-input bg-[var(--surface)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Input
            value={editingProduct.price}
            onChange={(e) => setEditingProduct((current) => current ? { ...current, price: e.target.value } : current)}
            placeholder="قیمت (تومان)"
            type="number"
            min={0}
            step={1}
            required
            dir="ltr"
            className="text-left"
            disabled={isPending}
          />
          <select
            value={editingProduct.productCategoryId}
            onChange={(e) => setEditingProduct((current) => current ? { ...current, productCategoryId: e.target.value } : current)}
            required
            disabled={isPending}
            aria-label="زیر‌دسته محصول"
            className="h-14 w-full rounded-md border border-input bg-[var(--surface)] px-3 text-sm"
          >
            <option value="" disabled>یک زیر‌دسته انتخاب کنید</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={isPending || categories.length === 0}>
              {isPending ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => setEditingProduct(null)} disabled={isPending}>
              انصراف
            </Button>
          </div>
        </form>
      );
    }

    return (
      <div key={product.id} className="flex items-center justify-between gap-3 rounded-md bg-neutral-50 px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          {product.imageId && (
            <Image unoptimized width={64} height={64} src={`/api/backend/files/${product.imageId}`} alt={product.name} className="h-10 w-10 shrink-0 rounded object-cover" />
          )}
          <div className="min-w-0">
            <p className="truncate text-sm text-neutral-800">{product.name}</p>
            <p className="text-xs text-neutral-500">{Number(product.price).toLocaleString("fa-IR")} تومان</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button type="button" onClick={() => beginEditProduct(product)} disabled={isPending} className="rounded p-2 text-primary-700 hover:bg-primary-100" aria-label={`ویرایش ${product.name}`}>
            <Pencil size={15} />
          </button>
          <button type="button" onClick={() => handleRemoveProduct(product.id)} disabled={isPending} className="rounded p-2 text-red-500 hover:bg-red-50" aria-label={`حذف ${product.name}`}>
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="space-y-5">
      {showProductPageLink && <Link href="/dashboard/business/profile/products/new" className="inline-flex rounded-md bg-primary-700 px-5 py-3 text-white">افزودن محصول جدید</Link>}
      {uncategorizedProducts.length > 0 && (
        <section className="space-y-3 rounded-lg border border-amber-300 bg-amber-50 p-3" aria-labelledby="uncategorized-products-title">
          <div>
            <h2 id="uncategorized-products-title" className="font-bold text-amber-950">محصولات بدون زیر‌دسته</h2>
            <p className="mt-1 text-sm text-amber-800">این محصولات قدیمی همچنان قابل مشاهده‌اند؛ آن‌ها را ویرایش و به یک زیر‌دسته منتقل کنید یا حذفشان کنید.</p>
          </div>
          <div className="space-y-2">
            {uncategorizedProducts.map(renderProduct)}
          </div>
        </section>
      )}
      {categories.length === 0 && !showAddCategory && (
        <p className="text-sm text-neutral-500">هنوز زیر‌دسته‌ای برای محصولات نساخته‌اید. ابتدا یک زیر‌دسته ایجاد کنید.</p>
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
                {catProducts.map(renderProduct)}
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
                  <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => { selectProductImage(e.target.files?.[0] ?? null); e.currentTarget.value = ""; }} disabled={isPending || isUploadingImage} />
                  <div className="w-10 h-10 rounded bg-neutral-100 shrink-0 flex items-center justify-center text-neutral-400">
                    {imageId ? "✓" : <UploadCloud size={18} />}
                  </div>
                  <span className="text-xs text-neutral-600">
                    {isUploadingImage ? "در حال آپلود..." : imageId ? "تصویر انتخاب شد" : "آپلود تصویر محصول (اختیاری)"}
                  </span>
                </label>
                <p className="text-xs text-neutral-500">پیش از آپلود می‌توانید قاب و برش تصویر محصول را تنظیم کنید.</p>

                <ImageEditor file={imageToEdit} title="تنظیم تصویر محصول" initialAspect="square" aspects={["square","portrait","landscape","original"]} maxOutputWidth={1600} onCancel={()=>setImageToEdit(null)} onConfirm={handleImageChange} />

                <div className="flex gap-2">
                  <Button type="submit" size="sm" className="flex-1" disabled={isPending || isUploadingImage}>
                    {isPending ? "در حال ثبت..." : "ثبت محصول"}
                  </Button>
                  <button type="button" onClick={() => { setAddingProductFor(null); setImageId(null); setImageToEdit(null); setProductDescription(""); }} className="text-xs text-neutral-500 px-2">
                    انصراف
                  </button>
                </div>
              </form>
            ) : (
              <button onClick={() => { setEditingProduct(null); setAddingProductFor(cat.id); setImageId(null); setImageToEdit(null); setProductDescription(""); }} className="flex items-center gap-1 text-xs text-emerald-800 font-medium">
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
