import { DesignProvider } from '@/design/provider';
import { getCurrentUser } from '@/lib/auth/get-current-user';
import { redirect } from 'next/navigation';
import { businessControllerGetMine } from '@/design/api/generated/server';
export default async function Layout({children}:{children:React.ReactNode}) { const user=await getCurrentUser(); if(!user) redirect('/login'); const businesses=await businessControllerGetMine(); return <DesignProvider user={user} business={businesses[0]??null}>{children}</DesignProvider>; }
