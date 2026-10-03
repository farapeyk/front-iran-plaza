"use client";

import { Phone, MessageCircle, Globe } from "lucide-react";
import { useTrackEvent } from "@/hooks/use-track-event";

export function ContactActions({
  businessId,
  phone,
  whatsapp,
  website,
}: {
  businessId: string;
  phone: string;
  whatsapp: string | null;
  website?: string | null;
}) {
  const track = useTrackEvent();

  return (
    <div className="flex gap-2 mt-4">
      <a
        href={`tel:${phone}`}
        onClick={() => track("CLICK_PHONE", businessId)}
        className="flex-1 flex items-center justify-center gap-1.5 text-sm bg-emerald-950 text-white rounded-md py-2"
      >
        <Phone size={16} />
        تماس
      </a>
      {whatsapp && (
        <a
          href={`https://wa.me/${whatsapp}`}
          onClick={() => track("CLICK_PHONE", businessId, { channel: "whatsapp" })}
          className="flex-1 flex items-center justify-center gap-1.5 text-sm border border-emerald-700 text-emerald-800 rounded-md py-2"
        >
          <MessageCircle size={16} />
          واتساپ
        </a>
      )}
      {website && (
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("CLICK_WEBSITE", businessId)}
          className="flex-1 flex items-center justify-center gap-1.5 text-sm border border-neutral-300 text-neutral-700 rounded-md py-2"
        >
          <Globe size={16} />
          وب‌سایت
        </a>
      )}
    </div>
  );
}
