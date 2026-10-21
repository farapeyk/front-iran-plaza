import { DesignProvider } from '@/design/provider';
import { getDesignAccount } from '@/design/lib/get-design-account';

export default async function Layout({children}:{children:React.ReactNode}) {
  const { user, business } = await getDesignAccount();
  return <DesignProvider user={user} business={business}>{children}</DesignProvider>;
}
