"use client";
import Image from "next/image";
import { MapPin, Phone, Share2 } from "lucide-react";
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { SiteLayout } from '@/design/components/site-layout';
import { UserAvatar } from '@/design/components/user-avatar';
import { GalleryProfile } from '@/design/components/gallery-profile';
import { GalleryLightbox } from '@/design/components/gallery-lightbox';
import { Scoring } from '@/design/components/scoring';
import { WriteComment } from '@/design/components/write-comment';
import { CallContactSheet } from '@/design/components/call-contact-sheet';
import { NewMembers } from '@/design/components/new-members';
import { Button } from '@/design/components/ui/button';
import { Accordion,AccordionContent,AccordionItem,AccordionTrigger } from '@/design/components/ui/accordion';
import { Tab,TabsList } from '@/design/components/tab';
import { FavoriteButton } from '@/features/public/components/favorite-button';
import { submitReviewAction,submitReviewReplyAction } from '@/features/public/actions/reviews.action';
import { WEEKDAYS } from '@/features/business/types/business-profile';
import { BusinessLocations, BusinessProfileTags } from '@/features/public/components/business-locations';
import { SocialMediaIcon } from '@/design/components/social-media-icon';
import { socialLinks } from '@/design/api/socials';
import type { BusinessControllerGetFullBySlug200 } from '@/design/api/generated/models/businessControllerGetFullBySlug200';
import type { ReviewData } from '@/features/public/types/review';
import { ReviewRepliesDialog } from '@/features/public/components/review-replies-dialog';
import { AboutText, BusinessBrandVideo } from '@/features/public/components/business-profile-media';
import { VipBadge } from '@/design/components/vip-badge';
import type { BusinessProfileControllerGetFeatures200Item } from '@/design/api/generated/models/businessProfileControllerGetFeatures200Item';
import { ReplyCommentSheet, type ReplyComment } from '@/design/components/reply-comment-sheet';
import { BusinessProfileSummary } from '@/features/public/components/business-profile-summary';

const fileUrl=(id:string)=>'/api/backend/files/'+encodeURIComponent(id);
function shareBusinessProfile(name:string,showMessage:(message:string)=>void) {
  const url=window.location.href;
  if(navigator.share) void navigator.share({title:name,url}).catch(()=>{});
  else void navigator.clipboard.writeText(url).then(()=>showMessage("\u0644\u06cc\u0646\u06a9 \u06a9\u067e\u06cc \u0634\u062f.")).catch(()=>showMessage("\u06a9\u067e\u06cc \u0644\u06cc\u0646\u06a9 \u0627\u0646\u062c\u0627\u0645 \u0646\u0634\u062f."));
}

function formatServicePrice(priceFrom: string | null, priceTo: string | null) {
  const from = priceFrom == null ? null : Number(priceFrom).toLocaleString('fa-IR');
  const to = priceTo == null ? null : Number(priceTo).toLocaleString('fa-IR');

  if (from && to && priceFrom !== priceTo) return `${from} تا ${to} تومان`;
  if (from) return `از ${from} تومان`;
  if (to) return `تا ${to} تومان`;
  return 'قیمت با هماهنگی';
}

function BusinessFeatures({features}:{features:BusinessProfileControllerGetFeatures200Item[]}) {
  const visibleFeatures=features.filter(feature=>feature.isActive!==false);

  if(!visibleFeatures.length) return <p>ویژگی‌ای برای این کسب‌وکار ثبت نشده است.</p>;

  return <ul className="business-features grid gap-3 sm:grid-cols-2">
    {visibleFeatures.map(feature=><li key={feature.id} className="flex items-center gap-3 rounded-[var(--radius-xs)] border border-primary-100 bg-[var(--surface)] px-4 py-3 font-bold text-[var(--text-title)]">
      <Image src="/design/icons/tick-circle.svg" width={24} height={24} alt="" className="size-6 shrink-0"/>
      <span>{feature.label}</span>
    </li>)}
  </ul>;
}

function BusinessOfferings({business}:{business:BusinessControllerGetFullBySlug200}) {
  const activeProducts=business.products.filter(product=>product.isActive);
  const activeServices=business.services.filter(service=>service.isActive!==false);
  const [offeringTab,setOfferingTab]=useState<'products'|'services'>(activeProducts.length?'products':'services');
  const [productCategory,setProductCategory]=useState('all');
  const visibleProducts=activeProducts.filter(product=>productCategory==='all'||product.productCategoryId===productCategory);
  const showOfferingTabs=activeProducts.length>0&&activeServices.length>0;

  return <div className="business-offerings space-y-6">
    {showOfferingTabs&&<div className="business-offering-tabs grid grid-cols-2 rounded-full bg-primary-50 p-1" role="tablist" aria-label="محصولات و خدمات">
      <button
        type="button"
        role="tab"
        aria-selected={offeringTab==='products'}
        onClick={()=>setOfferingTab('products')}
        className={offeringTab==='products'?'is-active':''}
      >
        <Image src="/design/icons/three-square.svg" width={20} height={20} alt=""/>
        محصولات
        <span>{activeProducts.length.toLocaleString('fa-IR')}</span>
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={offeringTab==='services'}
        onClick={()=>setOfferingTab('services')}
        className={offeringTab==='services'?'is-active':''}
      >
        <Image src="/design/icons/briefcase.svg" width={20} height={20} alt=""/>
        خدمات
        <span>{activeServices.length.toLocaleString('fa-IR')}</span>
      </button>
    </div>}

    {offeringTab==='products'?<div role="tabpanel" aria-label="محصولات" className="space-y-6">
      <div className="flex gap-4 overflow-x-auto border-b border-[var(--border-subtle)] pb-2" aria-label="دسته‌بندی محصولات">
        {[{id:'all',name:'همه'},...business.productCategories.filter(category=>category.isActive)].map(category=><button
          type="button"
          key={category.id}
          aria-pressed={productCategory===category.id}
          onClick={()=>setProductCategory(category.id)}
          className={'shrink-0 py-2 text-sm '+(productCategory===category.id?'border-b-2 border-primary-500 font-bold text-primary-700':'text-[var(--text-body)]')}
        >{category.name}</button>)}
      </div>
      <div className="business-products grid gap-4">
        {visibleProducts.map(product=><article key={product.id} className="rounded border p-4">
          {product.imageId&&<Image src={fileUrl(product.imageId)} alt={product.name} width={800} height={800} sizes="(min-width: 1024px) 33vw, 100vw" className="mb-3 aspect-square w-full rounded object-cover"/>}
          <h3 className="font-bold">{product.name}</h3>
          {product.description&&<p>{product.description}</p>}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            {product.discountPercent>0&&<del className="text-red-500">{Number(product.price).toLocaleString('fa-IR')}</del>}
            <span className="font-bold text-primary-500">{(Number(product.price)*(1-product.discountPercent/100)).toLocaleString('fa-IR')} تومان</span>
          </div>
        </article>)}
      </div>
      {!visibleProducts.length&&<p>محصولی در این دسته ثبت نشده است.</p>}
    </div>:<div role="tabpanel" aria-label="خدمات" className="business-services-grid grid gap-4 sm:grid-cols-2">
      {activeServices.map(service=><article key={service.id} className="business-service-card relative overflow-hidden rounded-[var(--radius-md)] border border-primary-100 p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <span className="flex size-11 items-center justify-center rounded-full bg-primary-700 shadow-sm">
            <Image src="/design/icons/briefcase.svg" width={22} height={22} alt="" className="brightness-0 invert"/>
          </span>
          {service.durationMin!=null&&<span className="rounded-full bg-[var(--surface)] px-3 py-1 text-xs font-bold text-primary-700">{service.durationMin.toLocaleString('fa-IR')} دقیقه</span>}
        </div>
        <h3 className="text-lg font-black text-[var(--text-title)]">{service.name}</h3>
        {service.description&&<p className="mt-2 text-sm leading-7 text-[var(--text-body)]">{service.description}</p>}
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-primary-100 pt-4">
          <span className="text-xs text-[var(--text-muted)]">هزینه خدمت</span>
          <strong className="text-sm text-primary-700">{formatServicePrice(service.priceFrom,service.priceTo)}</strong>
        </div>
      </article>)}
      {!activeServices.length&&<p className="sm:col-span-2">خدمتی برای این کسب‌وکار ثبت نشده است.</p>}
    </div>}
  </div>;
}

export function BusinessLivePage({business,reviews,favorited,features}:{business:BusinessControllerGetFullBySlug200;reviews:ReviewData[];favorited:boolean;features:BusinessProfileControllerGetFeatures200Item[]}) {
  const router=useRouter();
  const [contact,setContact]=useState(false);
  const [galleryOpen,setGalleryOpen]=useState(false);
  const [rating,setRating]=useState(0);
  const [message,setMessage]=useState('');
  const [pending,startTransition]=useTransition();
  const [reply,setReply]=useState<(ReplyComment&{id:string})|null>(null);
  const [active,setActive]=useState('gallery');
  const [expanded,setExpanded]=useState<string[]>([]);
  const [galleryIndex,setGalleryIndex]=useState(0);
  const logo=business.logoId?fileUrl(business.logoId):'/design/icons/briefcase.svg';
  const activeVip=business.planType==='VIP'&&!!business.planExpiryDate&&new Date(business.planExpiryDate)>new Date();
  const gallery=business.gallery.map(image=>({src:fileUrl(image.fileId),isVideo:false}));
  const ratedReviews=reviews.filter(review=>review.rating!=null); const average=ratedReviews.length?ratedReviews.reduce((sum,review)=>sum+(review.rating??0),0)/ratedReviews.length:0;
  const rotateGallery=(direction:number)=>setGalleryIndex(index=>(index+direction+gallery.length)%gallery.length);
  const galleryItems=[...gallery.slice(galleryIndex),...gallery.slice(0,galleryIndex)];
  const sections=[
    ...(features.length?[{id:'features',title:'ویژگی‌های کسب‌وکار',icon:'tick-circle',body:<BusinessFeatures features={features}/>}] : []),
    {id:'products',title:'محصولات',icon:'three-square',body:<BusinessOfferings business={business}/>},
    ...(business.installmentPlan?.isActive?[{id:'installment',title:'شرایط اقساط',icon:'convert-card',body:<div className="grid gap-4 sm:grid-cols-2"><p>پیش‌پرداخت: {business.installmentPlan.minDownPaymentPercent}٪</p><p>سود ماهانه: {business.installmentPlan.monthlyInterestPercent}٪</p><p>بازپرداخت: {business.installmentPlan.repaymentPeriodsMonths.join('، ')} ماه</p><p>{business.installmentPlan.guaranteeNote}</p></div>}]:[]),
    {id:'about',title:'درباره ما',icon:'flag',body:<AboutText text={business.aboutText??business.description??''}/>},
    {id:'socials',title:'شبکه‌های اجتماعی',icon:'share',body:<div className="flex flex-wrap gap-3">{socialLinks(business.socialMedia).map(link=><SocialMediaIcon key={link.name} {...link} type="Button"/>)}</div>},
    {id:'hours',title:'ساعات کاری',icon:'clock',body:<ul className="business-hours space-y-3">{business.workingHours.map(h=><li key={h.weekday} className="flex justify-between"><strong>{WEEKDAYS.find(d=>d.value===h.weekday)?.label}</strong><span dir="ltr">{h.openTime1&&h.closeTime1?`${h.openTime1} â€“ ${h.closeTime1}`:'تعطیل'}{h.isTwoShift&&h.openTime2&&h.closeTime2?` / ${h.openTime2} â€“ ${h.closeTime2}`:''}</span></li>)}</ul>},
    {id:'address',title:'آدرس و مسیریابی',icon:'location',body:<BusinessLocations business={business} features={features}/>},
  ];
  const scrollTo=(id:string)=>{setActive(id);const mobile=matchMedia('(max-width: 1023px)').matches;if(mobile&&id!=='gallery'&&id!=='comments')setExpanded(previous=>previous.includes(id)?previous:[...previous,id]);requestAnimationFrame(()=>document.getElementById(id==='gallery'?id:(mobile?'mobile-':'desktop-')+id)?.scrollIntoView({behavior:'smooth',block:'start'}));};
  const submit=(comment:string)=>{if(!rating&&!comment.trim()){setMessage('متن نظر یا امتیاز را وارد کنید.');return;}startTransition(async()=>{const result=await submitReviewAction(business.id,{rating:rating||undefined,comment:comment.trim()||undefined});setMessage(result.success?'نظر شما ثبت شد و پس از بررسی نمایش داده می‌شود.':result.message);if(result.success)router.refresh();});};
  const reviewSection=<section className="business-section scroll-mt-20 space-y-6"><h2 className="text-xl font-bold">نظرات کاربران ({reviews.length})</h2><div className="grid gap-4 sm:grid-cols-2">{reviews.map(r=><article key={r.id} className="space-y-3 rounded-[var(--radius-xs)] border bg-[var(--surface)] p-4"><div className="flex items-center gap-3"><UserAvatar size={40}/><h3 className="font-bold">{r.user.fullName??'کاربر'}</h3></div><p className="text-sm">{new Date(r.createdAt).toLocaleDateString('fa-IR',{timeZone:'Asia/Tehran'})} Â· {r.rating==null?'بدون امتیاز':(r.rating+' از ۵')}</p><p>{r.comment}</p><ReviewRepliesDialog replies={r.replies}/><Button variant="outline" size="sm" onClick={()=>setReply({id:r.id,name:r.user.fullName??'کاربر',date:new Date(r.createdAt).toLocaleDateString('fa-IR',{timeZone:'Asia/Tehran'}),text:r.comment??''})}>پاسخ</Button></article>)}</div><Scoring average={average} count={ratedReviews.length} value={rating} onChange={setRating}/><fieldset disabled={pending}><WriteComment onSubmit={submit}/></fieldset>{message&&<p role="status">{message}</p>}</section>;
  return <SiteLayout className="reference-business">
    <BusinessProfileSummary
      business={business}
      logo={logo}
      isVip={activeVip}
      average={average}
      reviewCount={ratedReviews.length}
      rating={rating}
      onRatingChange={setRating}
      onAddress={()=>scrollTo('address')}
      onContact={()=>setContact(true)}
      onShare={()=>shareBusinessProfile(business.name,setMessage)}
    />
    <div className="business-tabs sticky top-0 z-20 border-b border-[var(--border-default)]"><div className="business-container flex items-center gap-2"><TabsList className="min-w-0 flex-1 justify-start">{[{id:'gallery',title:'گالری'},...sections,{id:'comments',title:'نظرات'}].map(s=><Tab key={s.id} active={active===s.id} variant="border" onClick={()=>scrollTo(s.id)}>{s.title}</Tab>)}</TabsList><FavoriteButton businessId={business.id} initialFavorited={favorited}/></div></div>
    <section id="gallery" className="business-container business-gallery scroll-mt-20">
      {gallery.length>0&&<button type="button" onClick={()=>setGalleryOpen(true)} className="block w-full" aria-label="باز کردن گالری"><GalleryProfile items={galleryItems} className="w-full max-lg:h-[180px] lg:h-[400px]"/></button>}
      {gallery.length>0&&<div className="gallery-controls"><Button variant="outline" size="sm" onClick={()=>setGalleryOpen(true)}>مشاهده همه گالری</Button><div className="flex gap-3"><Button variant="outline" size="icon" aria-label="عکس قبلی" disabled={gallery.length<2} onClick={()=>rotateGallery(-1)}><Image src="/design/icons/arrow-right.svg" alt="" width={20} height={20}/></Button><Button variant="outline" size="icon" aria-label="عکس بعدی" disabled={gallery.length<2} onClick={()=>rotateGallery(1)}><Image src="/design/icons/arrow-left.svg" alt="" width={20} height={20}/></Button></div></div>}

    </section>
    <div className="business-container pb-10">
      <div className="lg:hidden"><Accordion value={expanded} onValueChange={setExpanded}>{sections.map(s=><AccordionItem key={s.id} value={s.id} id={'mobile-'+s.id} className="scroll-mt-20"><AccordionTrigger><span>{s.title}</span></AccordionTrigger><AccordionContent>{s.body}</AccordionContent></AccordionItem>)}</Accordion><div id="mobile-comments" className="mt-8 scroll-mt-20">{reviewSection}</div></div>
      <div className="business-columns hidden"><aside className="business-sidebar sticky top-24 self-start"><div className="business-sidebar-card rounded"><div className="mb-5 flex items-center justify-between">{activeVip&&<VipBadge/>}<Button variant="outline" size="icon" aria-label="Share profile" onClick={()=>shareBusinessProfile(business.name,setMessage)}><Share2 size={18}/></Button></div><BusinessBrandVideo videoId={business.introVideoId} imageSrc={logo} name={business.name} size="small"/><h2>{business.name}</h2><p>{business.description}</p><p className="flex items-start gap-2"><MapPin size={18} className="mt-1 shrink-0"/>{business.address}</p><BusinessProfileTags business={business} features={features}/><div className="mt-6 flex flex-wrap gap-2"><Button variant="secondary" size="sm" onClick={()=>scrollTo('address')}><MapPin size={16}/>آدرس</Button><Button size="sm" onClick={()=>setContact(true)}><Phone size={16}/>تماس و واتساپ</Button></div></div><Scoring orientation="vertical" average={average} count={ratedReviews.length} value={rating} onChange={setRating}/></aside><div className="business-content min-w-0 space-y-[var(--5xl)]">{sections.map(s=><section key={s.id} id={'desktop-'+s.id} className="business-section scroll-mt-20 space-y-6"><h2 className="flex items-center gap-3 font-bold"><Image src={'/design/icons/'+s.icon+'.svg'} alt="" width={24} height={24}/>{s.title}</h2>{s.body}</section>)}<div id="desktop-comments" className="scroll-mt-20">{reviewSection}</div></div></div>
    </div>
    {business.categories.length>0&&<NewMembers className="business-similar" title={"\u06a9\u0633\u0628 \u0648 \u06a9\u0627\u0631\u0647\u0627\u06cc \u0645\u0634\u0627\u0628\u0647"} categoryId={business.categories[0]?.category.id} excludeBusinessId={business.id}/>}<GalleryLightbox open={galleryOpen} onClose={()=>setGalleryOpen(false)} items={gallery}/><CallContactSheet open={contact} onClose={()=>setContact(false)} phone={business.phone} whatsapp={business.whatsapp??undefined} socialMedia={business.socialMedia}/>
    <ReplyCommentSheet open={!!reply} comment={reply} onClose={()=>setReply(null)} onSubmit={text=>{if(!reply)return;startTransition(async()=>{const result=await submitReviewReplyAction(reply.id,text);setMessage(result.success?'پاسخ ثبت شد.':result.message);if(result.success)router.refresh();});}}/>
  </SiteLayout>;
}
