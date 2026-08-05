import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-[#FAF7F0] to-[#F2EDE2] pt-12 pb-20 px-4 overflow-hidden text-center">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl sm:text-5xl font-black text-[#0B3C26] leading-tight">
          ایران پلازا،
          <br />
          <span className="text-[#C39E67]">مرجع معرفی بهترین کسب و کارها</span>
        </h1>
        <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto">
          از بین میلیون‌ها کسب و کار، خدمات مورد نظر خود را به‌راحتی پیدا کنید
        </p>

        {/* Search Box */}
        <div className="bg-white p-2 sm:p-3 rounded-2xl sm:rounded-full shadow-lg border border-gray-100 flex flex-col sm:flex-row items-center gap-2 max-w-2xl mx-auto">
          <div className="flex items-center gap-2 px-3 w-full sm:w-1/2 border-b sm:border-b-0 sm:border-l border-gray-100 py-2 sm:py-0">
            <Search className="w-5 h-5 text-gray-400 shrink-0" />
            <Input 
              placeholder="نام کسب و کار، خدمت یا ..." 
              className="border-none shadow-none focus-visible:ring-0 text-sm p-0 placeholder:text-gray-400" 
            />
          </div>
          <div className="flex items-center gap-2 px-3 w-full sm:w-1/2 py-2 sm:py-0">
            <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
            <Input 
              placeholder="همه شهرها" 
              className="border-none shadow-none focus-visible:ring-0 text-sm p-0 placeholder:text-gray-400" 
            />
          </div>
          <Button className="w-full sm:w-auto bg-[#0B3C26] hover:bg-[#082D1C] text-white rounded-xl sm:rounded-full px-8 py-2.5 font-medium">
            جستجو
          </Button>
        </div>
      </div>

      {/* Skyline Placeholder Graphic */}
      <div className="mt-12 h-24 sm:h-36 w-full max-w-5xl mx-auto bg-emerald-900/10 rounded-2xl flex items-center justify-center text-emerald-900/40 text-xs">
        [ جایگاه گرافیک شهر / Skyline Illustration ]
      </div>
    </section>
  );
}