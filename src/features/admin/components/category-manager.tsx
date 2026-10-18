"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { ChevronDown, Plus, Search, Shapes, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { CategoryIcon } from "@/components/category-icon";
import { categoryIconOptions } from "@/lib/category-icons";
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

interface CategoryIconPickerProps {
  value: string | null;
  onChange: (value: string) => void;
  disabled?: boolean;
  compact?: boolean;
}

function CategoryIconPicker({ value, onChange, disabled = false, compact = false }: CategoryIconPickerProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [query, setQuery] = useState("");
  const selected = categoryIconOptions.find((option) => option.name === value);
  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("fa");
    if (!normalizedQuery) return categoryIconOptions;
    return categoryIconOptions.filter((option) =>
      `${option.label} ${option.name} ${option.keywords}`.toLocaleLowerCase("fa").includes(normalizedQuery),
    );
  }, [query]);

  function selectIcon(name: string) {
    onChange(name);
    if (detailsRef.current) detailsRef.current.open = false;
    setQuery("");
  }

  return (
    <details ref={detailsRef} className="group relative shrink-0">
      <summary
        onClick={(event) => {
          if (disabled) event.preventDefault();
        }}
        aria-label="انتخاب آیکن دسته‌بندی"
        className={`flex h-10 cursor-pointer list-none items-center justify-between gap-2 rounded-md border border-neutral-200 bg-white px-3 text-sm text-neutral-700 transition hover:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 [&::-webkit-details-marker]:hidden ${
          compact ? "w-40" : "w-full sm:w-52"
        } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
      >
        <span className="flex min-w-0 items-center gap-2">
          {selected ? (
            <CategoryIcon value={selected.name} className="size-5 shrink-0 text-emerald-800" width={20} height={20} />
          ) : (
            <Shapes className="size-5 shrink-0 text-neutral-400" />
          )}
          <span className="truncate">{selected?.label ?? "انتخاب آیکن"}</span>
        </span>
        <ChevronDown className="size-4 shrink-0 transition-transform group-open:rotate-180" />
      </summary>

      <div className="absolute left-0 top-12 z-30 w-[min(22rem,calc(100vw-2rem))] rounded-xl border border-neutral-200 bg-white p-3 shadow-xl">
        <label className="mb-3 flex h-9 items-center gap-2 rounded-md border border-neutral-200 px-2 text-neutral-500 focus-within:border-emerald-700">
          <Search className="size-4 shrink-0" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="جست‌وجوی آیکن..."
            className="min-w-0 flex-1 bg-transparent text-sm text-neutral-800 outline-none"
          />
        </label>
        <div className="grid max-h-64 grid-cols-5 gap-1 overflow-y-auto pe-1 sm:grid-cols-6">
          {filteredOptions.map((option) => (
            <button
              key={option.name}
              type="button"
              title={option.label}
              aria-label={option.label}
              aria-pressed={value === option.name}
              onClick={() => selectIcon(option.name)}
              className={`flex aspect-square items-center justify-center rounded-lg border transition ${
                value === option.name
                  ? "border-emerald-800 bg-emerald-50 text-emerald-900"
                  : "border-transparent text-neutral-600 hover:border-neutral-200 hover:bg-neutral-50"
              }`}
            >
              <option.Icon className="size-5" />
            </button>
          ))}
        </div>
        {filteredOptions.length === 0 && (
          <p className="py-5 text-center text-sm text-neutral-500">آیکنی پیدا نشد.</p>
        )}
      </div>
    </details>
  );
}

function CategoryRow({ category, allCategories }: { category: AdminCategoryItem; allCategories: AdminCategoryItem[] }) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(category.name);
  const [icon, setIcon] = useState(category.icon);
  const parent = allCategories.find((item) => item.id === category.parentId);

  function handleRename() {
    const trimmedName = name.trim();
    if (!trimmedName || trimmedName === category.name) return;
    startTransition(async () => {
      const result = await updateCategoryAction(category.id, { name: trimmedName });
      if (!result.success) toast.error(result.message);
      else toast.success("نام دسته‌بندی ذخیره شد");
    });
  }

  function handleIconChange(nextIcon: string) {
    if (nextIcon === icon) return;
    const previousIcon = icon;
    setIcon(nextIcon);
    startTransition(async () => {
      const result = await updateCategoryAction(category.id, { icon: nextIcon });
      if (!result.success) {
        setIcon(previousIcon);
        toast.error(result.message);
      } else {
        toast.success("آیکن دسته‌بندی ذخیره شد");
      }
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
      else toast.success("دسته‌بندی حذف شد");
    });
  }

  return (
    <div className="flex flex-col gap-3 border-b border-neutral-100 py-3 last:border-0 sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          onBlur={handleRename}
          disabled={isPending}
          aria-label={`نام دسته‌بندی ${category.name}`}
          className="h-9 w-full rounded-md border border-transparent bg-transparent px-2 text-sm outline-none hover:border-neutral-200 focus:border-neutral-300"
        />
        {parent && <p className="px-2 text-xs text-neutral-400">زیرمجموعه‌ی {parent.name}</p>}
      </div>
      <CategoryIconPicker value={icon} onChange={handleIconChange} disabled={isPending} compact />
      <div className="flex items-center justify-between gap-4 sm:justify-start">
        <label className="flex shrink-0 items-center gap-1.5 text-xs text-neutral-500">
          <input type="checkbox" checked={category.isActive} onChange={handleToggleActive} disabled={isPending} />
          فعال
        </label>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          aria-label={`حذف ${category.name}`}
          className="shrink-0 rounded-md p-2 text-red-500 transition hover:bg-red-50 disabled:opacity-50"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export function CategoryManager({ initialCategories }: { initialCategories: AdminCategoryItem[] }) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const [icon, setIcon] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  function handleAdd(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      toast.error("نام دسته‌بندی الزامی است");
      return;
    }
    startTransition(async () => {
      const result = await createCategoryAction({
        name: name.trim(),
        parentId: parentId || undefined,
        icon: icon || undefined,
      });
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      setName("");
      setParentId("");
      setIcon(null);
      setShowAdd(false);
      toast.success("دسته‌بندی اضافه شد");
    });
  }

  return (
    <div dir="rtl">
      <div className="divide-y divide-neutral-100 rounded-lg border border-neutral-200 bg-white p-2">
        {initialCategories.length === 0 ? (
          <p className="p-3 text-sm text-neutral-500">دسته‌بندی‌ای وجود ندارد.</p>
        ) : (
          initialCategories.map((category) => (
            <CategoryRow key={category.id} category={category} allCategories={initialCategories} />
          ))
        )}
      </div>

      {showAdd ? (
        <form onSubmit={handleAdd} className="mt-4 grid gap-2 rounded-lg border border-neutral-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(12rem,0.7fr)_minmax(13rem,0.7fr)_auto_auto]">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="نام دسته‌بندی جدید"
            disabled={isPending}
            className="h-10 rounded-md border border-neutral-200 px-3 text-sm outline-none focus:border-emerald-700"
          />
          <select
            value={parentId}
            onChange={(event) => setParentId(event.target.value)}
            disabled={isPending}
            aria-label="دسته‌بندی والد"
            className="h-10 rounded-md border border-neutral-200 px-3 text-sm outline-none focus:border-emerald-700"
          >
            <option value="">بدون والد (ریشه)</option>
            {initialCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <CategoryIconPicker value={icon} onChange={setIcon} disabled={isPending} />
          <button type="submit" disabled={isPending} className="h-10 rounded-md bg-emerald-950 px-4 text-sm text-white disabled:opacity-60">
            ثبت
          </button>
          <button type="button" onClick={() => setShowAdd(false)} disabled={isPending} className="h-10 px-2 text-sm text-neutral-500">
            انصراف
          </button>
        </form>
      ) : (
        <button onClick={() => setShowAdd(true)} className="mt-4 flex items-center gap-1 text-sm font-medium text-emerald-800">
          <Plus size={16} />
          افزودن دسته‌بندی جدید
        </button>
      )}
    </div>
  );
}
