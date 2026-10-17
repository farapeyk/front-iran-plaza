"use client";
import Image from "next/image";
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
import { BusinessLocationMap } from '@/features/public/components/business-location-map';
import { SocialMediaIcon } from '@/design/components/social-media-icon';
import { socialLinks } from '@/design/api/socials';
import { Link } from '@/design/navigation';
import type { BusinessControllerGetFullBySlug200 } from '@/design/api/generated/models/businessControllerGetFullBySlug200';
import type { ReviewData } from '@/features/public/types/review';
import type { BusinessProfileControllerGetFeatures200Item } from '@/design/api/generated/models/businessProfileControllerGetFeatures200Item';
import { ReplyCommentSheet, type ReplyComment } from '@/design/components/reply-comment-sheet';

const fileUrl=(id:string)=>'/api/backend/files/'+encodeURIComponent(id);

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

  return <div className="business-offerings space-y-6">
    <div className="business-offering-tabs grid grid-cols-2 rounded-full bg-primary-50 p-1" role="tablist" aria-label="محصولات و خدمات">
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
    </div>

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
  const gallery=business.gallery.map(image=>({src:fileUrl(image.fileId),isVideo:false}));
  const average=reviews.length?reviews.reduce((sum,r)=>sum+r.rating,0)/reviews.length:0;
  const rotateGallery=(direction:number)=>setGalleryIndex(index=>(index+direction+gallery.length)%gallery.length);
  const galleryItems=[...gallery.slice(galleryIndex),...gallery.slice(0,galleryIndex)];
  const sections=[
    ...(features.length?[{id:'features',title:'ویژگی‌های کسب‌وکار',icon:'tick-circle',body:<BusinessFeatures features={features}/>}] : []),
    {id:'products',title:'محصولات',icon:'three-square',body:<BusinessOfferings business={business}/>},
    ...(business.installmentPlan?.isActive?[{id:'installment',title:'شرایط اقساط',icon:'convert-card',body:<div className="grid gap-4 sm:grid-cols-2"><p>پیش‌پرداخت: {business.installmentPlan.minDownPaymentPercent}٪</p><p>سود ماهانه: {business.installmentPlan.monthlyInterestPercent}٪</p><p>بازپرداخت: {business.installmentPlan.repaymentPeriodsMonths.join('، ')} ماه</p><p>{business.installmentPlan.guaranteeNote}</p></div>}]:[]),
    {id:'about',title:'درباره ما',icon:'flag',body:<p className="whitespace-pre-line">{business.aboutText??business.description}</p>},
    {id:'socials',title:'شبکه‌های اجتماعی',icon:'share',body:<div className="flex flex-wrap gap-3">{socialLinks(business.socialMedia).map(link=><SocialMediaIcon key={link.name} {...link} type="Button"/>)}</div>},
    {id:'hours',title:'ساعات کاری',icon:'clock',body:<ul className="business-hours space-y-3">{business.workingHours.map(h=><li key={h.weekday} className="flex justify-between"><strong>{WEEKDAYS.find(d=>d.value===h.weekday)?.label}</strong><span dir="ltr">{h.openTime1&&h.closeTime1?`${h.openTime1} – ${h.closeTime1}`:'تعطیل'}{h.isTwoShift&&h.openTime2&&h.closeTime2?` / ${h.openTime2} – ${h.closeTime2}`:''}</span></li>)}</ul>},
    {id:'address',title:'آدرس و مسیریابی',icon:'location',body:<div className="space-y-4 rounded border border-[var(--border-subtle)]">{business.latitude!=null&&business.longitude!=null&&<BusinessLocationMap latitude={business.latitude} longitude={business.longitude}/>}<p className="px-5">{business.address}</p><ul className="px-5 divide-y">{business.branches.map(b=><li key={b.id} className="py-4"><strong>{b.title}</strong><p>{b.address}</p>{b.phone&&<a href={'tel:'+b.phone}>{b.phone}</a>}</li>)}</ul></div>},
  ];
  const scrollTo=(id:string)=>{setActive(id);const mobile=matchMedia('(max-width: 1023px)').matches;if(mobile&&id!=='gallery'&&id!=='comments')setExpanded(previous=>previous.includes(id)?previous:[...previous,id]);requestAnimationFrame(()=>document.getElementById(id==='gallery'?id:(mobile?'mobile-':'desktop-')+id)?.scrollIntoView({behavior:'smooth',block:'start'}));};
  const submit=(comment:string)=>{if(!rating){setMessage('ابتدا امتیاز خود را انتخاب کنید.');return;}startTransition(async()=>{const result=await submitReviewAction(business.id,{rating,comment});setMessage(result.success?'نظر شما ثبت شد و پس از بررسی نمایش داده می‌شود.':result.message);if(result.success)router.refresh();});};
  const reviewSection=<section className="business-section scroll-mt-20 space-y-6"><h2 className="text-xl font-bold">نظرات کاربران ({reviews.length})</h2><div className="grid gap-4 sm:grid-cols-2">{reviews.map(r=><article key={r.id} className="space-y-3 rounded-[var(--radius-xs)] border bg-[var(--surface)] p-4"><div className="flex items-center gap-3"><UserAvatar size={40}/><h3 className="font-bold">{r.user.fullName??'کاربر'}</h3></div><p className="text-sm">{new Date(r.createdAt).toLocaleDateString('fa-IR',{timeZone:'Asia/Tehran'})} · {r.rating} از ۵</p><p>{r.comment}</p>{r.replies.map(answer=><blockquote key={answer.id} className="border-s-2 ps-3">{answer.comment}</blockquote>)}<Button variant="outline" size="sm" onClick={()=>setReply({id:r.id,name:r.user.fullName??'کاربر',date:new Date(r.createdAt).toLocaleDateString('fa-IR',{timeZone:'Asia/Tehran'}),text:r.comment??''})}>پاسخ</Button></article>)}</div><Scoring average={average} count={reviews.length} value={rating} onChange={setRating}/><fieldset disabled={pending}><WriteComment onSubmit={submit}/></fieldset>{message&&<p role="status">{message}</p>}</section>;
  return <SiteLayout className="reference-business">
    <nav className="business-container business-breadcrumb"><Link to="/">خانه</Link> / <Link to="/businesses">کسب‌وکارها</Link> / {business.name}</nav>
    <section className="business-container business-header flex flex-col items-center gap-4 text-center lg:flex-row lg:justify-between lg:text-start">
      <div className="flex flex-col items-center gap-4 lg:flex-row"><Image src={logo} width={140} height={140} alt={business.name} className="size-[100px] rounded-full border-[6px] border-secondary-25 object-cover lg:size-[140px]"/><div className="space-y-2"><h1 className="text-[length:var(--text-h1)] font-black">{business.name}</h1><p>{business.description}</p><p className="text-sm">{business.address}</p></div></div>
      <div className="flex flex-wrap items-center justify-center gap-3"><FavoriteButton businessId={business.id} initialFavorited={favorited}/><Button variant="secondary" onClick={()=>scrollTo('address')}>آدرس</Button><Button onClick={()=>setContact(true)}>تماس و واتساپ</Button><Button variant="outline" onClick={()=>{if(navigator.share)void navigator.share({title:business.name,url:location.href}).catch(()=>{});else void navigator.clipboard.writeText(location.href).then(()=>setMessage('لینک کپی شد.')).catch(()=>setMessage('کپی لینک انجام نشد.'));}}>اشتراک‌گذاری</Button></div>
    </section>
    <div className="business-tabs sticky top-0 z-20 border-b"><TabsList className="business-container justify-start">{[{id:'gallery',title:'گالری'},...sections,{id:'comments',title:'نظرات'}].map(s=><Tab key={s.id} active={active===s.id} variant="border" onClick={()=>scrollTo(s.id)}>{s.title}</Tab>)}</TabsList></div>
    <section id="gallery" className="business-container business-gallery scroll-mt-20">
      {gallery.length>0&&<button type="button" onClick={()=>setGalleryOpen(true)} className="block w-full" aria-label="باز کردن گالری"><GalleryProfile items={galleryItems} className="w-full max-lg:h-[180px] lg:h-[400px]"/></button>}
      {gallery.length>0&&<div className="gallery-controls"><Button variant="outline" size="sm" onClick={()=>setGalleryOpen(true)}>مشاهده همه گالری</Button><div className="flex gap-3"><Button variant="outline" size="icon" aria-label="عکس قبلی" disabled={gallery.length<2} onClick={()=>rotateGallery(-1)}><Image src="/design/icons/arrow-right.svg" alt="" width={20} height={20}/></Button><Button variant="outline" size="icon" aria-label="عکس بعدی" disabled={gallery.length<2} onClick={()=>rotateGallery(1)}><Image src="/design/icons/arrow-left.svg" alt="" width={20} height={20}/></Button></div></div>}
      {business.introVideoId&&<video controls preload="metadata" src={fileUrl(business.introVideoId)} className="mt-4 max-h-[400px] w-full rounded"/>}
    </section>
    <div className="business-container pb-10">
      <div className="lg:hidden"><Accordion value={expanded} onValueChange={setExpanded}>{sections.map(s=><AccordionItem key={s.id} value={s.id} id={'mobile-'+s.id} className="scroll-mt-20"><AccordionTrigger><span>{s.title}</span></AccordionTrigger><AccordionContent>{s.body}</AccordionContent></AccordionItem>)}</Accordion><div id="mobile-comments" className="mt-8 scroll-mt-20">{reviewSection}</div></div>
      <div className="business-columns hidden"><aside className="business-sidebar self-start"><div className="business-sidebar-card rounded"><div className="mb-5 flex justify-between"><Image src="/design/icons/share.svg" alt="" width={20} height={20}/></div><Image src={logo} alt="" width={100} height={100} className="size-[100px] rounded-full object-cover"/><h2>{business.name}</h2><p>{business.description}</p><p>{business.address}</p><div className="mt-6 flex flex-wrap gap-2"><Button variant="secondary" size="sm" onClick={()=>scrollTo('address')}>آدرس</Button><Button size="sm" onClick={()=>setContact(true)}>تماس و واتساپ</Button></div></div><Scoring orientation="vertical" average={average} count={reviews.length} value={rating} onChange={setRating}/></aside><div className="business-content min-w-0 space-y-[var(--5xl)]">{sections.map(s=><section key={s.id} id={'desktop-'+s.id} className="business-section scroll-mt-20 space-y-6"><h2 className="flex items-center gap-3 font-bold"><Image src={'/design/icons/'+s.icon+'.svg'} alt="" width={24} height={24}/>{s.title}</h2>{s.body}</section>)}<div id="desktop-comments" className="scroll-mt-20">{reviewSection}</div></div></div>
    </div>
    <NewMembers className="business-similar" title="کسب و کارهای مشابه"/><GalleryLightbox open={galleryOpen} onClose={()=>setGalleryOpen(false)} items={gallery}/><CallContactSheet open={contact} onClose={()=>setContact(false)} phone={business.phone} whatsapp={business.whatsapp??undefined} socialMedia={business.socialMedia}/>
    <ReplyCommentSheet open={!!reply} comment={reply} onClose={()=>setReply(null)} onSubmit={text=>{if(!reply)return;startTransition(async()=>{const result=await submitReviewReplyAction(reply.id,text);setMessage(result.success?'پاسخ ثبت شد.':result.message);if(result.success)router.refresh();});}}/>
  </SiteLayout>;
}
