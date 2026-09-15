// src/app/page.tsx
import { Navbar } from "@/features/home/components/navbar";
import { HeroSection } from "@/features/home/components/hero-section";
import { CategoriesSection } from "@/features/home/components/categories-section";
import { RegisterCtaBanner } from "@/features/home/components/register-cta-banner";
import { ProcessSection } from "@/features/home/components/process-section";
import { FaqSection } from "@/features/home/components/faq-section";
import { Footer } from "@/features/home/components/footer";
import { getCurrentUser } from "@/lib/auth/get-current-user"; 

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex flex-col rtl">
      <Navbar user={user} /> 
      <main className="flex-1">
        <HeroSection />
        <CategoriesSection />
        <RegisterCtaBanner />
        <ProcessSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}