const briefcase = "/design/icons/briefcase.svg"
const userIcon = "/design/icons/user.svg"
const awardIcon = "/design/icons/award.svg"
const cardIcon = "/design/icons/card.svg"
const headphone = "/design/icons/headphone.svg"
const profile2user = "/design/icons/profile-2user.svg"
const logoutIcon = "/design/icons/logout.svg"
const profileCircle = "/design/icons/profile-circle.svg"
const callIcon = "/design/icons/call.svg"
const locationIcon = "/design/icons/location.svg"
const galleryIcon = "/design/icons/categories.svg"
const globalIcon = "/design/icons/link.svg"
const threeSquare = "/design/icons/three-square.svg"
const shieldTick = "/design/icons/shield-tick.svg"
const flagIcon = "/design/icons/flag.svg"
const clockIcon = "/design/icons/clock.svg"
const convertCard = "/design/icons/convert-card.svg"

/** زیرمنوی پروفایل — مسیرها با فریم‌های ویرایش فیگما هم‌خوان */
export const profileSubmenuItems = [
  {
    title: "آمار بازدید و نرخ تبدیل",
    icon: threeSquare,
    to: "/profile",
    end: true,
  },
  {
    title: "نام، بیوگرافی و لوگو",
    icon: profileCircle,
    to: "/profile/edit/bio",
  },
  {
    title: "تماس و واتساپ",
    icon: callIcon,
    to: "/profile/edit/contact",
  },
  {
    title: "آدرس و لوکیشن",
    icon: locationIcon,
    to: "/profile/edit/address",
  },
  {
    title: "گالری تصاویر و ویدیو",
    icon: galleryIcon,
    to: "/profile/edit/gallery",
  },
  {
    title: "شبکه های اجتماعی",
    icon: globalIcon,
    to: "/profile/edit/social",
  },
  {
    title: "محصولات",
    icon: shieldTick,
    to: "/profile/edit/products",
  },
  {
    title: "خدمات",
    icon: flagIcon,
    to: "/profile/edit/services",
  },
  {
    title: "درباره ما",
    icon: threeSquare,
    to: "/profile/edit/about",
  },
  {
    title: "ساعات کاری",
    icon: clockIcon,
    to: "/profile/edit/hours",
  },
  {
    title: "شرایط اقساط",
    icon: convertCard,
    to: "/profile/edit/installments",
  },
] as const

export const dashboardMainItems = [
  {
    title: "اطلاعات حساب کاربری",
    subtitle: "ویرایش اطلاعات شخصی",
    icon: userIcon,
    to: "/user-info",
  },
  {
    title: "خرید اشتراک VIP",
    subtitle: "پلن‌ها و تمدید اشتراک",
    icon: awardIcon,
    to: "/subscription",
  },
  {
    title: "پرداخت ها",
    subtitle: "تاریخچه و فاکتورها",
    icon: cardIcon,
    to: "/payments",
  },
  {
    title: "پشتیبانی",
    subtitle: "سوالات متداول و تماس با پشتیبانی",
    icon: headphone,
    to: "/support",
  },
  {
    title: "دعوت دوستان (به زودی)",
    subtitle: "کد معرف، لیست دوستان و پورسانت ها",
    icon: profile2user,
    to: "#",
    disabled: true,
  },
] as const

export const dashboardHomeItems = [
  {
    title: "پروفایل من",
    subtitle: "آمار پروفایل ، ویرایش پروفایل و...",
    icon: briefcase,
    to: "/profile",
  },
  ...dashboardMainItems,
] as const

export const dashboardLogoutItem = {
  title: "خروج از حساب",
  subtitle: "به امید دیدار دوباره",
  icon: logoutIcon,
  to: "/logout",
} as const

export function isDashboardPath(pathname: string) {
  return (
    pathname === "/dashboard" ||
    pathname === "/profile" ||
    pathname.startsWith("/profile/") ||
    pathname === "/user-info" ||
    pathname === "/subscription" ||
    pathname === "/payments" ||
    pathname === "/support"
  )
}

export function isNavActive(pathname: string, to: string, end = false) {
  if (!to || to === "#") return false
  if (end) return pathname === to
  return pathname === to || pathname.startsWith(`${to}/`)
}

export function isProfileSection(pathname: string) {
  return pathname === "/profile" || pathname.startsWith("/profile/")
}
