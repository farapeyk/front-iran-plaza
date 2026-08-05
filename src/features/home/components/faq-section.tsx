// src/features/home/components/faq-section.tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { q: "آیا ثبت کسب و کار در ایران پلازا رایگان است؟", a: "بله، ثبت کسب و کار به صورت پایه کاملا رایگان است." },
  { q: "چگونه می‌توانم اطلاعات کسب و کار خود را ویرایش کنم؟", a: "از طریق پنل کاربری بخش ویرایش پروفایل اقدام فرمایید." },
  { q: "چه مدت زمان می‌برد تا پروفایل من تایید شود؟", a: "معمولاً بین ۲۴ تا ۴۸ ساعت کاری زمان می‌برد." },
];

export function FaqSection() {
  return (
    <section className="py-16 px-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-[#0B3C26] text-center mb-2">سوالات متداول</h2>
      <div className="w-12 h-1 bg-[#C39E67] mx-auto mb-10 rounded-full" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {/* Graphic Placeholder */}
        <div className="hidden md:flex flex-col items-center justify-center bg-amber-50 rounded-3xl p-8 border border-amber-100 text-amber-800/40 font-bold text-center h-full">
          [ جایگاه تصویر علامت سوال / FAQ Graphic ]
        </div>

        {/* Accordions - ✅ برای Base UI */}
        <div className="md:col-span-2">
          <Accordion 
            className="w-full space-y-3"
            defaultValue="item-0"
          >
            {faqs.map((faq, idx) => (
              <AccordionItem 
                key={idx} 
                value={`item-${idx}`}
                className="border rounded-2xl px-4 bg-white not-last:border-b-0"
              >
                <AccordionTrigger className="text-sm font-semibold text-gray-800 hover:no-underline text-right py-4">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-xs text-gray-600 leading-relaxed text-right">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}