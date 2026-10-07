import { backendGet, BackendError } from '@/lib/api/backend-get';
import type { PlanSummary } from '../types/plan';
import type { BusinessDocumentData } from '../components/document-review-card';
import type { BusinessProfile, GalleryImageData, WorkingHoursEntry } from '@/features/business/types/business-profile';
import type { BranchLocation, BusinessFeature, InstallmentPlanData, ProductCategoryItem, ProductItem, ServiceItem } from '@/features/business/types/business-extras';

export type AdminBusinessDetail = Pick<BusinessProfile, 'id' | 'name' | 'phone' | 'status'> & Partial<BusinessProfile> & {
  address?: string | null; city?: string; neighborhood?: string | null; website?: string | null;
  latitude?: number | null; longitude?: number | null; aboutAudioId?: string | null;
  planType?: string; createdAt?: string;
  documents?: BusinessDocumentData[];
  gallery?: GalleryImageData[]; features?: BusinessFeature[]; branches?: BranchLocation[];
  services?: ServiceItem[]; productCategories?: ProductCategoryItem[]; products?: ProductItem[];
  workingHours?: WorkingHoursEntry[]; installmentPlan?: InstallmentPlanData | null;
};

/** Only a missing primary business can produce the page's 404. */
export async function getAdminBusinessDetail(id: string, token: string) {
  if (!/^[A-Za-z0-9_-]{1,100}$/.test(id)) throw new BackendError(404);
  const path = '/api/businesses/' + encodeURIComponent(id);
  const business = await backendGet<AdminBusinessDetail>(path, token);
  if (!business || business.id !== id) throw new BackendError(502);
  const unavailable: string[] = [];

  async function collection<T>(key: string, embedded?: T[]): Promise<T[]> {
    if (Array.isArray(embedded)) return embedded;
    try {
      const data = await backendGet<unknown>(path + '/' + key, token);
      if (!Array.isArray(data)) throw new BackendError(502);
      return data as T[];
    } catch (error) {
      if (error instanceof BackendError && [401, 403].includes(error.status)) throw error;
      unavailable.push(key);
      return [];
    }
  }
  async function plans(): Promise<PlanSummary[]> {
    try {
      // Include the current session even when this endpoint is public on some deployments.
      const data = await backendGet<unknown>('/api/plans', token);
      if (!Array.isArray(data)) throw new BackendError(502);
      return data as PlanSummary[];
    } catch {
      unavailable.push('plans');
      return [];
    }
  }
  async function installment(): Promise<InstallmentPlanData | null> {
    if (business.installmentPlan !== undefined) return business.installmentPlan;
    try { return await backendGet<InstallmentPlanData | null>(path + '/installment-plan', token); }
    catch (error) {
      if (error instanceof BackendError && [401, 403].includes(error.status)) throw error;
      if (!(error instanceof BackendError && error.status === 404)) unavailable.push('installment-plan');
      return null;
    }
  }
  const [documents, gallery, features, branches, services, productCategories, products, workingHours, installmentPlan, planOptions] = await Promise.all([
    collection<BusinessDocumentData>('documents', business.documents),
    collection<GalleryImageData>('gallery', business.gallery),
    collection<BusinessFeature>('features', business.features),
    collection<BranchLocation>('branches', business.branches),
    collection<ServiceItem>('services', business.services),
    collection<ProductCategoryItem>('product-categories', business.productCategories),
    collection<ProductItem>('products', business.products),
    collection<WorkingHoursEntry>('working-hours', business.workingHours),
    installment(), plans(),
  ]);
  return {
    business: { ...business, documents, gallery, features, branches, services, productCategories, products, workingHours, installmentPlan },
    plans: planOptions, unavailable,
  };
}
