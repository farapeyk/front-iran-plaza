import type { BusinessCardData } from "@/design/components/business-card"
const biz1 = "/design/home/biz-1.png"
const biz2 = "/design/home/biz-2.png"
const biz3 = "/design/home/biz-3.png"
const biz4 = "/design/home/biz-4.png"

export const newMembers: BusinessCardData[] = [
  {
    id: "1",
    name: "فست فود ایران برگر",
    description:
      "ایران برگر؛ ترکیب طعم، کیفیت و سرعت برای وقتی که واقعاً هوس یه برگر خوب داری",
    location: "شیراز، معالی آباد",
    image: biz1,
    vip: true,
  },
  {
    id: "2",
    name: "فست فود لاویا",
    description: "طعم‌های خاص، فضای دنج و قهوه‌ی تازه برای لحظه‌های خوب.",
    location: "شیراز، کسائی",
    image: biz2,
    vip: false,
  },
  {
    id: "3",
    name: "رستوران هفت خوان",
    description: "کافه‌رستورانی با منوی متنوع و فضایی آرام برای دورهمی.",
    location: "شیراز، دروازه قرآن",
    image: biz3,
    vip: true,
  },
  {
    id: "4",
    name: "مجموعه رستوران باکویه",
    description: "کافه‌رستورانی دنج با منوی کامل از صبحانه تا شام.",
    location: "شیراز، جمهوری",
    image: biz4,
    vip: true,
  },
]
