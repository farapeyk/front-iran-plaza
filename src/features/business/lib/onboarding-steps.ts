export const PROFILE_STEPS = [
  { key: 'basic', title: 'نام، بیوگرافی، لوگو و دسته‌بندی', important: true, collection: false },
  { key: 'contact', title: 'تماس و واتساپ', important: true, collection: false },
  { key: 'features', title: 'امکانات', important: true, collection: true },
  { key: 'address', title: 'آدرس و لوکیشن', important: true, collection: false },
  { key: 'gallery', title: 'گالری تصاویر و ویدیو', important: true, collection: true },
  { key: 'social', title: 'شبکه‌های اجتماعی', important: true, collection: false },
  { key: 'services', title: 'خدمات', important: false, collection: true },
  { key: 'products', title: 'محصولات', important: false, collection: true },
  { key: 'about', title: 'درباره ما', important: false, collection: false },
  { key: 'hours', title: 'ساعات کاری', important: false, collection: false },
  { key: 'installment', title: 'شرایط اقساط', important: false, collection: false },
] as const;

export function profileStepUrl(step: number) {
  return step >= PROFILE_STEPS.length ? '/dashboard/business/profile' : `/dashboard/business/profile/${PROFILE_STEPS[Math.max(0, step)].key}`;
}
