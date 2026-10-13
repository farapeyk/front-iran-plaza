"use client";
import {useState,useTransition} from 'react';
import {useRouter} from 'next/navigation';
import {DashboardAccountLayout} from '@/design/components/dashboard-account-layout';
import {Button} from '@/design/components/ui/button';
import {VipBadge} from '@/design/components/vip-badge';
import {useDesignBusiness} from '@/design/provider';
import {subscriptionControllerStartFreeTrial} from '@/design/api/generated/browser';
import {beginPaymentAction} from '@/design/payments/actions';
import type {planControllerGetActivePlans} from '@/design/api/generated/server';
type Plans=Awaited<ReturnType<typeof planControllerGetActivePlans>>;
const money=(value:string)=>/^\d+(\.0+)?$/.test(value)?BigInt(value.split('.')[0]).toLocaleString('fa-IR')+' ریال':Number(value).toLocaleString('fa-IR')+' ریال';
export function SubscriptionLivePage({plans,available}:{plans:Plans;available:boolean}){
  const business=useDesignBusiness();const router=useRouter();const [message,setMessage]=useState('');const [pending,startTransition]=useTransition();
  return <DashboardAccountLayout title="خرید اشتراک VIP"><div className="space-y-8"><div className="space-y-3"><h2 className="text-2xl font-black">اشتراک پروفایل VIP</h2><p>پلن مناسب کسب‌وکار خود را انتخاب کنید.</p></div>{!available&&<p role="status">خرید اشتراک در حال حاضر فعال نیست.</p>}{!business&&<p>ابتدا کسب‌وکار خود را ثبت کنید.</p>}<div className="relative mx-auto max-w-md rounded-[var(--radius-xs)] border bg-[var(--surface)] p-6 pt-12"><div className="absolute -top-6 start-1/2 -translate-x-1/2"><VipBadge/></div><h3 className="text-center text-xl font-black">شروع رایگان</h3><p className="my-6 text-center">با فعال‌سازی دورهٔ آزمایشی، امکانات VIP را بررسی کنید.</p><Button className="w-full" disabled={pending||!available||!business} onClick={()=>{if(!business)return;startTransition(async()=>{try{const result=await subscriptionControllerStartFreeTrial(business.id);setMessage(result.message);router.refresh();}catch(error){setMessage(error instanceof Error?error.message:'فعال‌سازی انجام نشد.');}});}}>فعال‌سازی رایگان</Button></div><div className="grid gap-4 sm:grid-cols-2">{plans.filter(plan=>plan.tier==='VIP').map(plan=><article key={plan.id} className="space-y-5 rounded-[var(--radius-xs)] border bg-[var(--surface)] p-5"><h3 className="text-xl font-black">{plan.name}</h3><p>{plan.durationDays} روز</p><p className="text-lg font-bold">{money(plan.price)}</p><Button disabled={pending||!business||!available} className="w-full" onClick={()=>{if(!business)return;startTransition(async()=>{const result=await beginPaymentAction(business.id,plan.id);if(result.success)location.assign(result.url);else setMessage(result.message);});}}>خرید و تمدید</Button></article>)}</div>{message&&<p role="status">{message}</p>}</div></DashboardAccountLayout>;
}
export function PaymentsLivePage() {
  return <DashboardAccountLayout title="پرداخت‌ها"><p role="status">نمایش سوابق پرداخت در حال حاضر در دسترس نیست.</p></DashboardAccountLayout>;
}
