import {redirect} from 'next/navigation';
export default async function Page({params}:{params:Promise<{section:string}>}){const {section}=await params; redirect('/dashboard/business/profile/'+({bio:'basic',installments:'installment'}[section]??section));}
