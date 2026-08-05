export interface CurrentUser {
  id: string;
  phone: string;
  fullName: string | null;
  userType: "CUSTOMER" | "ADMIN" | string;
  nationalCode?: string | null;
  birthDate?: string | null;
  email?: string | null;
  fatherName?: string | null;
}

export interface VerifyOtpResponse {
  accessToken: string;
  refreshToken: string;
  user: CurrentUser;
  isNewUser: boolean;
}

export type AuthTokens = Pick<VerifyOtpResponse, "accessToken" | "refreshToken">;