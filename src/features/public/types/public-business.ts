export interface PublicBusinessSummary {
  id: string;
  slug: string;
  name: string;
  logoId: string | null;
  description: string | null;
  phone: string;
  address: string | null;
  city?: string | null;
  neighborhood?: string | null;
  planType?: "FREE" | "VIP";
  hasInstallment?: boolean;
}

export interface PublicBusinessListResponse {
  data: PublicBusinessSummary[];
  total: number;
  page: number;
  limit: number;
}

export interface CategorySummary {
  id: string;
  name: string;
  parentId?: string | null;
}