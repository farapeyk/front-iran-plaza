"use client";
import {useState,useTransition} from 'react';
import {useRouter} from 'next/navigation';
import {DashboardAccountLayout} from '@/design/components/dashboard-account-layout';
import {Field} from '@/design/components/ui/field';
import {Button} from '@/design/components/ui/button';
import {usersControllerUpdateMe} from '@/design/api/generated/browser';
import type {UsersControllerGetMe200} from '@/design/api/generated/models/usersControllerGetMe200';
import type {UpdateProfileDto} from '@/design/api/generated/models/updateProfileDto';
import {JalaliDateSelect} from '@/features/business/components/jalali-date-select';
import {gregorianToJalali,jalaliToGregorian,isValidJalaliDate} from '@/lib/utils/jalali';

export function AccountLivePage({user}:{user:NonNullable<UsersControllerGetMe200>}) {
  const router=useRouter();
  const [pending,startTransition]=useTransition();
  const [message,setMessage]=useState('');
  const parsed=user.birthDate?gregorianToJalali(user.birthDate):null;
  const [date,setDate]=useState({day:parsed?.jd,month:parsed?.jm,year:parsed?.jy});
  const names=(user.fullName??'').split(' ');
  const submit=(event:React.FormEvent<HTMLFormElement>)=>{
    event.preventDefault(); const data=new FormData(event.currentTarget);
    const value=(key:string)=>String(data.get(key)??'').trim();
    let birthDate:string|undefined;
    try { if(date.day||date.month||date.year) {if(!date.day||!date.month||!date.year||!isValidJalaliDate(date.year,date.month,date.day))throw new Error('تاریخ تولد معتبر را کامل وارد کنید.');birthDate=jalaliToGregorian(date.year,date.month,date.day)+'T00:00:00.000Z';} }
    catch(error){setMessage(error instanceof Error?error.message:'تاریخ نامعتبر است.');return;}
    const input:UpdateProfileDto={fullName:[value('firstName'),value('lastName')].filter(Boolean).join(' '),email:value('email')||undefined,nationalCode:value('nationalCode')||undefined,fatherName:value('fatherName')||undefined,province:value('province')||undefined,city:value('city')||undefined,gender:value('gender') as UpdateProfileDto['gender']||undefined,birthDate};
    startTransition(async()=>{try{await usersControllerUpdateMe(input);setMessage('اطلاعات حساب ذخیره شد.');router.refresh();}catch(error){setMessage(error instanceof Error?error.message:'ذخیره اطلاعات انجام نشد.');}});
  };
  return <DashboardAccountLayout title="اطلاعات حساب کاربری">
    <form onSubmit={submit} className="design-form grid gap-5 md:grid-cols-2">
      <Field label="نام" name="firstName" required defaultValue={names[0]??''}/><Field label="نام خانوادگی" name="lastName" defaultValue={names.slice(1).join(' ')}/>
      <Field label="کد ملی" name="nationalCode" inputMode="numeric" maxLength={10} defaultValue={user.nationalCode??''}/><Field label="ایمیل" name="email" type="email" defaultValue={user.email??''}/>
      <Field label="شماره موبایل" locked defaultValue={user.phone}/><Field label="نام پدر" name="fatherName" defaultValue={user.fatherName??''}/>
      <div className="space-y-2 md:col-span-2"><p className="text-lg font-bold">تاریخ تولد</p><JalaliDateSelect {...date} onDayChange={day=>setDate({...date,day})} onMonthChange={month=>setDate({...date,month})} onYearChange={year=>setDate({...date,year})}/></div>
      <Field label="استان" name="province" defaultValue={user.province??''}/><Field label="شهر" name="city" defaultValue={user.city??''}/>
      <fieldset className="md:col-span-2"><legend className="mb-3 text-lg font-bold">جنسیت</legend><div className="flex gap-6">{[{value:'MALE',title:'مرد'},{value:'FEMALE',title:'زن'}].map(g=><label key={g.value} className="flex gap-2"><input type="radio" name="gender" value={g.value} defaultChecked={user.gender===g.value}/>{g.title}</label>)}</div></fieldset>
      {message&&<p role="status" className="md:col-span-2">{message}</p>}<Button disabled={pending} type="submit" className="h-12 w-full max-w-md md:col-span-2">{pending?'در حال ذخیره…':'ذخیره اطلاعات'}</Button>
    </form>
  </DashboardAccountLayout>;
}
