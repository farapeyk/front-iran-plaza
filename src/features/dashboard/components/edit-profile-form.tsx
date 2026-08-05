"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { editProfileSchema, EditProfileValues } from "@/features/profile/schemas/edit-profile.schema";
import { updateProfileAction } from "@/features/profile/actions/update-profile.action";

export function EditProfileForm({ defaultFullName, defaultEmail }: { defaultFullName: string; defaultEmail?: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditProfileValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      fullName: defaultFullName,
      email: defaultEmail || "",
    },
  });

  const onSubmit = async (data: EditProfileValues) => {
    setIsLoading(true);
    const res = await updateProfileAction(data);
    setIsLoading(false);

    if (res.success) {
      toast.success("اطلاعات شما با موفقیت بروزرسانی شد");
    } else {
      toast.error(res.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-700">نام و نام خانوادگی</label>
        <Input
          {...register("fullName")}
          placeholder="مثال: علی رضایی"
          className="h-12 rounded-xl bg-neutral-50 border-neutral-200 focus-visible:ring-[#0F6B62]"
        />
        {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-700">ایمیل (اختیاری)</label>
        <Input
          {...register("email")}
          type="email"
          dir="ltr"
          placeholder="example@gmail.com"
          className="h-12 rounded-xl bg-neutral-50 border-neutral-200 text-left focus-visible:ring-[#0F6B62]"
        />
        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
      </div>

      <Button 
        type="submit" 
        disabled={isLoading}
        className="w-full h-12 rounded-xl bg-[#0F6B62] hover:bg-[#0c5a52] text-white font-bold text-sm shadow-sm mt-4"
      >
        {isLoading ? <Loader2 className="animate-spin" size={20} /> : "ذخیره تغییرات"}
      </Button>

      <Link href="/dashboard" className="block">
        <Button variant="ghost" type="button" className="w-full h-12 rounded-xl text-neutral-600 font-medium">
          <ChevronRight size={20} className="ml-1" />
          بازگشت به داشبورد
        </Button>
      </Link>
    </form>
  );
}