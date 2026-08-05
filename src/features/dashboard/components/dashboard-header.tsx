import { Menu, User, Bell } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between bg-white px-5 py-4 border-b border-neutral-100 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-[#0F6B62] flex items-center justify-center text-white font-bold text-lg shadow-sm">
          ا
        </div>
        <h1 className="text-lg font-extrabold text-[#0F6B62]">ایران پلازا</h1>
      </div>

      <div className="flex items-center gap-2">
        <button aria-label="اعلانات" className="relative p-2 text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors">
          <Bell size={22} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E9C46A] rounded-full border border-white"></span>
        </button>
        <button aria-label="پروفایل" className="p-1 rounded-full border border-neutral-200 hover:bg-neutral-100 transition-colors">
          <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
            <User className="text-neutral-500" size={18} />
          </div>
        </button>
      </div>
    </header>
  );
}