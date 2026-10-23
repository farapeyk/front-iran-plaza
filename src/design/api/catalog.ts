"use client";
import { useEffect, useState } from 'react';
import { categoriesControllerGetCategories, businessControllerListPublic } from './generated/browser';
import type { CategorySummary, PublicBusinessSummary } from '@/features/public/types/public-business';
import { businessCard } from './business';
import { homeCategories as icons } from '@/design/data/home-categories';
export function decodeBusinesses(data: unknown): PublicBusinessSummary[] {
  if (!Array.isArray(data)) throw new Error('Invalid business list');
  return data.map(item => {
    if (!item || typeof item !== 'object' || typeof item.id !== 'string' || typeof item.slug !== 'string' || typeof item.name !== 'string' || typeof item.phone !== 'string') throw new Error('Invalid business response');
    return item as PublicBusinessSummary;
  });
}
export function useCategories() {
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [error, setError] = useState('');
  useEffect(() => { const controller = new AbortController(); categoriesControllerGetCategories({signal:controller.signal}).then(setCategories).catch(() => { if(!controller.signal.aborted) setError('دریافت دسته‌بندی‌ها انجام نشد.'); }); return () => controller.abort(); }, []);
  const cards = categories.filter(c => !c.parentId).map(c => ({ id: c.id, label: c.name, icon: c.icon || icons.find(icon => icon.label === c.name)?.icon || '/design/icons/categories.svg', href: '/businesses?categoryId=' + encodeURIComponent(c.id) }));
  return {categories, cards, error};
}
export function useNewMembers(categoryId?: string, excludeBusinessId?: string) {
  const [items, setItems] = useState<ReturnType<typeof businessCard>[]>([]);
  const [error, setError] = useState('');
  useEffect(() => { const controller = new AbortController(); businessControllerListPublic({page:1,limit:12,categoryId}, {signal:controller.signal}).then(result => setItems(decodeBusinesses(result.data).filter(item=>item.id!==excludeBusinessId).map(businessCard))).catch(() => {if(!controller.signal.aborted) setError('دریافت کسب‌وکارها انجام نشد.');}); return () => controller.abort(); }, [categoryId, excludeBusinessId]);
  return {items,error};
}
