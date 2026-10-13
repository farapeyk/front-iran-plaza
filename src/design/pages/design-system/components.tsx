"use client"

import { useState } from "react"
import { Field } from "@/design/components/ui/field"
import { Label } from "@/design/components/ui/label"
import { Checkbox } from "@/design/components/ui/checkbox"
import { Switch } from "@/design/components/ui/switch"
import { Radio, RadioGroup } from "@/design/components/ui/radio"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/design/components/ui/accordion"
import { Tab, TabsList } from "@/design/components/tab"
import { ModalHeader } from "@/design/components/modal-header"
import { UserAvatar } from "@/design/components/user-avatar"
import { ActiveStatus } from "@/design/components/active-status"
import { LikeButton } from "@/design/components/like-button"
import { Breadcrumb } from "@/design/components/breadcrumb"
import { Scoring } from "@/design/components/scoring"
import { WriteComment } from "@/design/components/write-comment"
import { MediaPlayer } from "@/design/components/media-player"
import { FullScreenAlarm } from "@/design/components/full-screen-alarm"
import { Scroller } from "@/design/components/scroller"
import { SocialMediaIcon, SOCIAL_NAMES } from "@/design/components/social-media-icon"
import { TableOfContent } from "@/design/components/table-of-content"
import { VoicePlayer } from "@/design/components/voice-player"
import { SearchField } from "@/design/components/search-field"
import { Comment } from "@/design/components/comment"
import { NotFound } from "@/design/components/not-found"
import { DsShell } from "@/design/pages/design-system/index"

function DesignSystemComponentsPage() {
  const [tab, setTab] = useState(0)
  const [radio, setRadio] = useState("a")

  return (
    <DsShell title="💠 Design System Components" figma="7395:35852">
      <section className="space-y-[var(--lg)] rounded-[var(--radius-xs)] border border-[var(--border-default)] bg-[var(--surface)] p-[var(--2xl)]">
        <h2 className="text-right text-lg font-bold">Input</h2>
        <div className="me-auto max-w-md space-y-[var(--lg)]">
          <Field label="موضوع" placeholder="محل جای گذاری متن" />
          <Field label="موضوع" placeholder="محل جای گذاری متن" defaultValue="متن فعال" />
          <Field label="موضوع" placeholder="محل جای گذاری متن" error="محل جای گذاری متن خطا" />
          <Field label="موضوع" defaultValue="مقدار قفل‌شده" locked />
          <Field label="موضوع" placeholder="محل جای گذاری متن" disabled />
          <Field placeholder="بدون لیبل" />
        </div>
      </section>

      <section className="space-y-[var(--lg)] rounded-[var(--radius-xs)] border border-[var(--border-default)] bg-[var(--surface)] p-[var(--2xl)]">
        <h2 className="text-right text-lg font-bold">Accordion</h2>
        <Accordion className="rounded-[var(--radius-xs)] border border-[var(--border-default)] px-[var(--lg)]">
          <AccordionItem value="1">
            <AccordionTrigger className="text-right text-lg font-bold">
              سوال نمونه
            </AccordionTrigger>
            <AccordionContent className="text-right text-base leading-relaxed text-[var(--text-title)]">
              پاسخ نمونه برای نمایش استایل آکاردئون.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section className="flex flex-wrap items-center justify-start gap-[var(--5xl)] rounded-[var(--radius-xs)] border border-[var(--border-default)] bg-[var(--surface)] p-[var(--2xl)]">
        <div className="flex items-center gap-[var(--md)]">
          <Label htmlFor="ds-sw">سوییچ (روشن)</Label>
          <Switch id="ds-sw" defaultChecked />
        </div>
        <div className="flex items-center gap-[var(--md)]">
          <Label htmlFor="ds-sw-off">سوییچ (خاموش)</Label>
          <Switch id="ds-sw-off" />
        </div>
        <div className="flex items-center gap-[var(--md)]">
          <Label htmlFor="ds-cb">چک‌باکس</Label>
          <Checkbox id="ds-cb" defaultChecked />
        </div>
        <div className="flex items-center gap-[var(--md)]">
          <span className="text-sm">رادیو</span>
          <RadioGroup
            value={radio}
            onValueChange={(v) => setRadio(String(v))}
            className="flex-row"
          >
            <Radio value="a" />
            <Radio value="b" />
          </RadioGroup>
        </div>
      </section>

      <section className="space-y-[var(--lg)] rounded-[var(--radius-xs)] border border-[var(--border-default)] bg-[var(--surface)] p-[var(--2xl)]">
        <h2 className="text-right text-lg font-bold">User</h2>
        <div className="flex flex-wrap items-end justify-start gap-[var(--lg)]">
          <UserAvatar size={32} color="opacity-dark" />
          <UserAvatar size={40} color="primary" />
          <UserAvatar size={48} color="primary" />
          <UserAvatar size={64} color="secondary" />
          <UserAvatar size={80} color="gold-neutral" />
          <div className="rounded-full bg-primary-950 p-2">
            <UserAvatar size={48} color="opacity-white" />
          </div>
        </div>
      </section>

      <section className="space-y-[var(--lg)] rounded-[var(--radius-xs)] border border-[var(--border-default)] bg-[var(--surface)] p-[var(--2xl)]">
        <h2 className="text-right text-lg font-bold">Tab</h2>
        <TabsList>
          {["گالری", "خدمات", "درباره ما"].map((label, i) => (
            <Tab
              key={label}
              variant="border"
              active={tab === i}
              onClick={() => setTab(i)}
            >
              {label}
            </Tab>
          ))}
        </TabsList>
        <TabsList>
          {["گالری", "خدمات", "درباره ما"].map((label, i) => (
            <Tab
              key={`btn-${label}`}
              variant="button"
              active={tab === i}
              onClick={() => setTab(i)}
            >
              {label}
            </Tab>
          ))}
        </TabsList>
      </section>

      <section className="space-y-[var(--lg)] overflow-hidden rounded-[var(--radius-xs)] border border-[var(--border-default)] bg-[var(--surface)]">
        <h2 className="px-[var(--2xl)] pt-[var(--2xl)] text-right text-lg font-bold">
          Modal Header
        </h2>
        <ModalHeader title="عنوان" showClose showDragHandle />
        <ModalHeader title="عنوان" showClose />
        <ModalHeader title="بازگشت" showClose={false} showBack />
      </section>

      <section className="space-y-[var(--lg)] rounded-[var(--radius-xs)] border border-[var(--border-default)] bg-[var(--surface)] p-[var(--2xl)]">
        <h2 className="text-right text-lg font-bold">Active Status / Like / Breadcrumb</h2>
        <div className="flex flex-wrap items-center justify-start gap-[var(--2xl)] rounded-[var(--radius-xs)] bg-[var(--opacity-dark-8)] p-[var(--lg)]">
          <ActiveStatus active />
          <ActiveStatus active={false} />
        </div>
        <div className="flex items-center justify-start gap-[var(--md)]">
          <LikeButton type="like" />
          <LikeButton type="dislike" />
          <LikeButton type="like" defaultPressed />
          <LikeButton type="dislike" defaultPressed />
        </div>
        <Breadcrumb
          items={[
            { label: "خانه", to: "/" },
            { label: "دسته بندی اول", to: "/businesses" },
            { label: "دسته بندی دوم" },
            { label: "صفحه فعلی" },
          ]}
        />
      </section>

      <section className="space-y-[var(--lg)] rounded-[var(--radius-xs)] border border-[var(--border-default)] bg-[var(--surface)] p-[var(--2xl)]">
        <h2 className="text-right text-lg font-bold">Scoring / Write a comment</h2>
        <Scoring orientation="horizontal" className="w-full max-w-xl me-auto" />
        <Scoring orientation="vertical" className="w-full max-w-sm me-auto" />
        <WriteComment size="mobile" className="me-auto w-full max-w-sm" />
        <WriteComment size="desktop" className="me-auto w-full max-w-lg" />
      </section>

      <section className="space-y-[var(--lg)] rounded-[var(--radius-xs)] border border-[var(--border-default)] bg-[var(--surface)] p-[var(--2xl)]">
        <h2 className="text-right text-lg font-bold">Player / Voice player / Scroller</h2>
        <div className="flex flex-wrap items-center justify-start gap-[var(--lg)]">
          <MediaPlayer size="desktop" />
          <MediaPlayer size="desktop" active />
          <MediaPlayer size="mobile" />
          <VoicePlayer />
          <VoicePlayer defaultPlaying />
          <Scroller height={120} />
        </div>
      </section>

      <section className="space-y-[var(--lg)] rounded-[var(--radius-xs)] border border-[var(--border-default)] bg-[var(--surface)] p-[var(--2xl)]">
        <h2 className="text-right text-lg font-bold">Social media icon</h2>
        <div className="flex flex-wrap items-center justify-start gap-[var(--md)]">
          {SOCIAL_NAMES.map((name) => (
            <SocialMediaIcon key={`btn-${name}`} name={name} type="Button" />
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-start gap-[var(--md)]">
          {SOCIAL_NAMES.map((name) => (
            <SocialMediaIcon key={`ico-${name}`} name={name} type="Icon" />
          ))}
        </div>
      </section>

      <section className="space-y-[var(--lg)] rounded-[var(--radius-xs)] border border-[var(--border-default)] bg-[var(--surface)] p-[var(--2xl)]">
        <h2 className="text-right text-lg font-bold">Table of content</h2>
        <div className="flex flex-col items-start gap-[var(--lg)]">
          <TableOfContent />
          <TableOfContent defaultOpen />
        </div>
      </section>

      <section className="space-y-[var(--lg)] rounded-[var(--radius-xs)] border border-[var(--border-default)] bg-[var(--surface)] p-[var(--2xl)]">
        <h2 className="text-right text-lg font-bold">Search</h2>
        <div className="me-auto flex w-full max-w-sm flex-col gap-[var(--lg)]">
          <SearchField />
          <SearchField defaultValue="عنوان جستجو" />
        </div>
      </section>

      <section className="space-y-[var(--lg)] rounded-[var(--radius-xs)] border border-[var(--border-default)] bg-[var(--surface)] p-[var(--2xl)]">
        <h2 className="text-right text-lg font-bold">Comment / Not found</h2>
        <div className="me-auto flex w-full max-w-sm flex-col gap-[var(--2xl)]">
          <Comment />
          <Comment
            name="سجاد"
            replies={[
              {
                name: "علی",
                date: "۱۴۰۴/۰۶/۲۸",
                text: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است",
              },
            ]}
          />
          <Comment
            name="پوریا"
            repliesCount={6}
            replies={[
              {
                name: "فرشاد",
                date: "۱۴۰۴/۰۶/۲۸",
                text: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است",
              },
              {
                name: "علیرضا",
                date: "۱۴۰۴/۰۶/۲۸",
                text: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است",
              },
            ]}
          />
          <NotFound description="نتیجه‌ای برای جستجوی شما پیدا نشد." />
        </div>
      </section>

      <section className="space-y-[var(--lg)] rounded-[var(--radius-xs)] border border-[var(--border-default)] bg-[var(--surface)] p-[var(--2xl)]">
        <h2 className="text-right text-lg font-bold">Full Screen Alarm</h2>
        <div className="grid gap-[var(--2xl)] lg:grid-cols-2">
          <FullScreenAlarm
            variant="success"
            title={
              <>
                ثبت نام شما
                <br />
                با موفقیت انجام شد
              </>
            }
            description="لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است."
            primaryAction={{ label: "برو به پروفایل من", to: "/dashboard" }}
          />
          <FullScreenAlarm
            variant="info"
            title="لورم اپیسوم متن خانگی"
            description="لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است."
            primaryAction={{
              label: "بازگشت به صفحه خانه",
              to: "/",
              showBackIcon: true,
            }}
          />
        </div>
      </section>
    </DsShell>
  )
}

export { DesignSystemComponentsPage }
