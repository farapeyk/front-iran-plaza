"use client";
import { Fragment, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SiteLayout } from '@/design/components/site-layout';
import { BusinessSearch } from '@/design/components/business-search';
import { BusinessListCard } from '@/design/components/business-list-card';
import { RegistrationBanner } from '@/design/components/registration-banner';
import { NewMembers } from '@/design/components/new-members';
import { Switch } from '@/design/components/ui/switch';
import { Button } from '@/design/components/ui/button';
import { businessControllerListPublic } from '@/design/api/generated/browser';
import { decodeBusinesses, useCategories } from '@/design/api/catalog';
import { businessCard } from '@/design/api/business';
import { Link } from '@/design/navigation';
import type { BusinessCardData } from '@/design/components/business-card';

type ListingItem = BusinessCardData & {phone:string;hasInstallment?:boolean};
type ListingResult = {key:string|null;base:string;page:number;items:ListingItem[];total:number;error?:string};

function ListingSearch({search,city,onSearch,onCityClick}:{search:string;city:string;onSearch:(value:string)=>void;onCityClick:()=>void}) {
  const [draft,setDraft]=useState(search);
  return <form onSubmit={event=>{event.preventDefault();onSearch(draft);}}><BusinessSearch size="responsive" value={draft} onChange={setDraft} onClear={()=>{setDraft('');onSearch('');}} onSearchClick={()=>onSearch(draft)} onCityClick={onCityClick} city={city}/></form>;
}

function BusinessesPage() {
  const router=useRouter();
  const params=useSearchParams();
  const queryKey=params.toString();
  const filterParams=new URLSearchParams(queryKey);
  filterParams.delete('page');
  const filterKey=filterParams.toString();
  const [result,setResult]=useState<ListingResult>({key:null,base:'',page:0,items:[],total:0});
  const cityDetails=useRef<HTMLDetailsElement>(null);
  const {categories}=useCategories();
  const category=categories.find(c=>c.id===params.get('categoryId'));
  const parsedPage=Number(params.get('page')??1);
  const page=Number.isSafeInteger(parsedPage)&&parsedPage>0?parsedPage:1;
  const limit=20;
  useEffect(()=>{
    const controller=new AbortController();
    const query=new URLSearchParams(queryKey);
    const parsed=Number(query.get('page')??1);
    const requestedPage=Number.isSafeInteger(parsed)&&parsed>0?parsed:1;
    businessControllerListPublic({search:query.get('search')||undefined,city:query.get('city')||undefined,neighborhood:query.get('neighborhood')||undefined,categoryId:query.get('categoryId')||undefined,page:requestedPage,limit},{signal:controller.signal})
      .then(data=>{
        if(controller.signal.aborted)return;
        const items=decodeBusinesses(data.data).map(item=>({...businessCard(item),hasInstallment:item.hasInstallment}));
        setResult(previous=>{
          const combined=previous.base===filterKey&&previous.page===requestedPage-1?[...previous.items,...items]:items;
          return {key:queryKey,base:filterKey,page:requestedPage,items:Array.from(new Map(combined.map(item=>[item.id,item])).values()),total:data.total};
        });
      })
      .catch(()=>{if(!controller.signal.aborted)setResult({key:queryKey,base:filterKey,page:requestedPage,items:[],total:0,error:'دریافت اطلاعات انجام نشد. دوباره تلاش کنید.'});});
    return ()=>controller.abort();
  },[queryKey,filterKey]);
  const update=(key:string,value:string)=>{
    const query=new URLSearchParams(params);
    if(value)query.set(key,value);else query.delete(key);
    if(key!=='page')query.delete('page');
    router.push('/businesses?'+query.toString());
  };
  const loading=result.key!==queryKey;
  const showItems=!result.error&&(!loading||result.base===filterKey);
  const title=category?.name??'کسب‌وکارها';
  const openCity=()=>{if(cityDetails.current){cityDetails.current.open=true;cityDetails.current.querySelector('input')?.focus();}};
  return <SiteLayout className="reference-listing">
    <section className="listing-container">
      <nav className="listing-breadcrumb"><Link to="/">خانه</Link> / <Link to="/businesses">کسب‌وکارها</Link>{category&&<> / {category.name}</>}</nav>
      <div className="listing-heading">
        <div><h1>{title}</h1><p role="status">{params.get('city')&&<span>{params.get('city')} · </span>}{loading?'در حال دریافت اطلاعات…':result.error??`${result.total.toLocaleString('fa-IR')} کسب‌وکار`}</p></div>
        <ListingSearch key={params.get('search')??''} search={params.get('search')??''} city={params.get('city')||'همه شهرها'} onSearch={value=>update('search',value)} onCityClick={openCity}/>
      </div>
      <div className="listing-filters">
        <div className="listing-filter-pills">
          <select aria-label="دسته‌بندی" className="listing-filter" value={params.get('categoryId')??''} onChange={e=>update('categoryId',e.target.value)}><option value="">دسته‌بندی‌ها</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
          {(['city','neighborhood'] as const).map(key=><details key={key} ref={key==='city'?cityDetails:undefined} className="listing-location-filter">
            <summary className="listing-filter">{params.get(key)||(key==='city'?'انتخاب شهر':'انتخاب محله')}<img src="/design/icons/arrow-down.svg" alt="" width={16} height={16}/></summary>
            <form className="listing-filter-popover" onSubmit={event=>{event.preventDefault();const value=String(new FormData(event.currentTarget).get('value')??'').trim();update(key,value);event.currentTarget.closest('details')?.removeAttribute('open');}}>
              <label>{key==='city'?'شهر':'محله'}<input name="value" aria-label={key==='city'?'شهر':'محله'} key={params.get(key)} defaultValue={params.get(key)??''}/></label><Button type="submit" size="sm">اعمال</Button>
              {params.get(key)&&<Button type="button" variant="ghost" size="sm" onClick={()=>update(key,'')}>پاک کردن</Button>}
            </form>
          </details>)}
        </div>
        <div className="listing-switches">
          <label title="این فیلتر در حال حاضر در دسترس نیست"><Switch aria-label="گالری تصاویر و ویدئو" disabled checked={false}/>گالری تصاویر / ویدئو</label>
          <label title="این فیلتر در حال حاضر در دسترس نیست"><Switch aria-label="فقط VIP ها" disabled checked={false}/>فقط VIP ها</label>
        </div>
      </div>
      {!loading&&!result.error&&result.items.length===0&&<div className="listing-empty"><img src="/design/icons/search-not-found.svg" width={102} height={80} alt=""/><p>نتیجه‌ای یافت نشد.</p></div>}
      {showItems&&<div className="listing-grid" aria-busy={loading}>{result.items.map((item,index)=><Fragment key={item.id}><BusinessListCard business={item} layout="listing"/>{index===5&&<RegistrationBanner className="listing-banner"/>}</Fragment>)}</div>}
      {showItems&&result.items.length>0&&result.page*limit<result.total&&<div className="listing-pagination"><Button variant="outline" disabled={loading} onClick={()=>update('page',String(page+1))}>{loading?'در حال دریافت…':'مشاهده بیشتر'}<span aria-hidden>＋</span></Button></div>}
      {!loading&&result.items.length<=6&&<RegistrationBanner className="listing-banner listing-short-banner"/>}
    </section>
    <NewMembers className="listing-members"/>
    <section className="listing-container listing-about"><h2>{title}</h2><p>{category?`در دسته ${category.name}، کسب‌وکارهای ثبت‌شده در ایران پلازا را ببینید.`:'کسب‌وکارهای ثبت‌شده در ایران پلازا را پیدا کنید.'} با انتخاب شهر و محله یا جستجوی نام، نتیجه‌ها را محدود کنید. برای مشاهده اطلاعات، خدمات، محصولات، آدرس و راه‌های ارتباطی هر کسب‌وکار، وارد پروفایل آن شوید.</p><Link to="/about">درباره ایران پلازا</Link></section>
  </SiteLayout>;
}
export {BusinessesPage,BusinessesPage as SearchPage};
