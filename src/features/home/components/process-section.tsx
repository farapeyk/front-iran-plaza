const steps = [
  { step: "۱", title: "ثبت نام در سایت", desc: "ایجاد حساب کاربری در کمتر از ۱ دقیقه" },
  { step: "۲", title: "ثبت اطلاعات کسب و کار", desc: "وارد کردن مشخصات، آدرس و تصاویر" },
  { step: "۳", title: "بررسی و تایید", desc: "بررسی اطلاعات توسط تیم پشتیبانی" },
  { step: "۴", title: "تکمیل و انتشار پروفایل", desc: "نمایش کسب و کار شما به هزاران مخاطب" },
];

export function ProcessSection() {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto text-center">
      <h2 className="text-2xl font-bold text-[#0B3C26] mb-2">فرآیند ثبت کسب و کار</h2>
      <div className="w-12 h-1 bg-[#C39E67] mx-auto mb-12 rounded-full" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((item) => (
          <div key={item.step} className="bg-white p-6 rounded-2xl border border-gray-100 relative shadow-sm text-center">
            <div className="w-10 h-10 bg-[#0B3C26] text-[#E8D4B0] font-black rounded-xl flex items-center justify-center mx-auto mb-4 text-lg">
              {item.step}
            </div>
            <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}