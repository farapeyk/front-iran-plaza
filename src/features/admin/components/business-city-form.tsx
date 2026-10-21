'use client';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { updateBusinessProfileAction } from '@/features/business/actions/update-business-profile.action';

export function AdminBusinessCityForm({ businessId, initialCity }: { businessId: string; initialCity: string }) {
  const [city, setCity] = useState(initialCity);
  const [pending, startTransition] = useTransition();
  return <form className="space-y-3" onSubmit={event => {
    event.preventDefault();
    startTransition(async () => {
      const result = await updateBusinessProfileAction(businessId, { city: city.trim() });
      if (!result.success) toast.error(result.message);
      else toast.success('شهر ذخیره شد');
    });
  }}>
    <label htmlFor="business-city" className="block text-sm font-medium">شهر</label>
    <input id="business-city" required maxLength={150} value={city} onChange={event => setCity(event.target.value)} disabled={pending} className="w-full rounded-md border p-3" />
    <button disabled={pending} className="rounded-md bg-emerald-950 px-5 py-2 text-white">{pending ? 'در حال ذخیره…' : 'ذخیره شهر'}</button>
  </form>;
}
