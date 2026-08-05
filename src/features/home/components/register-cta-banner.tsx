import { CheckCircle2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RegisterCtaBanner() {
  return (
    <section className="max-w-6xl mx-auto px-4 my-12">
      <div className="bg-[#0B3C26] text-white rounded-3xl p-6 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Decorative Gold Wave Lines Placeholder */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#E8D4B0_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="space-y-4 max-w-xl z-10 text-center md:text-right">
          <span className="inline-block bg-[#E8D4B0] text-[#0B3C26] text-xs font-black px-3 py-1 rounded-full">
            VIP
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#E8D4B0]">ثبت نام رایگان کسب و کارها</h2>
          <p className="text-emerald-100/80 text-sm leading-relaxed">
            با ثبت کسب و کار خود در ایران پلازا، دیده شوید و مشتریان بیشتری جذب کنید.
          </p>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm text-emerald-50">
            <li className="flex items-center gap-2 justify-center md:justify-start">
              <CheckCircle2 className="w-4 h-4 text-[#E8D4B0]" />
              صفحه اختصاصی کسب و کار
            </li>
            <li className="flex items-center gap-2 justify-center md:justify-start">
              <CheckCircle2 className="w-4 h-4 text-[#E8D4B0]" />
              نمایش در نتایج برتر گوگل
            </li>
            <li className="flex items-center gap-2 justify-center md:justify-start">
              <CheckCircle2 className="w-4 h-4 text-[#E8D4B0]" />
              مدیریت نظرات مشتریان
            </li>
            <li className="flex items-center gap-2 justify-center md:justify-start">
              <CheckCircle2 className="w-4 h-4 text-[#E8D4B0]" />
              پشتیبانی اختصاصی
            </li>
          </ul>
        </div>

        <div className="z-10 shrink-0">
          <Button className="bg-[#E8D4B0] text-[#0B3C26] hover:bg-[#dfc498] font-bold rounded-full px-8 py-6 text-base">
            ثبت کسب و کار
          </Button>
        </div>
      </div>
    </section>
  );
}