"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateBusinessProfileAction } from "@/features/business/actions/update-business-profile.action";

interface ContactFormProps {
  businessId: string;
  initialPhone: string;
  initialPhone2: string;
  initialWhatsapp: string;
}

export function ContactForm({ businessId, initialPhone, initialPhone2, initialWhatsapp }: ContactFormProps) {
  const [isPending, startTransition] = useTransition();
  const [phone, setPhone] = useState(initialPhone);
  const [phone2, setPhone2] = useState(initialPhone2);
  const [whatsapp, setWhatsapp] = useState(initialWhatsapp);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await updateBusinessProfileAction(businessId, {
        phone,
        phone2: phone2 || undefined,
        whatsapp: whatsapp || undefined,
      });
      if (!result.success) toast.error(result.message);
      else toast.success("اطلاعات ذخیره شد");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" dir="rtl">
      <div className="space-y-2">
        <label className="text-sm font-medium">شماره تماس ۱ (اصلی)</label>
        <Input value={phone} onChange={(e) => setPhone(e.target.value)} dir="ltr" className="text-left" disabled={isPending} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">شماره تماس ۲ <span className="text-muted-foreground">(اختیاری)</span></label>
        <Input value={phone2} onChange={(e) => setPhone2(e.target.value)} dir="ltr" className="text-left" disabled={isPending} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">واتساپ <span className="text-muted-foreground">(اختیاری)</span></label>
        <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} dir="ltr" className="text-left" disabled={isPending} />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "در حال ذخیره..." : "ذخیره اطلاعات"}
      </Button>
    </form>
  );
}