import { z } from 'zod';

const id = z.string().regex(/^[A-Za-z0-9_-]{1,100}$/);
const text = z.string().trim().min(1).max(10000);
const optionalText = z.string().max(10000).optional();
const empty = z.object({}).strict();
const reason = z.object({ reason: text.max(1000) }).strict();
const hour = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).nullable();
const weekday = z.enum(['SATURDAY', 'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']);
const workingHour = z.object({
  id: id.optional(), businessId: id.optional(), weekday, isTwoShift: z.boolean(),
  openTime1: hour, closeTime1: hour, openTime2: hour, closeTime2: hour,
}).strict().refine(h => (!h.openTime1 && !h.closeTime1 && !h.isTwoShift && !h.openTime2 && !h.closeTime2) ||
  (!!h.openTime1 && !!h.closeTime1 && h.openTime1 < h.closeTime1 &&
    (!h.isTwoShift ? !h.openTime2 && !h.closeTime2 : !!h.openTime2 && !!h.closeTime2 && h.closeTime1 <= h.openTime2 && h.openTime2 < h.closeTime2)), 'ساعات کاری معتبر نیست.');

export const profilePatchSchema = z.object({
  name: text.max(150).optional(), description: z.string().max(100).optional(), aboutText: optionalText,
  phone: text.max(30).optional(), phone2: z.string().max(30).nullable().optional(), whatsapp: z.string().max(30).nullable().optional(),
  city: text.max(150).optional(), address: z.string().max(1000).optional(), neighborhood: z.string().max(100).optional(),
  latitude: z.number().min(-90).max(90).optional(), longitude: z.number().min(-180).max(180).optional(),
  logoId: id.nullable().optional(), introVideoId: id.nullable().optional(), categoryIds: z.array(id).min(1).max(20).optional(),
  socialMedia: z.object({ instagram: optionalText, telegram: optionalText, whatsapp: optionalText, website: optionalText }).strict().optional(),
}).strict().refine(value => Object.keys(value).length > 0, 'هیچ فیلدی برای ذخیره ارسال نشده است.');

const schemas: Record<string, z.ZodType> = {
  'POST businesses': z.object({ name: text.max(150), phone: text.max(30), city: text, categoryIds: z.array(id).min(1), description: z.string().max(100).optional(), address: text, businessType: z.enum(['SOLE_PROPRIETOR','COMPANY','BRANCH']) }).strict(),
  'PATCH businesses/id': profilePatchSchema,
  'POST businesses/id/documents': z.object({ type: z.enum(['NATIONAL_ID_FRONT','NATIONAL_ID_BACK','BUSINESS_LICENSE_PHOTO']), fileId: id, companyName: optionalText, licenseNumber: optionalText, unionCode: optionalText, issueDate: z.union([z.iso.date(), z.iso.datetime({ offset: true })]).optional() }).strict(),
  'POST businesses/id/onboarding/advance': z.object({ step: z.number().int().min(0).max(10) }).strict(),
  'POST businesses/id/gallery': z.object({ fileId: id, title: z.string().max(200).optional() }).strict(),
  'POST businesses/id/features': z.object({ label: text.max(100) }).strict(),
  'POST businesses/id/branches': z.object({ title: text.max(200), address: text.max(1000), latitude: z.number().min(-90).max(90).optional(), longitude: z.number().min(-180).max(180).optional(), phone: z.string().max(30).optional(), isPrimary: z.boolean().optional() }).strict(),
  'POST businesses/id/services': z.object({ name: text.max(200), description: optionalText, priceFrom: z.number().nonnegative().optional(), priceTo: z.number().nonnegative().optional(), durationMin: z.number().int().positive().optional() }).strict().refine(s => s.priceFrom === undefined || s.priceTo === undefined || s.priceFrom <= s.priceTo, 'بازه قیمت معتبر نیست.'),
  'POST businesses/id/product-categories': z.object({ name: text.max(100) }).strict(),
  'POST businesses/id/products': z.object({ name: text.max(200), productCategoryId: id.optional(), price: z.number().nonnegative(), description: optionalText, discountPercent: z.number().int().min(0).max(100).optional(), hasInstallment: z.boolean().optional(), imageId: id.optional() }).strict(),
  'PATCH businesses/id/installment-plan': z.object({ minDownPaymentPercent: z.number().int().min(0).max(100), monthlyInterestPercent: z.number().nonnegative(), repaymentPeriodsMonths: z.array(z.number().int().positive()).max(24), guaranteeNote: optionalText, isActive: z.boolean() }).strict(),
  'PATCH businesses/id/working-hours': z.object({ hours: z.array(workingHour).max(7).refine(hours => new Set(hours.map(h => h.weekday)).size === hours.length, 'روز تکراری است.') }).strict(),
  'POST businesses/id/reviews': z.object({ rating: z.number().int().min(1).max(5), comment: z.string().max(5000).optional() }).strict(),
  'POST reviews/id/replies': z.object({ comment: text.max(5000) }).strict(),
  'POST admin/categories': z.object({ name: text.max(150), parentId: id.optional(), icon: z.string().max(100).optional() }).strict(),
  'PATCH admin/categories/id': z.object({ name: text.max(150).optional(), parentId: id.nullable().optional(), icon: z.string().max(100).optional(), isActive: z.boolean().optional(), sortOrder: z.number().int().optional() }).strict(),
  'PATCH admin/reviews/id': z.object({ status: z.enum(['PENDING','APPROVED','REJECTED']) }).strict(),
  'PATCH admin/businesses/id/plan': z.object({ planId: id }).strict(),
  'POST admin/businesses': z.object({ ownerPhone: z.string().regex(/^09\d{9}$/), ownerFullName: optionalText, ownerNationalCode: z.string().regex(/^\d{10}$/).optional(), name: text.max(150), phone: text.max(30), description: optionalText, address: optionalText, businessType: z.enum(['SOLE_PROPRIETOR','COMPANY','BRANCH']).optional(), registrationType: z.enum(['IN_PERSON','TELEPHONE']) }).strict(),
  'PATCH users/me': z.object({ fullName: text.max(200).optional(), fatherName: optionalText, nationalCode: z.string().regex(/^\d{10}$/).optional(), email: z.union([z.email(), z.literal('')]).optional(), birthDate: z.iso.datetime().optional(), gender: z.enum(['MALE','FEMALE','OTHER']).optional(), province: text.optional(), city: text.optional() }).strict(),
};
const noBody = new Set(['POST businesses/id/favorite','POST businesses/id/approve','POST admin/documents/id/approve','PATCH admin/users/id/reinstate','PATCH admin/businesses/id/plan/downgrade','PATCH notifications/id/read','POST auth/logout']);
const withReason = new Set(['POST businesses/id/reject','POST businesses/id/suspend','POST admin/documents/id/reject','PATCH admin/users/id/suspend']);
const resourceRoots = new Set(['businesses','reviews','notifications','users','documents','categories']);
const resourceCollections = new Set(['gallery','features','branches','services','products','product-categories']);

/** Validates the path before normalization and the payload against consumed DTO fields. */
export function validateMutation(path: string, method: string, body: unknown): string | null {
  if (!path.startsWith('/api/') || /[?#%\\]/.test(path)) return 'مسیر درخواست معتبر نیست.';
  const parts = path.slice(5).split('/');
  if (parts.some(p => !id.safeParse(p).success)) return 'شناسه یا مسیر درخواست معتبر نیست.';
  const normalized = parts.map((part, i) => {
    const previous = parts[i-1];
    if (previous && (resourceRoots.has(previous) || resourceCollections.has(previous)) &&
        !(i === 1 && part === 'me') && !(previous === 'businesses' && i === 1 && part === 'mine')) return 'id';
    return part;
  }).join('/');
  const key = method + ' ' + normalized;
  let schema = schemas[key];
  if (withReason.has(key)) schema = reason;
  if (noBody.has(key)) schema = empty;
  if (method === 'DELETE' && /^(businesses\/id\/(gallery|features|branches|services|products|product-categories)\/id|admin\/(categories|reviews)\/id)$/.test(normalized)) schema = empty;
  if (!schema) return 'این عملیات پشتیبانی نمی‌شود.';
  const result = schema.safeParse(body ?? {});
  return result.success ? null : 'اطلاعات ارسالی معتبر نیست: ' + result.error.issues[0].message;
}
