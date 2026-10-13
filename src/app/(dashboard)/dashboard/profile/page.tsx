import {usersControllerGetMe} from '@/design/api/generated/server';
import {AccountLivePage} from '@/design/pages/account-live';
import {redirect} from 'next/navigation';
export default async function Page(){const user=await usersControllerGetMe();if(!user)redirect('/login');return <AccountLivePage user={user}/>;}
