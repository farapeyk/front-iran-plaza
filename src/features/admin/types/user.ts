export interface AdminUserListItem {
  id: string;
  phone: string;
  fullName: string | null;
  email: string | null;
  userType: "CUSTOMER" | "BUSINESS_OWNER" | "ADMIN" | "SUPER_ADMIN";
  isActive: boolean;
  isSuspended: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

export interface AdminUserListResponse {
  data: AdminUserListItem[];
  total: number;
  page: number;
  limit: number;
}

export interface AdminUserBusiness {
  id: string;
  name: string;
  slug: string;
  status: string;
  createdAt: string;
}

export interface AdminUserSuspensionEntry {
  id: string;
  action: "SUSPENDED" | "REINSTATED";
  reason: string | null;
  createdAt: string;
  performer: { id: string; fullName: string | null; phone: string };
}

export interface AdminUserDetail extends AdminUserListItem {
  nationalCode: string | null;
  gender: string | null;
  birthDate: string | null;
  province: string | null;
  city: string | null;
  suspendedReason: string | null;
  businesses: AdminUserBusiness[];
  suspensionsReceived: AdminUserSuspensionEntry[];
}