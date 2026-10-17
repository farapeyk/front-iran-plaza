import { restaurantArticleBody } from "@/design/data/article-restaurants"
const biz1 = "/design/home/biz-1.webp"
const biz2 = "/design/home/biz-2.webp"
const biz3 = "/design/home/biz-3.webp"
const biz4 = "/design/home/biz-4.webp"

export type ArticleCardData = {
  id: string
  title: string
  excerpt: string
  category: string
  image: string
  date: string
  author?: string
  readMinutes?: number
  rating?: number
  ratingCount?: number
}

export const articles: ArticleCardData[] = [
  {
    id: "1",
    title: "لیست بهترین رستوران های شیراز",
    excerpt: restaurantArticleBody.intro,
    category: "معرفی",
    image: biz3,
    date: "۳ هفته پیش",
    author: "پوریا خلقت",
    readMinutes: 12,
    rating: 4.2,
    ratingCount: 7,
  },
  {
    id: "2",
    title: "معرفی ۱۰ فست‌فود برتر شیراز، بهترین فست‌فود شیراز کجاست؟",
    excerpt:
      "اگر عاشق پیتزاهای کش‌دار، برگرهای زغالی و سیب‌زمینی‌های خوش‌عطر شیراز هستید، این لیست ۱۰ فست‌فود برتر را از دست ندهید.",
    category: "معرفی",
    image: biz1,
    date: "۲ هفته پیش",
    author: "تیم ایران پلازا",
    readMinutes: 8,
  },
  {
    id: "3",
    title: "معرفی ۸ پیتزا فروشی برتر شیراز",
    excerpt:
      "با مواد تازه، دستور پخت متفاوت و فضای دل‌پذیر؛ بهترین پیتزافروشی‌های شیراز را بشناسید.",
    category: "معرفی",
    image: biz2,
    date: "۱ هفته پیش",
    author: "تیم ایران پلازا",
    readMinutes: 6,
  },
  {
    id: "4",
    title: "معرفی ۲۰ کافی‌شاپ برتر شیراز",
    excerpt:
      "کافی‌شاپ فقط نوشیدنی نیست؛ فضا، پرسنل و حس خوب هم مهم است. ۲۰ کافی‌شاپ برتر شیراز را ببینید.",
    category: "معرفی",
    image: biz4,
    date: "۵ روز پیش",
    author: "تیم ایران پلازا",
    readMinutes: 10,
  },
  {
    id: "5",
    title: "معرفی ۱۵ تالار عروسی برتر شیراز",
    excerpt:
      "از باغ‌تالارهای لوکس تا سالن‌های کلاسیک؛ راهنمای انتخاب بهترین تالار عروسی در شیراز.",
    category: "راهنما",
    image: biz1,
    date: "۴ روز پیش",
    author: "تیم ایران پلازا",
    readMinutes: 14,
  },
]
