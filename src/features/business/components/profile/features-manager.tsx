"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Check, Trash2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addFeatureAction, removeFeatureAction } from "@/features/business/actions/features.action";
import type { BusinessFeature } from "@/features/business/types/business-feature";

export function FeaturesManager({ businessId, initialFeatures }: { businessId: string; initialFeatures: BusinessFeature[] }) {
  const [isPending, startTransition] = useTransition();
  const [features, setFeatures] = useState(initialFeatures);
  const [label, setLabel] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!label.trim()) {
      toast.error("متن امکان را وارد کنید");
      return;
    }
    startTransition(async () => {
      const result = await addFeatureAction(businessId, label);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      setFeatures((prev) => [...prev, result.data]);
      setLabel("");
    });
  }

  function handleRemove(featureId: string) {
    startTransition(async () => {
      const result = await removeFeatureAction(businessId, featureId);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      setFeatures((prev) => prev.filter((f) => f.id !== featureId));
    });
  }

  return (
    <div dir="rtl" className="space-y-4">
      {features.length === 0 ? (
        <p className="text-sm text-neutral-500">هنوز امکانی اضافه نکرده‌اید.</p>
      ) : (
        <div className="space-y-2">
          {features.map((f) => (
            <div key={f.id} className="flex items-center justify-between border border-neutral-200 rounded-lg px-3 py-2">
              <div className="flex items-center gap-2">
                <Check size={16} className="text-emerald-700" />
                <span className="text-sm text-neutral-800">{f.label}</span>
              </div>
              <button onClick={() => handleRemove(f.id)} disabled={isPending} className="text-red-500">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleAdd} className="flex gap-2">
        <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="مثلاً: امکان بیرون‌بر" disabled={isPending} className="flex-1" />
        <Button type="submit" disabled={isPending}>
          <Plus size={16} />
          افزودن
        </Button>
      </form>
    </div>
  );
}