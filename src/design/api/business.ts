import type { PublicBusinessSummary } from '@/features/public/types/public-business';
import type { BusinessCardData } from '@/design/components/business-card';
export function businessCard(item: PublicBusinessSummary): BusinessCardData & { phone: string } {
  return { id: item.id, name: item.name, description: item.description ?? '', location: [item.city, item.neighborhood].filter(Boolean).join('، ') || item.address || '', image: item.logoId ? '/api/backend/files/' + encodeURIComponent(item.logoId) : '/design/icons/briefcase.svg', vip: item.planType === 'VIP' && !!item.planExpiryDate && new Date(item.planExpiryDate)>new Date(), href: '/businesses/' + encodeURIComponent(item.slug), phone: item.phone };
}
