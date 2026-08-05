"use client";

import { useState } from "react";
import { BusinessInfoStep, type Category } from "@/features/business/components/steps/business-info-step";
import { IdentityStep } from "@/features/business/components/steps/identity-step";
import { DocumentsStep } from "@/features/business/components/steps/documents-step";
import { SuccessStep } from "@/features/business/components/steps/success-step";
import type { IdentityInput } from "@/features/business/schemas/identity.schema";
import type { CurrentUser } from "@/types/auth";

type WizardStep =
  | { name: "business-info" }
  | { name: "identity"; businessId: string }
  | { name: "documents"; businessId: string; identity: IdentityInput }
  | { name: "success" };

interface BusinessWizardProps {
  user: CurrentUser;
  categories: Category[];
}

export function BusinessWizard({ user, categories }: BusinessWizardProps) {
  const [step, setStep] = useState<WizardStep>({ name: "business-info" });

  switch (step.name) {
    case "business-info":
      return <BusinessInfoStep categories={categories} onNext={(businessId) => setStep({ name: "identity", businessId })} />;
    case "identity":
      return (
        <IdentityStep
          user={user}
          onBack={() => setStep({ name: "business-info" })}
          onSubmit={(identity) => setStep({ name: "documents", businessId: step.businessId, identity })}
        />
      );
    case "documents":
      return <DocumentsStep businessId={step.businessId} identity={step.identity} onDone={() => setStep({ name: "success" })} />;
    case "success":
      return <SuccessStep />;
  }
}