"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";
import { createCategoryAction, updateCategoryAction, deleteCategoryAction } from "@/features/admin/actions/categories.action";

export interface AdminCategoryItem {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  icon: string | null;
  isActive: boolean;
  sortOrder: number;
}

function CategoryRow({ category, allCategories }: { category: AdminCategoryItem; allCategories: AdminCategoryItem[] }) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(category.name);
  const parent = allCategories.find((c) => c.id === category.parentId);

  function handleRename() {
    if (name === category.name) return;
    startTransition(async () => {
      const result = await updateCategoryAction(category.id, { name });
      if (!result.success) toast.error(result.message);
      else toast.success("ذخیره شد");
    });
  }

  function handleToggleActive() {
    startTransition(async () => {
      const result = await updateCategoryAction(category.id, { isActive: !category.isActive });
      if (!result.success) toast.error(result.message);
    });
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteCategoryAction(category.id);
      if (!result.success) toast.error(result.message);
      else toast.success("حذف شد");
    });
  }

  return (
    <div className="flex items-center gap-3 border-b border-neutral-100 py-2.5 last:border-0">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={handleRename}
        disabled={isPending}
        className="flex-1 h-8 rounded-md border border-transparent hover:border-neutral-200 focus:border-neutral-300 px-2 text-sm bg-transparent focus:outline-none"
      />
      {parent && <span className="text-xs text-neutral-400 shrink-0">زیرمجموعه‌ی {parent.name}</span>}
      <label className="flex items-center gap-1.5 text-xs text-neutral-500 shrink-0">
        <input type="checkbox" checked={category.isActive} onChange={handleToggleActive} disabled={isPending} />
        فعال
      </label>
      <button onClick={handleDelete} disabled={isPending} className="text-red-500 shrink-0">
        <Trash2 size={16} />
      </button>
    </div>
  );
}

export function CategoryManager({ initialCategories }: { initialCategories: AdminCategoryItem[] }) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("نام دسته‌بندی الزامی است");
      return;
    }
    startTransition(async () => {
      const result = await createCategoryAction({ name, parentId: parentId || undefined });
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      setName("");
      setParentId("");
      setShowAdd(false);
      toast.success("دسته‌بندی اضافه شد");
    });
  }

  return (
    <div dir="rtl">
      <div className="bg-white border border-neutral-200 rounded-lg p-2 divide-y divide-neutral-100">
        {initialCategories.length === 0 ? (
          <p className="text-sm text-neutral-500 p-3">دسته‌بندی‌ای وجود ندارد.</p>
        ) : (
          initialCategories.map((c) => <CategoryRow key={c.id} category={c} allCategories={initialCategories} />)
        )}
      </div>

      {showAdd ? (
        <form onSubmit={handleAdd} className="flex gap-2 mt-4">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="نام دسته‌بندی جدید" disabled={isPending} className="flex-1 h-10 rounded-md border border-neutral-200 px-3 text-sm" />
          <select value={parentId} onChange={(e) => setParentId(e.target.value)} disabled={isPending} className="h-10 rounded-md border border-neutral-200 px-3 text-sm">
            <option value="">بدون والد (ریشه)</option>
            {initialCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <button type="submit" disabled={isPending} className="h-10 px-4 rounded-md bg-emerald-950 text-white text-sm">
            ثبت
          </button>
          <button type="button" onClick={() => setShowAdd(false)} className="text-sm text-neutral-500 px-2">
            انصراف
          </button>
        </form>
      ) : (
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-1 text-sm text-emerald-800 font-medium mt-4">
          <Plus size={16} />
          افزودن دسته‌بندی جدید
        </button>
      )}
    </div>
  );
}