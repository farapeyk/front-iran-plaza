import { z } from "zod";

export const editProfileSchema = z.object({
  fullName: z.string().min(3, "نام و نام خانوادگی الزامی است"),
  email: z.string().email("ایمیل نامعتبر است").optional().or(z.literal("")),
});

export type EditProfileValues = z.infer<typeof editProfileSchema>;