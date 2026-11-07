"use client";
import Image from "next/image";
import { DashboardAccountLayout } from '@/design/components/dashboard-account-layout';
import {Link} from '@/design/navigation';
import { Button } from '@/design/components/ui/button';
import { useDesignBusiness } from '@/design/provider';
import { profileSubmenuItems } from '@/design/data/dashboard-nav';
import { CustomerDashboardLivePage } from '@/design/pages/customer-dashboard-live';
export function DashboardLivePage({needsRegistration=false,canWriteContent=false}:{needsRegistration?:boolean;canWriteContent?:boolean}){
  return <CustomerDashboardLivePage needsRegistration={needsRegistration} canWriteContent={canWriteContent}/>;
}
export function ProfileOverview({analytics,slug}:{analytics:Record<string,number>;slug:string}){
  const business=useDesignBusiness();
  return <DashboardAccountLayout title="پروفایل من" headerAction={<Link to={'/businesses/'+encodeURIComponent(slug)}><Button variant="outline">نمایش پروفایل</Button></Link>}>
    <div className="space-y-8"><h2 className="text-xl font-bold">{business?.name}</h2><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Object.entries(analytics).map(([type,count])=><div key={type} className="rounded bg-[var(--surface)] p-5 shadow-sm"><p className="text-2xl font-bold">{count.toLocaleString('fa-IR')}</p><p className="text-sm">{({PAGE_VIEW:'بازدید صفحه',BUSINESS_VIEW:'بازدید پروفایل',CONTACT_CLICK:'کلیک تماس',PHONE_CLICK:'کلیک شماره تماس',WHATSAPP_CLICK:'کلیک واتساپ',SHARE_CLICK:'اشتراک‌گذاری'} as Record<string,string>)[type]??type}</p></div>)}</div><nav className="grid gap-4 md:grid-cols-2">{profileSubmenuItems.filter(item=>item.to!=='/profile').map(item=><Link key={item.to} to={item.to} className="flex items-center gap-4 rounded-[var(--radius-xs)] border border-[var(--opacity-dark-16)] p-5"><Image src={item.icon} width={24} height={24} alt=""/><span className="flex-1 font-bold">{item.title}</span><Image src="/design/icons/arrow-left.svg" width={16} height={16} alt=""/></Link>)}<Link to="/dashboard/business/profile/features" className="rounded border p-5">امکانات</Link></nav></div>
  </DashboardAccountLayout>;
}
