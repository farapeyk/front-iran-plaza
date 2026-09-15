"use client";

import dynamic from "next/dynamic";
import { Cake , Send, Link as LinkIcon } from "lucide-react";

const StaticLocationMap = dynamic(() => import("./static-location-map"), {
  ssr: false,
  loading: () => <div className="h-[220px] rounded-lg bg-neutral-100 animate-pulse" />,
});

export function BusinessLocationMap({ latitude, longitude }: { latitude: number; longitude: number }) {
  return <StaticLocationMap latitude={latitude} longitude={longitude} />;
}

const PLATFORM_ICON: Record<string, React.ElementType> = {
  instagram: Cake ,
  telegram: Send,
};

export function SocialLinksRow({ socialMedia }: { socialMedia: Record<string, string> | null }) {
  if (!socialMedia || Object.keys(socialMedia).length === 0) return null;

  return (
    <div className="flex gap-2 flex-wrap">
      {Object.entries(socialMedia).map(([platform, value]) => {
        const Icon = PLATFORM_ICON[platform] ?? LinkIcon;
        return (
          <span key={platform} className="flex items-center gap-1.5 text-xs bg-neutral-100 rounded-full px-3 py-1.5 text-neutral-700">
            <Icon size={14} />
            {value}
          </span>
        );
      })}
    </div>
  );
}