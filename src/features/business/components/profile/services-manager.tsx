"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addServiceAction, removeServiceAction } from "@/features/business/actions/services.action";
import type { ServiceItem } from "@/features/business/types/business-extras";

export function ServicesManager({ businessId, initialServices }: { businessId: string; initialServices: ServiceItem[] }) {
  const [isPending, startTransition] = useTransition();
  const [services, setServices] = useState(initialServices);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("نام خدمت الزامی است");
      return;
    }
    startTransition(async () => {
      const result = await addServiceAction(businessId, {
        name,
        description: description || undefined,
        priceFrom: priceFrom ? Number(priceFrom) : undefined,
        priceTo: priceTo ? Number(priceTo) : undefined,
      });
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      setServices((prev) => [...prev, result.data]);
      setName("");
      setDescription("");
      setPriceFrom("");
      setPriceTo("");
      setShowAdd(false);
      toast.success("خدمت اضافه شد");
    });
  }

  function handleRemove(serviceId: string) {
    startTransition(async () => {
      const result = await removeServiceAction(businessId, serviceId);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      setServices((prev) => prev.filter((s) => s.id !== serviceId));
    });
  }

  return (
    <div dir="rtl" className="space-y-4">
      {services.length === 0 ? (
        <p className="text-sm text-neutral-500">هنوز خدمتی ثبت نشده.</p>
      ) : (
        <div className="space-y-2">
          {services.map((s) => (
            <div key={s.id} className="flex items-start justify-between border border-neutral-200 rounded-lg p-3">
              <div>
                <p className="text-sm font-bold text-neutral-900">{s.name}</p>
                {s.description && <p className="text-xs text-neutral-500 mt-0.5">{s.description}</p>}
                {(s.priceFrom || s.priceTo) && (
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {s.priceFrom?.toLocaleString("fa-IR")} تا {s.priceTo?.toLocaleString("fa-IR")} تومان
                  </p>
                )}
              </div>
              <button onClick={() => handleRemove(s.id)} disabled={isPending} className="text-red-500 shrink-0">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {showAdd ? (
        <form onSubmit={handleAdd} className="space-y-3 border border-neutral-200 rounded-lg p-3">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="نام خدمت" disabled={isPending} />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="توضیحات (اختیاری)"
            rows={2}
            disabled={isPending}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <div className="grid grid-cols-2 gap-2">
            <Input value={priceFrom} onChange={(e) => setPriceFrom(e.target.value)} placeholder="قیمت از (تومان)" inputMode="numeric" dir="ltr" className="text-left" disabled={isPending} />
            <Input value={priceTo} onChange={(e) => setPriceTo(e.target.value)} placeholder="قیمت تا (تومان)" inputMode="numeric" dir="ltr" className="text-left" disabled={isPending} />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1" disabled={isPending}>
              {isPending ? "در حال ثبت..." : "ثبت خدمت"}
            </Button>
            <button type="button" onClick={() => setShowAdd(false)} className="text-sm text-neutral-500 px-3">
              انصراف
            </button>
          </div>
        </form>
      ) : (
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-1 text-sm text-emerald-800 font-medium">
          <Plus size={16} />
          افزودن خدمت جدید
        </button>
      )}
    </div>
  );
}