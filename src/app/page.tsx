import type { Metadata } from "next";
import { HomePage } from '@/design/pages/home';
import { DesignProvider } from '@/design/provider';
import { getCurrentUser } from '@/lib/auth/get-current-user';

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function Page() { return <DesignProvider user={await getCurrentUser()}><HomePage /></DesignProvider>; }
