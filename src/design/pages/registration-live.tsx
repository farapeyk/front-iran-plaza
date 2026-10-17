"use client";
import Image from "next/image";
import {SiteLayout} from '@/design/components/site-layout';
import {FreeRegistrationPromo} from '@/design/components/free-registration-promo';
import {FaqSection} from '@/design/components/faq-section';
import {Button} from '@/design/components/ui/button';
import {Link} from '@/design/navigation';
export function RegistrationLanding(){return <SiteLayout><section className="mx-auto flex max-w-[1440px] flex-col gap-8 px-[var(--page-gutter)] py-12 lg:flex-row lg:items-center lg:px-[var(--page-gutter-lg)]"><div className="flex-1 space-y-6"><h1 className="text-[length:var(--text-h1)] font-black">کسب‌وکار خود را به همه معرفی کنید</h1><p className="text-lg leading-relaxed">با ثبت رایگان کسب‌وکار در ایران پلازا، اطلاعات تماس، خدمات و محصولات شما در دسترس مشتریان قرار می‌گیرد.</p><Link to="/dashboard/business/new"><Button size="lg">شروع ثبت نام</Button></Link></div><Image src="/design/registration/landing-hero.webp" alt="" width={1080} height={720} sizes="(min-width: 1024px) 540px, 100vw" className="h-auto w-full rounded-[var(--radius-xs)] object-cover lg:max-w-[540px]"/></section><FreeRegistrationPromo/><FaqSection/></SiteLayout>}
export function WizardFrame({step,children}:{step:string;children:React.ReactNode}){
  const image=step==='identity'?'step-identity':step==='documents'?'step-national':'step-business';
  return <SiteLayout showBottomNav={false}><section className="mx-auto flex max-w-[1440px] flex-col gap-[var(--5xl)] px-[var(--page-gutter)] py-[var(--5xl)] lg:flex-row lg:items-start lg:justify-between lg:gap-[var(--8xl)] lg:px-[var(--page-gutter-lg)]"><div className="design-form w-full space-y-[var(--2xl)] lg:max-w-[540px]">{children}</div>{step!=='success'&&<Image src={'/design/registration/'+image+'.webp'} alt="" width={1080} height={1080} sizes="540px" className="hidden h-auto w-[540px] max-w-[45%] rounded-[var(--radius-xs)] object-cover lg:block"/>}</section></SiteLayout>;
}
