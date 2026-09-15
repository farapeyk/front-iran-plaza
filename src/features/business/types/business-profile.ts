export interface BusinessProfile {
  id: string;
  name: string;
  description: string | null; // بیوگرافی کوتاه (حداکثر ۱۰۰ کاراکتر)
  aboutText: string | null; // متن کامل «درباره ما»
  phone: string;
  phone2: string | null;
  whatsapp: string | null;
  socialMedia: Record<string, string> | null;
  logoId: string | null;
  introVideoId: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED"; 
  rejectionReason?: string | null;
  updatedAt: string;
}

export interface GalleryImageData {
  id: string;
  businessId: string;
  fileId: string;
  title: string | null;
  sortOrder: number;
  createdAt: string;
}

export type Weekday = "SATURDAY" | "SUNDAY" | "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY";

export interface WorkingHoursEntry {
  id?: string;
  businessId?: string;
  weekday: Weekday;
  isTwoShift: boolean;
  openTime1: string | null;
  closeTime1: string | null;
  openTime2: string | null;
  closeTime2: string | null;
}

export const WEEKDAYS: { value: Weekday; label: string }[] = [
  { value: "SATURDAY", label: "شنبه" },
  { value: "SUNDAY", label: "یکشنبه" },
  { value: "MONDAY", label: "دوشنبه" },
  { value: "TUESDAY", label: "سه‌شنبه" },
  { value: "WEDNESDAY", label: "چهارشنبه" },
  { value: "THURSDAY", label: "پنجشنبه" },
  { value: "FRIDAY", label: "جمعه" },
];