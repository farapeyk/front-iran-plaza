import Image from "next/image";
import Link from "next/link";

import { CipBadge } from "@/design/components/cip-badge";
import type { ContentBusiness } from "@/features/content/types";

import styles from "./article-business-list.module.css";

const locationIcon = "/design/icons/location.svg";
const callIcon = "/design/icons/call.svg";

const fileUrl = (id: string) => `/api/backend/files/${encodeURIComponent(id)}`;

function businessInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  return (words.length > 1 ? `${words[0]?.[0] ?? ""}${words[1]?.[0] ?? ""}` : words[0]?.slice(0, 2)) || "کسب";
}

function callablePhone(phone: string) {
  const normalized = phone.trim().replace(/[\s()-]/g, "");
  return /^\+?\d+$/.test(normalized) ? normalized : null;
}

function hasActiveVipPlan(business: ContentBusiness) {
  if (business.planType !== "VIP" || !business.planExpiryDate) return false;
  const expiry = new Date(business.planExpiryDate).getTime();
  return Number.isFinite(expiry) && expiry > Date.now();
}

function ArticleBusinessCard({ business }: { business: ContentBusiness }) {
  const phone = callablePhone(business.phone);
  const href = `/businesses/${business.slug}`;
  const address = [business.city, business.neighborhood, business.address].filter(Boolean).join("، ") || "آدرس ثبت نشده است.";
  const isVip = hasActiveVipPlan(business);

  return (
    <article className={styles.card} data-slot="article-business-card" data-vip={isVip ? "true" : "false"}>
      <div className={styles.identity}>
        {business.logoId ? (
          <Image
            alt=""
            className={styles.logo}
            height={58}
            sizes="(max-width: 850px) 44px, 58px"
            src={fileUrl(business.logoId)}
            width={58}
          />
        ) : (
          <span aria-hidden="true" className={`${styles.logo} ${styles.placeholder}`}>{businessInitials(business.name)}</span>
        )}
        <h3 className={styles.title}><Link href={href}>{business.name}</Link></h3>
        {isVip || business.isCip ? (
          <div className={styles.badges}>
            {isVip ? <span aria-label="عضو ویژه" className={styles.vip}>VIP</span> : null}
            {business.isCip ? <CipBadge className={styles.cip} /> : null}
          </div>
        ) : null}
      </div>

      <div className={styles.address}>
        <Image alt="" aria-hidden="true" className={styles.icon} height={20} src={locationIcon} width={20} />
        <p>{address}</p>
      </div>

      <div className={styles.actions}>
        {phone ? (
          <a aria-label={`تماس با ${business.name}`} className={styles.button} href={`tel:${phone}`}>
            <Image alt="" aria-hidden="true" className={styles.icon} height={20} src={callIcon} width={20} />
            <span>تماس</span>
          </a>
        ) : (
          <span aria-disabled="true" aria-label={`شماره تماس ${business.name} ثبت نشده است`} className={styles.button} role="link">
            <Image alt="" aria-hidden="true" className={styles.icon} height={20} src={callIcon} width={20} />
            <span>تماس</span>
          </span>
        )}
        <Link aria-label={`مشاهده پروفایل ${business.name}`} className={`${styles.button} ${styles.primary}`} href={href}>
          مشاهده پروفایل
        </Link>
      </div>
    </article>
  );
}

export function ArticleBusinessList({ title, businesses }: { title?: string; businesses: ContentBusiness[] }) {
  return (
    <section className={styles.list} data-slot="article-business-list">
      {title ? <h2 className={styles.heading}>{title}</h2> : null}
      <div className={styles.rows}>
        {businesses.map(business => <ArticleBusinessCard business={business} key={business.id} />)}
      </div>
    </section>
  );
}
