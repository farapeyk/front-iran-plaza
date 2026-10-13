import { SiteLayout } from '@/design/components/site-layout';
import { RegistrationBanner } from '@/design/components/registration-banner';
import { NewMembers } from '@/design/components/new-members';
export function ArticlesLivePage() {
  return <SiteLayout><section className="mx-auto max-w-[1440px] space-y-[var(--3xl)] px-[var(--page-gutter)] py-[var(--5xl)] lg:px-[var(--page-gutter-lg)]"><h1 className="text-[length:var(--text-h1)] font-black">مقالات ایران پلازا</h1><p role="status">بخش مقالات در حال حاضر در دسترس نیست.</p><RegistrationBanner/><NewMembers/></section></SiteLayout>;
}
