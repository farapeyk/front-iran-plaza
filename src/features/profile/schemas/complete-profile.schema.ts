import { z } from "zod";
import { isValidIranianNationalCode } from "@/lib/validators/national-code";
import { JALALI_YEAR_RANGE } from "@/lib/utils/jalali";

export const completeProfileSchema = z.object({
  firstName: z.string().min(2, "نام باید حداقل ۲ حرف باشد"),
  lastName: z.string().min(2, "نام خانوادگی باید حداقل ۲ حرف باشد"),
  nationalCode: z
    .string()
    .length(10, "کد ملی باید ۱۰ رقم باشد")
    .refine(isValidIranianNationalCode, "کد ملی معتبر نیست"),
  gender: z.enum(["MALE", "FEMALE"], { message: "جنسیت را انتخاب کنید" }),
  birthDay: z.coerce.number().int().min(1).max(31),
  birthMonth: z.coerce.number().int().min(1).max(12),
  birthYear: z.coerce
    .number()
    .int()
    .min(JALALI_YEAR_RANGE.min, "سال معتبر نیست")
    .max(JALALI_YEAR_RANGE.max, "سال معتبر نیست"),
  // ایمیل اختیاری است (بر اساس طرح Figma الزامی مشخص نشده)
  email: z.string().email("ایمیل معتبر نیست").optional().or(z.literal("")),
  provinceId: z.string().min(1, "استان را انتخاب کنید"),
  cityId: z.string().min(1, "شهر را انتخاب کنید"),
});

export type CompleteProfileInput = z.infer<typeof completeProfileSchema>;
