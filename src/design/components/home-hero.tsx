"use client"
import Image from "next/image";

import { cn } from "@/design/lib/utils"
import { BusinessSearch } from "@/design/components/business-search"
import { useState } from 'react'
import { useNavigate } from '@/design/navigation'
const heroCity = "/design/home/hero-city.svg"
const heroPeople = "/design/home/hero-city-people.svg"
const heroLoop1 = "/design/home/hero-loop-1.svg"
const heroLoop2 = "/design/home/hero-loop-2.svg"

function HomeHero({ className }: { className?: string }) {
  const [query,setQuery]=useState('')
  const navigate=useNavigate()
  return (
    <section
      className={cn(
        "home-hero relative overflow-hidden",
        "bg-[linear-gradient(199deg,white_0%,var(--secondary-500)_100%)]",
        "px-[var(--2xl)] pb-[var(--11xl)] pt-[var(--10xl)] lg:px-[var(--8xl)]",
        className
      )}
    >
      {/* decorative loops — mobile sits on the physical right; desktop spans the opposite side */}
      <div className="pointer-events-none absolute top-[90px] right-[-8px] w-[159px] opacity-80 lg:hidden">
        <Image alt="" className="h-auto w-full" src={heroLoop1} width={720} height={420} sizes="159px" />
      </div>
      <div className="pointer-events-none absolute top-[108px] right-[12px] w-[149px] opacity-70 lg:hidden">
        <Image alt="" className="h-auto w-full" src={heroLoop2} width={720} height={420} sizes="149px" />
      </div>
      <div className="home-hero-loop pointer-events-none absolute -start-[var(--sm)] top-[20%] hidden w-[50%] max-w-[720px] opacity-80 lg:block">
        <Image alt="" className="h-auto w-full" src={heroLoop1} width={720} height={420} sizes="50vw" />
      </div>
      <div className="home-hero-loop pointer-events-none absolute -start-[var(--xs)] top-[18%] hidden w-[46%] max-w-[670px] opacity-70 lg:block">
        <Image alt="" className="h-auto w-full" src={heroLoop2} width={720} height={420} sizes="46vw" />
      </div>

      <div className="home-hero-content relative z-10 mx-auto flex w-full max-w-xl flex-col items-center gap-4 text-center lg:me-auto lg:ms-0 lg:items-start lg:gap-[var(--3xl)] lg:text-right">
        <div className="flex w-full flex-col items-center gap-[var(--lg)] lg:items-start">
          <div className="flex flex-col items-center gap-1 lg:items-start">
            <h1 className="text-[28px] font-black leading-[1.4] text-primary-500 lg:text-[length:var(--text-display-5,40px)]">
              ایران پلازا<span className="hidden lg:inline">،</span>
            </h1>
            <p className="text-xl font-black leading-[1.4] text-primary-950 lg:text-[length:var(--text-display-6,36px)]">
              مرجع معرفی بهترین کسب وکارها
            </p>
          </div>
          <p className="text-sm leading-[1.6] text-primary-950 lg:text-lg lg:leading-relaxed">
            نام یا دسته بندی یک کسب و کار را جستجو کنید...
          </p>
        </div>
        <BusinessSearch className="h-12 w-full max-w-[500px] lg:h-16" size="responsive" city="شیراز" value={query} onChange={setQuery} onClear={()=>setQuery('')} onSearchClick={()=>navigate('/search'+(query.trim()?`?search=${encodeURIComponent(query.trim())}`:''))}/>
      </div>

      {/* cityscape */}
      <div className="home-hero-city pointer-events-none absolute inset-x-0 bottom-0 h-[35%] min-h-[180px]">
        <Image
          alt=""
          className="absolute inset-x-[8%] bottom-0 h-full w-auto max-w-[48%] object-contain object-bottom"
          height={420}
          sizes="48vw"
          src={heroCity}
          width={900}
        />
        <Image
          alt=""
          className="absolute inset-x-[16%] bottom-[3%] h-[70%] w-auto max-w-[36%] object-contain object-bottom"
          height={360}
          sizes="36vw"
          src={heroPeople}
          width={720}
        />
      </div>
    </section>
  )
}

export { HomeHero }
