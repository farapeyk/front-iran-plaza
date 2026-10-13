import { DesignProvider } from '@/design/provider';
export default function Layout({children}:{children:React.ReactNode}) { return <DesignProvider>{children}</DesignProvider>; }
