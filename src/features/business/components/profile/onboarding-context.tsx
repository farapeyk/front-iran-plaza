"use client";

import { createContext, useContext, useEffect, useState, useTransition, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { advanceOnboarding } from '../../lib/advance-onboarding';
import { PROFILE_STEPS, profileStepUrl } from '../../lib/onboarding-steps';

type Flow = { active: boolean; index: number; pending: boolean; advance: () => Promise<void>; setBusy: React.Dispatch<React.SetStateAction<number>> };
const Context = createContext<Flow>({ active: false, index: -1, pending: false, advance: async () => {}, setBusy: () => {} });
export const useProfileFlow = () => useContext(Context);
export function useProfileBusy(busy: boolean) {
  const { setBusy } = useProfileFlow();
  useEffect(() => {
    if (!busy) return;
    setBusy(count => count + 1);
    return () => setBusy(count => Math.max(0, count - 1));
  }, [busy, setBusy]);
}

export function OnboardingProvider({ businessId, savedStep, children }: {
  businessId: string; savedStep: number; children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [progress, setProgress] = useState(savedStep);
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState(0);
  const inFlight = useRef(false);
  const index = PROFILE_STEPS.findIndex(step => pathname === `/dashboard/business/profile/${step.key}`);
  const active = progress < PROFILE_STEPS.length;
  useEffect(() => {
    if (active && index > progress) router.replace(profileStepUrl(progress));
  }, [active, index, progress, router]);

  async function advance() {
    if (!active || index < 0 || inFlight.current) return;
    inFlight.current = true;
    startTransition(async () => {
      try {
        const result = await advanceOnboarding(businessId, index);
        if (!result.success) { toast.error(result.message); return; }
        setProgress(result.onboardingStep);
        router.push(profileStepUrl(result.onboardingStep));
        router.refresh();
      } finally { inFlight.current = false; }
    });
  }

  return <Context.Provider value={{ active, index, pending: pending || busy > 0, advance, setBusy }}>{children}</Context.Provider>;
}
