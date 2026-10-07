export interface BusinessCategoryOption { id: string; name: string; parentId?: string | null }

export function categoryOptions(categories: BusinessCategoryOption[]) {
  const byId = new Map(categories.map(category => [category.id, category]));
  return categories.map(category => {
    const names = [category.name];
    const seen = new Set([category.id]);
    let parentId = category.parentId;
    while (parentId && !seen.has(parentId)) {
      seen.add(parentId);
      const parent = byId.get(parentId);
      if (!parent) break;
      names.unshift(parent.name);
      parentId = parent.parentId;
    }
    return { id: category.id, label: names.join(' / ') };
  }).sort((a, b) => a.label.localeCompare(b.label, 'fa'));
}
