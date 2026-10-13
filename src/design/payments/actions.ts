"use server";
import {invoiceControllerCreate,paymentControllerRequestPayment} from '@/design/api/generated/server';
type PaymentResult={success:true;url:string}|{success:false;message:string};
function safePaymentUrl(raw:string):string {
  const url=new URL(raw);
  const allowed=(process.env.PAYMENT_ALLOWED_ORIGINS??'').split(',').map(value=>value.trim()).filter(Boolean);
  if(process.env.NODE_ENV!=='production'&&process.env.BACKEND_INTERNAL_URL)allowed.push(new URL(process.env.BACKEND_INTERNAL_URL).origin);
  if(process.env.NODE_ENV!=='production'&&process.env.SITE_URL)allowed.push(new URL(process.env.SITE_URL).origin);
  if(url.username||url.password||!['https:','http:'].includes(url.protocol)||!allowed.includes(url.origin)||(url.protocol==='http:'&&url.hostname!=='127.0.0.1'&&url.hostname!=='localhost'))throw new Error('درگاه پرداخت آماده نیست.');
  return url.href;
}
export async function payInvoiceAction(id:string):Promise<PaymentResult>{
  try{const payment=await paymentControllerRequestPayment(id);return {success:true,url:safePaymentUrl(payment.paymentUrl)};}catch{return {success:false,message:'پرداخت انجام نشد؛ لطفاً دوباره تلاش کنید.'};}
}
export async function beginPaymentAction(businessId:string,planId:string):Promise<PaymentResult>{
  try{const invoice=await invoiceControllerCreate({businessId,planId,amount:1});return await payInvoiceAction(invoice.id);}catch{return {success:false,message:'صدور فاکتور انجام نشد؛ لطفاً دوباره تلاش کنید.'};}
}
