import type { BusinessProfile } from '../types/business-profile';
import type { DocumentType } from '../actions/submit-document.action';

export type RegistrationBusiness = BusinessProfile & { city?: string; address?: string };
export type RegistrationDocument = {
  type: DocumentType; fileId?: string; verificationStatus?: string; status?: string;
  companyName?: string | null; licenseNumber?: string | null; unionCode?: string | null; issueDate?: string | null;
};
export const REQUIRED_DOCUMENTS: DocumentType[] = ['NATIONAL_ID_FRONT', 'NATIONAL_ID_BACK', 'BUSINESS_LICENSE_PHOTO'];
export function acceptedDocuments(documents: RegistrationDocument[]) {
  return documents.filter(d => (d.verificationStatus ?? d.status) !== 'REJECTED').map(d => d.type);
}
export function registrationIncomplete(documents: RegistrationDocument[]) {
  const present = acceptedDocuments(documents);
  return REQUIRED_DOCUMENTS.some(type => !present.includes(type));
}
