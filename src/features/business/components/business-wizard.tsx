"use client";

import { useState } from "react";
import { BusinessInfoStep, type Category } from "@/features/business/components/steps/business-info-step";
import { IdentityStep } from "@/features/business/components/steps/identity-step";
import { DocumentsStep } from "@/features/business/components/steps/documents-step";
import { SuccessStep } from "@/features/business/components/steps/success-step";
import type { IdentityInput } from "@/features/business/schemas/identity.schema";
import type { CurrentUser } from "@/types/auth";
import type { BusinessInfoInput } from '../schemas/business-info.schema';
import { acceptedDocuments, registrationIncomplete, type RegistrationBusiness, type RegistrationDocument } from '../lib/registration';
import { gregorianToJalali } from '@/lib/utils/jalali';

type WizardStep =
  | { name: "business-info" }
  | { name: "identity"; businessId: string }
  | { name: "documents"; businessId: string; identity: IdentityInput }
  | { name: "success" };

interface BusinessWizardProps {
  user: CurrentUser;
  categories: Category[];
  business?: RegistrationBusiness | null;
  documents?: RegistrationDocument[];
}

export function BusinessWizard({ user, categories, business, documents = [] }: BusinessWizardProps) {
  const [step, setStep] = useState<WizardStep>(business && !registrationIncomplete(documents) ? { name: 'success' } : { name: "business-info" });
  const [draft, setDraft] = useState<{ businessId: string; values: BusinessInfoInput } | undefined>(business ? {
    businessId: business.id,
    values: { name: business.name, phone: business.phone, bio: business.description ?? '', city: business.city ?? '',
      province: business.address?.includes('،') ? business.address.split('،')[0].trim() : '', categoryId: business.categories?.[0]?.categoryId ?? '' },
  } : undefined);
  const license = documents.find(d => d.type === 'BUSINESS_LICENSE_PHOTO');
  const issueDate = license?.issueDate ? gregorianToJalali(license.issueDate) : null;
  const [identityDraft, setIdentityDraft] = useState<Partial<IdentityInput>>({
    companyName: license?.companyName ?? '', licenseNumber: license?.licenseNumber ?? '', unionCode: license?.unionCode ?? '',
    ...(issueDate ? { issueDay: issueDate.jd, issueMonth: issueDate.jm, issueYear: issueDate.jy } : {}),
  });
  const [savedDocuments, setSavedDocuments] = useState(documents);

  switch (step.name) {
    case "business-info":
      return <BusinessInfoStep categories={categories} existingBusinessId={draft?.businessId} initialValues={draft?.values} onNext={(businessId, values) => {
        setDraft({ businessId, values });
        setStep({ name: "identity", businessId });
      }} />;
    case "identity":
      return (
        <IdentityStep
          user={user}
          initialValues={identityDraft}
          onBack={() => setStep({ name: "business-info" })}
          onSubmit={(identity) => { setIdentityDraft(identity); setStep({ name: "documents", businessId: step.businessId, identity }); }}
        />
      );
    case "documents":
      return <DocumentsStep businessId={step.businessId} identity={step.identity}
        businessValues={draft?.values} categories={categories} initialSubmitted={acceptedDocuments(savedDocuments)} existingDocuments={savedDocuments}
        onDocumentSubmitted={(document) => setSavedDocuments(current => [...current.filter(d => d.type !== document.type), document])}
        onBack={() => setStep({ name: 'identity', businessId: step.businessId })}
        onDone={() => setStep({ name: "success" })} />;
    case "success":
      return <SuccessStep />;
  }
}
