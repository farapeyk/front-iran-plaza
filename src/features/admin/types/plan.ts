export interface PlanFeatures {
  map: boolean;
  introVideo: boolean;
  branches: boolean;
  workingHours: boolean;
  installments: boolean;
  socialMedia: boolean;
  customFeatures: boolean;
  analytics: boolean;
}

export interface PlanSummary {
  id: string;
  name: string;
  tier: "FREE" | "VIP";
  isTrial?: boolean;
  price: string | number;
  durationDays: number;
  galleryLimit: number;
  productLimit: number;
  serviceLimit: number;
  discountLimit: number;
  priority: number;
  features: PlanFeatures;
  isActive?: boolean;
  createdAt?: string;
}
