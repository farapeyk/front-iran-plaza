"use client";
import {DashboardAccountLayout} from '@/design/components/dashboard-account-layout';
import {DashboardInformationCard} from '@/design/components/dashboard-information-card';
import {Button} from '@/design/components/ui/button';
import {Link} from '@/design/navigation';
import {useDesignBusiness,useDesignUser} from '@/design/provider';
import {dashboardMainItems,profileSubmenuItems} from '@/design/data/dashboard-nav';
export function DashboardLivePage({needsRegistration=false,canWriteContent=false}:{needsRegistration?:boolean;canWriteContent?:boolean}){
  const user=useDesignUser();const business=useDesignBusiness();
  return <DashboardAccountLayout title="داشبورد">
    <div className="space-y-8"><DashboardInformationCard name={user?.fullName??'حساب کاربری'} phone={user?.phone??''} variant={business?'active':'free'}/>
      {business&&<div className="space-y-3 rounded border bg-[var(--surface)] p-5"><h2 className="text-xl font-bold">{business.name}</h2><p>{business.status==='APPROVED'?'کسب‌وکار تأیید شده':business.status==='REJECTED'?'نیاز به اصلاح اطلاعات':business.status==='SUSPENDED'?'کسب‌وکار تعلیق شده':'در انتظار بررسی'}</p>{business.rejectionReason&&<p>{business.rejectionReason}</p>}<Link to={needsRegistration?'/dashboard/business/new':'/profile'}><Button>{needsRegistration?'تکمیل ثبت اولیه و مدارک':'پروفایل من'}</Button></Link></div>}
      <nav className="grid gap-4 sm:grid-cols-2">{canWriteContent&&<Link to="/content" className="rounded border bg-[var(--surface)] p-5"><strong>تحریریه ایران پلازا</strong><p className="mt-1 text-sm text-[var(--text-body)]">نوشتن و مدیریت مقاله‌ها</p></Link>}{dashboardMainItems.filter(item=>!('disabled'in item&&item.disabled)).map(item=><Link key={item.to} to={item.to} className="flex items-center justify-between gap-4 rounded-[var(--radius-xs)] border bg-[var(--surface)] p-5"><div><strong>{item.title}</strong><p className="mt-1 text-sm text-[var(--text-body)]">{item.subtitle}</p></div><img src={item.icon} alt="" width={24} height={24}/></Link>)}<Link to="/dashboard/favorites" className="rounded border bg-[var(--surface)] p-5">علاقه‌مندی‌ها</Link><Link to="/dashboard/notifications" className="rounded border bg-[var(--surface)] p-5">اعلان‌ها</Link><Link to="/logout" className="rounded border bg-[var(--surface)] p-5 text-[var(--danger)]">خروج از حساب</Link></nav>
    </div>
  </DashboardAccountLayout>;
}
export function ProfileOverview({analytics,slug}:{analytics:Record<string,number>;slug:string}){
  const business=useDesignBusiness();
  return <DashboardAccountLayout title="پروفایل من" headerAction={<Link to={'/businesses/'+encodeURIComponent(slug)}><Button variant="outline">نمایش پروفایل</Button></Link>}>
    <div className="space-y-8"><h2 className="text-xl font-bold">{business?.name}</h2><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Object.entries(analytics).map(([type,count])=><div key={type} className="rounded bg-[var(--surface)] p-5 shadow-sm"><p className="text-2xl font-bold">{count.toLocaleString('fa-IR')}</p><p className="text-sm">{({PAGE_VIEW:'بازدید صفحه',BUSINESS_VIEW:'بازدید پروفایل',CONTACT_CLICK:'کلیک تماس',PHONE_CLICK:'کلیک شماره تماس',WHATSAPP_CLICK:'کلیک واتساپ',SHARE_CLICK:'اشتراک‌گذاری'} as Record<string,string>)[type]??type}</p></div>)}</div><nav className="grid gap-4 md:grid-cols-2">{profileSubmenuItems.filter(item=>item.to!=='/profile').map(item=><Link key={item.to} to={item.to} className="flex items-center gap-4 rounded-[var(--radius-xs)] border border-[var(--opacity-dark-16)] p-5"><img src={item.icon} width={24} height={24} alt=""/><span className="flex-1 font-bold">{item.title}</span><img src="/design/icons/arrow-left.svg" width={16} height={16} alt=""/></Link>)}<Link to="/dashboard/business/profile/features" className="rounded border p-5">امکانات</Link></nav></div>
  </DashboardAccountLayout>;
}
