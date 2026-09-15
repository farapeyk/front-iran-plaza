"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addBranchAction, removeBranchAction } from "@/features/business/actions/branches.action";
import type { BranchLocation } from "@/features/business/types/business-extras";

export function BranchesManager({ businessId, initialBranches }: { businessId: string; initialBranches: BranchLocation[] }) {
  const [isPending, startTransition] = useTransition();
  const [branches, setBranches] = useState(initialBranches);
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !address.trim()) {
      toast.error("نام شعبه و آدرس الزامی است");
      return;
    }
    startTransition(async () => {
      const result = await addBranchAction(businessId, { title, address, phone: phone || undefined });
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      setBranches((prev) => [...prev, result.data]);
      setTitle("");
      setAddress("");
      setPhone("");
      setShowAdd(false);
      toast.success("شعبه اضافه شد");
    });
  }

  function handleRemove(branchId: string) {
    startTransition(async () => {
      const result = await removeBranchAction(businessId, branchId);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      setBranches((prev) => prev.filter((b) => b.id !== branchId));
    });
  }

  return (
    <div dir="rtl" className="space-y-4">
      {branches.length === 0 ? (
        <p className="text-sm text-neutral-500">شعبه‌ی اضافه‌ای ثبت نشده.</p>
      ) : (
        <div className="space-y-2">
          {branches.map((b) => (
            <div key={b.id} className="flex items-start justify-between border border-neutral-200 rounded-lg p-3">
              <div>
                <p className="text-sm font-bold text-neutral-900">{b.title}</p>
                <p className="text-xs text-neutral-500 mt-0.5">{b.address}</p>
                {b.phone && <p className="text-xs text-neutral-500 mt-0.5" dir="ltr">{b.phone}</p>}
              </div>
              <button onClick={() => handleRemove(b.id)} disabled={isPending} className="text-red-500 shrink-0">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {showAdd ? (
        <form onSubmit={handleAdd} className="space-y-3 border border-neutral-200 rounded-lg p-3">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="نام شعبه (مثلاً شعبه شرق)" disabled={isPending} />
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="آدرس کامل شعبه"
            rows={2}
            disabled={isPending}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="شماره تماس شعبه (اختیاری)" dir="ltr" className="text-left" disabled={isPending} />
          <div className="flex gap-2">
            <Button type="submit" className="flex-1" disabled={isPending}>
              {isPending ? "در حال ثبت..." : "ثبت شعبه"}
            </Button>
            <button type="button" onClick={() => setShowAdd(false)} className="text-sm text-neutral-500 px-3">
              انصراف
            </button>
          </div>
        </form>
      ) : (
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-1 text-sm text-emerald-800 font-medium">
          <Plus size={16} />
          افزودن آدرس/شعبه جدید
        </button>
      )}
    </div>
  );
}