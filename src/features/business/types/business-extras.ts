export interface BranchLocation {
  id: string;
  businessId: string;
  title: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ServiceItem {
  id: string;
  businessId: string;
  name: string;
  description: string | null;
  priceFrom: number | null;
  priceTo: number | null;
  durationMin: number | null;
  imageId: string | null;
  isActive: boolean;
}

export interface ProductCategoryItem {
  id: string;
  businessId: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
}

export interface ProductItem {
  id: string;
  businessId: string;
  productCategoryId: string | null;
  name: string;
  description: string | null;
  price: number;
  discountPercent: number;
  hasInstallment: boolean;
  imageId: string | null;
  isActive: boolean;
}

export interface InstallmentPlanData {
  minDownPaymentPercent: number;
  monthlyInterestPercent: number;
  repaymentPeriodsMonths: number[];
  guaranteeNote: string | null;
  isActive: boolean;
}

export interface BusinessFeature {
  id: string;
  businessId: string;
  label: string;
  icon: string | null;
  sortOrder: number;
  isActive: boolean;
}
export const REPAYMENT_PERIOD_OPTIONS = [3, 6, 9, 12, 18, 24, 36];