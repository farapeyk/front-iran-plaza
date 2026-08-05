import { z } from "zod";

// شماره موبایل ایران: با 09 شروع شود و ۱۱ رقم باشد
const IRAN_MOBILE_REGEX = /^09\d{9}$/;

export const requestOtpSchema = z.object({
  phone: z
    .string()
    .min(1, "شماره موبایل الزامی است")
    .regex(IRAN_MOBILE_REGEX, "شماره موبایل معتبر نیست (مثال: 09123456789)"),
});

export type RequestOtpInput = z.infer<typeof requestOtpSchema>;

// طول کد تایید بر اساس مثال واقعی Swagger (/api/auth/verify-otp) پنج رقم است
export const verifyOtpSchema = z.object({
  phone: z.string().regex(IRAN_MOBILE_REGEX),
  code: z
    .string()
    .min(1, "کد تایید الزامی است")
    .length(5, "کد تایید باید ۵ رقم باشد")
    .regex(/^\d+$/, "کد تایید فقط شامل عدد است"),
});

export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
