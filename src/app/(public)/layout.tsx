import { DesignProvider } from '@/design/provider';
import { getCurrentUser } from '@/lib/auth/get-current-user';
export default async function Layout({children}:{children:React.ReactNode}) { return <DesignProvider user={await getCurrentUser()}>{children}</DesignProvider>; }
