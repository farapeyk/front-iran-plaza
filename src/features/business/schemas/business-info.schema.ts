import { z } from "zod";

export const businessInfoSchema = z.object({
  name: z.string().min(2, "نام کسب‌وکار باید حداقل ۲ حرف باشد"),
  phone: z.string().min(8, "شماره تماس معتبر نیست"),
  bio: z.string().max(100, "حداکثر ۱۰۰ کاراکتر").optional(),
  categoryId: z.string().min(1, "زمینه فعالیت را انتخاب کنید"),
  province: z.string().min(1, "استان را وارد کنید"),
  city: z.string().min(1, "شهر را وارد کنید"),
});

export type BusinessInfoInput = z.infer<typeof businessInfoSchema>;