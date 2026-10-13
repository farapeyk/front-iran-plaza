"use client"

import { useMemo, useState } from "react"
import { useParams } from "@/design/navigation"
import { SiteLayout } from "@/design/components/site-layout"
import { VipBadge } from "@/design/components/vip-badge"
import { NewMembers } from "@/design/components/new-members"
import { newMembers } from "@/design/data/new-members"
import { Tab, TabsList } from "@/design/components/tab"
import { Breadcrumb } from "@/design/components/breadcrumb"
import { Scoring } from "@/design/components/scoring"
import { WriteComment } from "@/design/components/write-comment"
import { LikeButton } from "@/design/components/like-button"
import { UserAvatar } from "@/design/components/user-avatar"
import { GalleryProfile } from "@/design/components/gallery-profile"
import { SocialMediaIcon } from "@/design/components/social-media-icon"
import { VoicePlayer } from "@/design/components/voice-player"
import { CallContactSheet } from "@/design/components/call-contact-sheet"
import {
  ReplyCommentSheet,
  type ReplyComment,
} from "@/design/components/reply-comment-sheet"
import { GalleryLightbox } from "@/design/components/gallery-lightbox"
import { Button } from "@/design/components/ui/button"
import { buttonVariants } from "@/design/components/ui/button-variants"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/design/components/ui/accordion"
import { cn } from "@/design/lib/utils"
import {
  restaurantArticleBusinesses,
  type ArticleBusiness,
} from "@/design/data/article-restaurants"
import type { BusinessCardData } from "@/design/components/business-card"
const locationIcon = "/design/icons/location.svg"
const callIcon = "/design/icons/call.svg"
const shareIcon = "/design/icons/share.svg"
const starIcon = "/design/icons/star.svg"
const discountIcon = "/design/icons/discount-shape.svg"
const convertCardIcon = "/design/icons/convert-card.svg"
const arrowDown = "/design/icons/arrow-down.svg"
const arrowLeft = "/design/icons/arrow-left.svg"
const arrowRight = "/design/icons/arrow-right.svg"
const shieldTick = "/design/icons/shield-tick.svg"
const threeSquare = "/design/icons/three-square.svg"
const flagIcon = "/design/icons/flag.svg"
const clockIcon = "/design/icons/clock.svg"
const addIcon = "/design/icons/add.svg"
const tickIcon = "/design/icons/tick.svg"

const baseTabs = [
  "گالری",
  "خدمات",
  "درباره ما",
  "محصولات",
  "ساعات کاری",
  "آدرس",
  "شبکه های اجتماعی",
  "نظرات",
] as const

const vipTabs = [
  "گالری",
  "خدمات",
  "محصولات",
  "شرایط اقساط",
  "درباره ما",
  "ساعات کاری",
  "آدرس",
  "شبکه های اجتماعی",
  "نظرات",
] as const

const serviceItems = [
  "پذیرش حضوری",
  "امکان بیرون‌بر",
  "منوی متنوع برگر و فست‌فود",
  "چند شعبه در شهرهای مختلف",
  "امکان استفاده از کوپن یا تخفیف ویژه",
  "تحویل یا ارسال غذا",
]

const installmentItems = [
  {
    title: "شروع اقساط",
    detail: "1 ماه تا 6 ماه بعد از دریافت کالا",
  },
  {
    title: "فاصله پرداخت اقساط",
    detail: "1 تا 3 ماه",
  },
  {
    title: "ضمانت",
    detail: "برای اطلاعات بیشتر تماس بگیرید",
  },
  {
    title: "مدت بازپرداخت (ماه)",
    detail: "3 - 6 - 9 - 12 - 18 - 24 - 36 - 48 - 60",
  },
  {
    title: "مبلغ پیش پرداخت",
    detail: "حداقل 50%",
  },
  {
    title: "سود اقساط",
    detail: "ماهانه 3%",
  },
]

const hoursRows = [
  { day: "شنبه", times: "۱۱:۰۰ - ۲۴:۰۰" },
  { day: "یکشنبه", times: "۱۱:۰۰ - ۲۴:۰۰" },
  { day: "دوشنبه", times: "۱۱:۰۰ - ۲۴:۰۰" },
  { day: "سه‌شنبه", times: "۱۱:۰۰ - ۲۴:۰۰" },
  { day: "چهارشنبه", times: "۱۱:۰۰ - ۲۴:۰۰" },
  { day: "پنج‌شنبه", times: "۱۱:۰۰ - ۲۴:۰۰" },
  { day: "جمعه", times: "۱۲:۰۰ - ۲۴:۰۰" },
]

const branches = [
  {
    title: "شعبه معالی آباد ( اصلی )",
    address: "شیراز، معالی آباد، خیابان پزشکان، کوچه 6، ساختمان مهندسین، واحد 404",
  },
  {
    title: "شعبه نیایش",
    address: "شیراز، بلوار نیایش، خیابان مهدیه، کوچه 12، ساختمان خلبانان، واحد 32",
  },
  {
    title: "شعبه ملاصدرا",
    address: "شیراز، ملاصدرا، خیابان معدل غربی، کوچه 54، ساختمان الف، واحد 22",
  },
]

const comments = [
  {
    name: "علیرضا",
    date: "۱۴۰۴/۰۶/۲۸ - ۲۱:۴۸",
    text: "محیط فوق‌العاده صمیمی و برخورد پرسنل خیلی محترمانه بود. سفارش هم سریع آماده شد و داغ و تازه رسید.",
    replies: 4,
  },
  {
    name: "سجاد",
    date: "۱۴۰۴/۰۶/۲۸ - ۲۱:۴۸",
    text: "من چند بار از ایران برگر سفارش دادم و هر دفعه کیفیت ثابت بوده. طعم سس‌هاشون بی‌نظیره.",
    replies: 0,
  },
  {
    name: "پوریا",
    date: "۱۴۰۴/۰۶/۲۸ - ۲۱:۴۸",
    text: "واقعا یکی از بهترین برگرهایی بود که تا حالا خوردم! هم طعمش عالی بود هم کیفیت مواد اولیه.",
    replies: 1,
  },
]

const socials = [
  { name: "Telegram" as const, label: "تلگرام" },
  { name: "Whatsapp" as const, label: "واتساپ" },
  { name: "Instagram" as const, label: "اینستاگرام" },
  { name: "X" as const, label: "ایکس" },
]

const nameAliases: Record<string, string> = {
  "1": "ایران برگر",
  "2": "لاویا",
  "3": "هفت خوان",
  "4": "باکویه",
}

type ProfileBusiness = BusinessCardData &
  Partial<Pick<ArticleBusiness, "phone" | "status" | "blurb">>

function resolveBusiness(id?: string): ProfileBusiness {
  const fromRestaurant = restaurantArticleBusinesses.find((b) => b.id === id)
  const fromMembers = newMembers.find((b) => b.id === id)

  if (fromRestaurant) {
    return {
      ...fromRestaurant,
      image: fromMembers?.image ?? fromRestaurant.image,
      vip: fromRestaurant.vip ?? fromRestaurant.status !== "free",
    }
  }

  const member = fromMembers ?? newMembers[0]
  const alias = nameAliases[member.id] ?? member.name
  const byName = restaurantArticleBusinesses.find(
    (r) => r.name.includes(alias) || alias.includes(r.name.slice(0, 6))
  )

  if (byName) {
    return {
      ...member,
      description: byName.description || member.description,
      location: byName.location || member.location,
      phone: byName.phone,
      status: byName.status,
      vip: byName.vip ?? member.vip !== false,
      blurb: byName.blurb,
    }
  }

  return { ...member, vip: member.vip !== false }
}

function SectionHeading({
  title,
  icon,
  id,
}: {
  title: string
  icon: string
  id?: string
}) {
  return (
    <div
      id={id}
      className="flex items-center justify-start gap-[var(--md)] scroll-mt-24"
    >
      <h2 className="text-2xl font-bold text-[var(--text-title)]">{title}</h2>
      <img alt="" className="size-8" height={32} src={icon} width={32} />
    </div>
  )
}

function Chip({
  label,
  icon,
}: {
  label: string
  icon: string
}) {
  return (
    <span className="inline-flex h-8 items-center gap-1 rounded-full border border-[var(--opacity-dark-16)] px-3 text-sm text-[var(--text-body)]">
      {label}
      <img alt="" className="size-4" height={16} src={icon} width={16} />
    </span>
  )
}

function RatingChip({ value = "۴.۲" }: { value?: string }) {
  return (
    <span className="inline-flex h-8 items-center gap-1 rounded-full border border-[var(--opacity-dark-16)] px-3 text-base font-bold text-[var(--text-body)]">
      {value}
      <img alt="" className="size-4" height={16} src={starIcon} width={16} />
    </span>
  )
}

function HeroActions({
  compact = false,
  onContact,
}: {
  phone?: string
  compact?: boolean
  onContact?: () => void
}) {
  return (
    <div className={cn("flex gap-2", compact ? "w-full" : "max-lg:w-full")}>
      <button
        type="button"
        onClick={onContact}
        className={cn(
          buttonVariants({ size: "lg" }),
          "gap-2",
          compact ? "min-w-0 flex-1" : "max-lg:flex-1 lg:w-[200px]"
        )}
      >
        تماس/ واتساپ
        <img alt="" className="size-6" height={24} src={callIcon} width={24} />
      </button>
      <Button
        variant="secondary"
        size="lg"
        className={cn("gap-2", compact ? "shrink-0" : "max-lg:shrink-0")}
      >
        آدرس
        <img alt="" className="size-6" height={24} src={locationIcon} width={24} />
      </Button>
    </div>
  )
}

function AvatarBlock({
  src,
  size = 100,
  showVoice = true,
}: {
  src: string
  size?: number
  showVoice?: boolean
}) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div className="size-full overflow-hidden rounded-full">
        <img
          alt=""
          className="size-full object-cover"
          height={size}
          src={src}
          width={size}
        />
      </div>
      {showVoice ? (
        <VoicePlayer className="absolute bottom-0 start-2" />
      ) : null}
    </div>
  )
}

function BusinessProfilePage() {
  const { id } = useParams()
  const business = useMemo(() => resolveBusiness(id), [id])
  const isVip = business.vip !== false
  const tabs = isVip ? vipTabs : baseTabs
  const [activeTab, setActiveTab] = useState<string>(tabs[0])
  const [contactOpen, setContactOpen] = useState(false)
  const [replyTarget, setReplyTarget] = useState<ReplyComment | null>(null)
  const [galleryOpen, setGalleryOpen] = useState(false)

  const gallery = [
    business.image,
    newMembers[1].image,
    newMembers[2].image,
    newMembers[3].image,
  ]

  const aboutBody =
    business.blurb ??
    business.description ??
    "ایران برگر با تمرکز روی کیفیت مواد اولیه و سرعت سرویس‌دهی، یکی از مجموعه‌های محبوب شیراز است."

  const mobileSections = [
    {
      id: "services",
      title: "خدمات",
      subtitle: "خدماتی که میتوانید از ما دریافت کنید",
      icon: shieldTick,
      body: "تحویل حضوری و بیرون‌بر، سفارش آنلاین، فضای نشیمن خانوادگی و منوی متنوع برگر و ساندویچ.",
    },
    {
      id: "products",
      title: "محصولات",
      subtitle: "برخی محصولات ما با جزئیات",
      icon: threeSquare,
      body: "کلاسیک برگر، چیزبرگر دوبل، برگر مخصوص ایران برگر، سیب‌زمینی مخصوص و نوشیدنی‌های تازه.",
    },
    ...(isVip
      ? [
          {
            id: "installment",
            title: "شرایط اقساط",
            subtitle: "با شرایط اقساطی ما راحت تر خرید کنید",
            icon: convertCardIcon,
            body: "امکان خرید اقساطی برای سفارش‌های سازمانی و پکیج‌های پذیرایی با هماهنگی قبلی.",
          },
        ]
      : []),
    {
      id: "about",
      title: "درباره ما",
      subtitle: "کمی با ما آشنا شوید",
      icon: flagIcon,
      body: aboutBody,
    },
    {
      id: "hours",
      title: "ساعات کاری",
      subtitle: "برای مراجعه حضوری",
      icon: clockIcon,
      body: "شنبه تا پنج‌شنبه ۱۱ تا ۲۴ — جمعه‌ها ۱۲ تا ۲۴",
    },
    {
      id: "address",
      title: "آدرس",
      subtitle: "آدرس کامل + جزئیات و مسیریابی",
      icon: locationIcon,
      body: business.location,
    },
  ]

  return (
    <SiteLayout>
      {/* Breadcrumb — mobile */}
      <nav className="px-[var(--page-gutter)] pt-[var(--lg)] lg:hidden">
        <Breadcrumb
          items={[
            { label: "خانه", to: "/" },
            { label: "کسب وکارها", to: "/businesses" },
            { label: business.name },
          ]}
        />
      </nav>

      {/* Breadcrumb — desktop VIP/Free */}
      <nav className="mx-auto hidden max-w-[1440px] items-center justify-between gap-[var(--lg)] px-[var(--page-gutter-lg)] py-[var(--2xl)] lg:flex">
        <div className="flex items-center gap-[var(--lg)]">
          {isVip ? <VipBadge /> : null}
          <button
            type="button"
            aria-label="اشتراک‌گذاری"
            className="flex size-12 items-center justify-center rounded-full"
          >
            <img alt="" className="size-6" height={24} src={shareIcon} width={24} />
          </button>
        </div>
        <Breadcrumb
          className="min-w-0 flex-1"
          items={[
            { label: "خانه", to: "/" },
            { label: "کسب وکارها", to: "/businesses" },
            { label: business.name },
          ]}
        />
      </nav>

      {/* ─── Mobile hero ─── */}
      <section className="mx-auto max-w-3xl space-y-[var(--3xl)] px-[var(--page-gutter)] py-[var(--2xl)] lg:hidden">
        <div className="flex items-start justify-between gap-[var(--lg)]">
          <div className="flex items-center gap-[var(--2xl)] py-[var(--xs)]">
            {isVip ? <VipBadge /> : null}
            <button type="button" aria-label="اشتراک‌گذاری" className="size-6">
              <img alt="" className="size-full" height={24} src={shareIcon} width={24} />
            </button>
          </div>
          <AvatarBlock src={business.image} size={100} />
        </div>

        <div className="space-y-[var(--sm)] text-right">
          <h1 className="text-[28px] font-black text-[var(--text-title)]">
            {business.name}
          </h1>
          <p className="text-base leading-relaxed text-[var(--text-body)]">
            {business.description}
          </p>
          <div className="flex items-center justify-start gap-1 text-base text-[var(--text-body)]">
            <span>{business.location}</span>
            <img alt="" className="size-4" height={16} src={locationIcon} width={16} />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-[var(--md)]">
          <div className="flex flex-wrap gap-1">
            {isVip ? (
              <>
                <Chip label="تخفیف دار" icon={discountIcon} />
                <Chip label="شرایط اقساطی" icon={convertCardIcon} />
              </>
            ) : null}
          </div>
          <RatingChip />
        </div>

        <HeroActions phone={business.phone} onContact={() => setContactOpen(true)} />
      </section>

      {/* ─── Desktop hero (Figma VIP: avatar + copy + CTAs) ─── */}
      <section className="mx-auto hidden max-w-[1440px] px-[var(--page-gutter-lg)] pb-[var(--8xl)] pt-[var(--space-16)] lg:block">
        <div className="flex items-end justify-between gap-[var(--5xl)]">
          <HeroActions phone={business.phone} onContact={() => setContactOpen(true)} />

          <div className="flex min-w-0 flex-1 items-center justify-start gap-[var(--2xl)]">
            <div className="flex min-w-0 max-w-[659px] flex-1 flex-col items-start gap-[var(--lg)]">
              <div className="w-full space-y-[var(--sm)] text-right">
                <h1 className="text-[length:var(--text-h1)] font-black leading-[1.4] text-[var(--text-title)]">
                  {business.name}
                </h1>
                <p className="text-lg leading-relaxed text-[var(--text-body)]">
                  {business.description}
                </p>
                <div className="flex items-center justify-start gap-1 text-lg text-[var(--text-body)]">
                  <span>{business.location}</span>
                  <img
                    alt=""
                    className="size-4"
                    height={16}
                    src={locationIcon}
                    width={16}
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-[var(--sm)]">
                {isVip ? (
                  <>
                    <Chip label="تخفیف دار" icon={discountIcon} />
                    <Chip label="شرایط اقساطی" icon={convertCardIcon} />
                  </>
                ) : null}
                <RatingChip />
              </div>
            </div>
            <AvatarBlock src={business.image} size={140} showVoice={isVip} />
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="sticky top-0 z-20 border-y border-[var(--border-subtle)] bg-[var(--main-bg)]">
        <div className="mx-auto max-w-[1440px]">
          <TabsList className="justify-start px-[var(--page-gutter)] lg:justify-start lg:px-[var(--page-gutter-lg)]">
            {tabs.map((tab) => (
              <Tab
                key={tab}
                variant="border"
                size="mobile"
                active={activeTab === tab}
                className="lg:h-14 lg:px-6 lg:text-lg"
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </Tab>
            ))}
          </TabsList>
        </div>
      </div>

      {/* Gallery */}
      <section className="mx-auto max-w-[1440px] px-[var(--page-gutter)] py-[var(--lg)] lg:px-[var(--page-gutter-lg)] lg:pb-[var(--2xl)] lg:pt-6">
        <button
          type="button"
          className="block w-full text-start"
          onClick={() => setGalleryOpen(true)}
          aria-label="باز کردن گالری"
        >
          <GalleryProfile
            type="1"
            items={gallery.map((src, i) => ({
              src,
              isVideo: i === 3,
            }))}
            className="w-full max-lg:h-[180px] lg:h-[400px]"
          />
        </button>
        <div className="mt-[var(--lg)] hidden items-center justify-between lg:flex">
          <div className="flex gap-4">
            <Button variant="outline" size="icon" aria-label="قبلی">
              <img alt="" className="size-6" height={24} src={arrowRight} width={24} />
            </Button>
            <Button variant="outline" size="icon" aria-label="بعدی">
              <img alt="" className="size-6" height={24} src={arrowLeft} width={24} />
            </Button>
          </div>
          <Button
            variant="outline"
            size="lg"
            className="gap-2"
            onClick={() => setGalleryOpen(true)}
          >
            مشاهده همه
            <img alt="" className="size-6" height={24} src={addIcon} width={24} />
          </Button>
        </div>
      </section>

      {/* ─── Mobile accordion + stacked sections ─── */}
      <div className="lg:hidden">
        <section className="px-[var(--page-gutter)]">
          <Accordion className="w-full">
            {mobileSections.map((s) => (
              <AccordionItem
                key={s.id}
                value={s.id}
                className="border-b border-[var(--opacity-dark-8)]"
              >
                <AccordionTrigger
                  showChevron={false}
                  className="flex w-full items-center gap-[var(--lg)] py-[var(--lg)] hover:no-underline"
                >
                  <img
                    alt=""
                    className="size-6 shrink-0 transition-transform group-aria-expanded/accordion-trigger:rotate-180"
                    height={24}
                    src={arrowDown}
                    width={24}
                  />
                  <span className="min-w-0 flex-1 text-right">
                    <span className="block text-lg font-bold text-[var(--text-title)]">
                      {s.title}
                    </span>
                    <span className="block text-sm text-[var(--text-body)]">
                      {s.subtitle}
                    </span>
                  </span>
                  <img
                    alt=""
                    className="size-6 shrink-0"
                    height={24}
                    src={s.icon}
                    width={24}
                  />
                </AccordionTrigger>
                <AccordionContent className="pb-[var(--lg)] text-right text-base leading-relaxed text-[var(--text-body)]">
                  {s.body}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section className="space-y-[var(--lg)] px-[var(--page-gutter)] py-[var(--2xl)] text-right">
          <h2 className="text-xl font-bold text-[var(--text-title)]">
            شبکه های اجتماعی
          </h2>
          <div className="flex flex-wrap justify-start gap-3">
            {socials.map((s) => (
              <SocialMediaIcon
                key={s.label}
                name={s.name}
                type="Button"
                aria-label={s.label}
                href="#"
              />
            ))}
          </div>
        </section>

        <section className="space-y-[var(--lg)] px-[var(--page-gutter)] py-[var(--2xl)]">
          <div className="flex items-center justify-between">
            <span className="text-base text-[var(--text-body)]">۲۳ نظر</span>
            <h2 className="text-xl font-bold text-[var(--text-title)]">
              نظرات کاربران
            </h2>
          </div>
          <div className="flex gap-[var(--md)] overflow-x-auto pb-2 [scrollbar-width:none]">
            {comments.map((c) => (
              <article
                key={c.name}
                className="w-[280px] shrink-0 space-y-[var(--lg)] rounded-[var(--radius-xs)] border border-[var(--opacity-dark-8)] bg-[var(--surface)] p-[var(--lg)]"
              >
                <div className="flex items-start justify-between gap-3 text-right">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-[var(--text-title)]">{c.name}</p>
                    <p className="text-sm text-[var(--text-body)]">{c.date}</p>
                  </div>
                  <UserAvatar size={40} color="gold-neutral" />
                </div>
                <p className="line-clamp-4 text-right text-sm leading-relaxed text-[var(--text-body)]">
                  {c.text}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    <LikeButton type="like" />
                    <LikeButton type="dislike" />
                  </div>
                  {c.replies > 0 ? (
                    <span className="text-sm text-[var(--text-body)]">
                      {c.replies} پاسخ ثبت شده
                    </span>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setReplyTarget({
                          name: c.name,
                          date: c.date,
                          text: c.text,
                        })
                      }
                    >
                      پاسخ
                    </Button>
                  )}
                </div>
              </article>
            ))}
            <button
              type="button"
              className="flex w-[118px] shrink-0 flex-col items-center justify-center gap-2 rounded-[var(--radius-xs)] border border-[var(--opacity-dark-8)] bg-[var(--surface)] text-sm font-bold text-[var(--text-title)]"
            >
              <img alt="" className="size-6" height={24} src={addIcon} width={24} />
              مشاهده همه
            </button>
          </div>
          <WriteComment size="mobile" className="w-full" />
        </section>

        <section className="mx-[var(--page-gutter)] mb-[var(--3xl)]">
          <Scoring orientation="vertical" className="w-full bg-secondary-100" />
        </section>
      </div>

      {/* ─── Desktop two-column (VIP sticky card + sections) ─── */}
      <div className="mx-auto hidden max-w-[1440px] gap-20 px-[var(--page-gutter-lg)] pb-[var(--5xl)] lg:grid lg:grid-cols-[350px_minmax(0,770px)] lg:justify-between">
        {/* Sticky sidebar */}
        <aside className="self-start lg:sticky lg:top-24">
          <div className="rounded-[var(--radius-xs)] border border-[var(--opacity-dark-8)] bg-[var(--surface)] p-[var(--2xl)]">
            <div className="flex items-start justify-between gap-[var(--lg)]">
              <AvatarBlock src={business.image} size={100} showVoice={isVip} />
              <div className="flex items-center gap-[var(--md)]">
                {isVip ? <VipBadge /> : null}
                <button type="button" aria-label="اشتراک‌گذاری" className="size-6">
                  <img
                    alt=""
                    className="size-full"
                    height={24}
                    src={shareIcon}
                    width={24}
                  />
                </button>
              </div>
            </div>
            <div className="mt-[var(--lg)] space-y-1 text-right">
              <h2 className="text-xl font-bold text-[var(--text-title)]">
                {business.name}
              </h2>
              <p className="text-sm leading-relaxed text-[var(--text-body)]">
                {business.description}
              </p>
              <div className="flex items-center justify-start gap-1 text-sm text-[var(--text-body)]">
                <span>{business.location}</span>
                <img
                  alt=""
                  className="size-4"
                  height={16}
                  src={locationIcon}
                  width={16}
                />
              </div>
            </div>
            <div className="mt-[var(--lg)] flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1">
                {isVip ? (
                  <>
                    <Chip label="تخفیف دار" icon={discountIcon} />
                    <Chip label="شرایط اقساطی" icon={convertCardIcon} />
                  </>
                ) : null}
              </div>
              <RatingChip />
            </div>
            <div className="mt-[var(--lg)]">
              <HeroActions phone={business.phone} compact onContact={() => setContactOpen(true)} />
            </div>
          </div>
          <Scoring
            orientation="horizontal"
            className="mt-[var(--3xl)] w-full bg-[var(--surface)]"
          />
        </aside>

        {/* Main column */}
        <div className="space-y-[var(--5xl)]">
          <section className="space-y-[var(--3xl)]">
            <SectionHeading id="services" title="خدمات" icon={shieldTick} />
            <div className="grid grid-cols-2 gap-x-[var(--lg)] gap-y-[var(--md)]">
              {[...serviceItems, ...serviceItems].map((label, i) => (
                <div
                  key={`${label}-${i}`}
                  className="flex items-center justify-start gap-[var(--sm)] text-right"
                >
                  <span className="text-lg text-[var(--text-body)]">{label}</span>
                  <img
                    alt=""
                    className="size-6 shrink-0"
                    height={24}
                    src={tickIcon}
                    width={24}
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              className="flex w-full items-center justify-start gap-2 text-lg font-bold text-[var(--text-title)]"
            >
              مشاهده همه خدمات
              <img alt="" className="size-6" height={24} src={addIcon} width={24} />
            </button>
          </section>

          <section className="space-y-[var(--3xl)]">
            <SectionHeading id="products" title="محصولات" icon={threeSquare} />
            <p className="text-right text-base leading-relaxed text-[var(--text-body)]">
              کلاسیک برگر، چیزبرگر دوبل، برگر مخصوص ایران برگر، سیب‌زمینی مخصوص و
              نوشیدنی‌های تازه.
            </p>
          </section>

          {isVip ? (
            <section className="space-y-[var(--3xl)]">
              <SectionHeading
                id="installment"
                title="شرایط اقساط"
                icon={convertCardIcon}
              />
              <div className="grid grid-cols-2 gap-x-[var(--lg)] gap-y-[var(--2xl)]">
                {installmentItems.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start justify-start gap-[var(--md)] text-right"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-lg font-bold text-[var(--text-title)]">
                        {item.title}
                      </p>
                      <p className="text-base text-[var(--text-body)]">
                        {item.detail}
                      </p>
                    </div>
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-[var(--radius-xs)] bg-secondary-100">
                      <img
                        alt=""
                        className="size-6"
                        height={24}
                        src={convertCardIcon}
                        width={24}
                      />
                    </span>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <section className="space-y-[var(--3xl)]">
            <SectionHeading id="about" title="درباره ما" icon={flagIcon} />
            <p className="text-right text-lg leading-relaxed text-[var(--text-body)]">
              {aboutBody}
            </p>
          </section>

          <section className="space-y-[var(--3xl)]">
            <SectionHeading id="hours" title="ساعات کاری" icon={clockIcon} />
            <ul className="space-y-[var(--md)]">
              {hoursRows.map((row) => (
                <li
                  key={row.day}
                  className="flex items-center justify-between text-lg text-[var(--text-body)]"
                >
                  <span>{row.times}</span>
                  <span className="font-bold text-[var(--text-title)]">
                    {row.day} :
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-[var(--3xl)]">
            <SectionHeading
              id="address"
              title="آدرس و مسیریابی"
              icon={locationIcon}
            />
            <div className="overflow-hidden rounded-[var(--radius-xs)] border border-[var(--opacity-dark-8)]">
              <div className="flex h-[350px] items-center justify-center bg-secondary-100 text-[var(--text-body)]">
                نقشه شیراز
              </div>
              <ul className="divide-y divide-[var(--opacity-dark-8)] bg-[var(--surface)]">
                {branches.map((b, i) => (
                  <li
                    key={b.title}
                    className="flex items-start justify-between gap-[var(--lg)] p-[var(--2xl)] text-right"
                  >
                    {i === 0 ? (
                      <Button size="sm" className="shrink-0">
                        مسیریابی
                      </Button>
                    ) : (
                      <span className="size-10 shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-lg font-bold text-[var(--text-title)]">
                        {b.title}
                      </p>
                      <p className="text-base text-[var(--text-body)]">
                        {b.address}
                      </p>
                    </div>
                    <img
                      alt=""
                      className="mt-1 size-6 shrink-0"
                      height={24}
                      src={locationIcon}
                      width={24}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="space-y-[var(--3xl)] text-right">
            <SectionHeading
              id="socials"
              title="شبکه های اجتماعی"
              icon={shareIcon}
            />
            <div className="flex flex-wrap justify-start gap-3">
              {socials.map((s) => (
                <SocialMediaIcon
                  key={s.label}
                  name={s.name}
                  type="Button"
                  aria-label={s.label}
                  href="#"
                />
              ))}
            </div>
          </section>

          <section className="space-y-[var(--3xl)]">
            <SectionHeading id="comments" title="نظرات کاربران" icon={flagIcon} />
            <div className="grid grid-cols-2 gap-[var(--lg)]">
              {comments.slice(0, 2).map((c) => (
                <article
                  key={c.name}
                  className="space-y-[var(--lg)] rounded-[var(--radius-xs)] border border-[var(--opacity-dark-8)] bg-[var(--surface)] p-[var(--lg)]"
                >
                  <div className="flex items-start justify-between gap-3 text-right">
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-[var(--text-title)]">{c.name}</p>
                      <p className="text-sm text-[var(--text-body)]">{c.date}</p>
                    </div>
                    <UserAvatar size={40} color="gold-neutral" />
                  </div>
                  <p className="line-clamp-4 text-right text-sm leading-relaxed text-[var(--text-body)]">
                    {c.text}
                  </p>
                  <div className="flex items-center justify-between">
                    {c.replies > 0 ? (
                      <span className="text-sm text-[var(--text-body)]">
                        {c.replies} پاسخ ثبت شده
                      </span>
                    ) : (
                      <span />
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setReplyTarget({
                          name: c.name,
                          date: c.date,
                          text: c.text,
                        })
                      }
                    >
                      پاسخ
                    </Button>
                  </div>
                </article>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <Button variant="outline" size="icon" aria-label="قبلی">
                  <img alt="" className="size-6" height={24} src={arrowRight} width={24} />
                </Button>
                <Button variant="outline" size="icon" aria-label="بعدی">
                  <img alt="" className="size-6" height={24} src={arrowLeft} width={24} />
                </Button>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                مشاهده همه
                <img alt="" className="size-5" height={20} src={addIcon} width={20} />
              </Button>
            </div>
            <WriteComment size="desktop" className="w-full" />
          </section>
        </div>
      </div>

      <NewMembers />

      <CallContactSheet
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        phone={business.phone}
      />
      <ReplyCommentSheet
        open={Boolean(replyTarget)}
        onClose={() => setReplyTarget(null)}
        comment={replyTarget}
      />
      <GalleryLightbox
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        items={gallery.map((src, i) => ({
          src,
          isVideo: i === 3,
        }))}
        initialIndex={3}
      />
    </SiteLayout>
  )
}

export { BusinessProfilePage }
