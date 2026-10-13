import {paymentControllerVerifyCallback} from '@/design/api/generated/server';
import {SiteLayout} from '@/design/components/site-layout';
import {Link} from '@/design/navigation';
export const metadata={robots:{index:false,follow:false},title:'نتیجه پرداخت | ایران پلازا'};
export default async function Page({searchParams}:{searchParams:Promise<{Authority?:string;Status?:string}>}){
  const query=await searchParams;let message='اطلاعات پرداخت معتبر نیست.';
  if(query.Authority&&query.Authority.length<=200&&query.Status&&query.Status.length<=20){try{const result=await paymentControllerVerifyCallback({Authority:query.Authority,Status:query.Status});message=result.message;}catch{message='تأیید پرداخت انجام نشد. وضعیت فاکتور را در پرداخت‌ها بررسی کنید.';}}
  return <SiteLayout><section className="mx-auto flex min-h-[60svh] max-w-xl flex-col items-center justify-center gap-6 px-5 text-center"><h1 className="text-2xl font-black">نتیجه پرداخت</h1><p role="status">{message}</p><Link to="/payments" className="rounded bg-primary-700 px-6 py-3 text-white">مشاهده پرداخت‌ها</Link></section></SiteLayout>;
}
