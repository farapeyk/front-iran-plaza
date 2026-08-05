import { z } from "zod";
import { isValidIranianNationalCode } from "@/lib/validators/national-code";

export const identitySchema = z.object({
  companyName: z.string().min(2, "نام شرکت باید حداقل ۲ حرف باشد"),
  licenseNumber: z.string().min(1, "شماره پروانه کسب الزامی است"),
  unionCode: z.string().min(1, "کد آپسیک الزامی است"),
  issueDay: z.coerce.number().int().min(1).max(31),
  issueMonth: z.coerce.number().int().min(1).max(12),
  issueYear: z.coerce.number().int().min(1300).max(1410),

  firstName: z.string().min(2, "نام باید حداقل ۲ حرف باشد"),
  lastName: z.string().min(2, "نام خانوادگی باید حداقل ۲ حرف باشد"),
  fatherName: z.string().min(2, "نام پدر باید حداقل ۲ حرف باشد"),
  nationalCode: z
    .string()
    .length(10, "کد ملی باید ۱۰ رقم باشد")
    .refine(isValidIranianNationalCode, "کد ملی معتبر نیست"),
  birthDay: z.coerce.number().int().min(1).max(31),
  birthMonth: z.coerce.number().int().min(1).max(12),
  birthYear: z.coerce.number().int().min(1300).max(1410),
  email: z.string().email("ایمیل معتبر نیست").optional().or(z.literal("")),
});

export type IdentityInput = z.infer<typeof identitySchema>;