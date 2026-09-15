export interface BusinessFeature {
  id: string;
  businessId?: string;
  label: string;
  icon: string | null;
  sortOrder: number;
  isActive: boolean;
}