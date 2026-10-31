"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

type SiteAnalyticsProps = {
  ga4MeasurementId?: string;
  clarityProjectId?: string;
};

export function SiteAnalytics({ ga4MeasurementId, clarityProjectId }: SiteAnalyticsProps) {
  const pathname = usePathname();
  const [ga4Ready, setGa4Ready] = useState(false);
  const lastTrackedUrl = useRef<string | null>(null);

  useEffect(() => {
    if (!ga4MeasurementId || !ga4Ready) return;

    if (lastTrackedUrl.current === pathname) return;

    lastTrackedUrl.current = pathname;
    window.gtag?.("event", "page_view", {
      page_location: new URL(pathname, window.location.origin).href,
      page_path: pathname,
      page_title: document.title,
    });
  }, [ga4MeasurementId, ga4Ready, pathname]);

  if (!ga4MeasurementId && !clarityProjectId) return null;

  return (
    <>
      {ga4MeasurementId ? (
        <>
          <Script id="ga4-bootstrap" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){window.dataLayer.push(arguments)};window.gtag("js",new Date());window.gtag("config",${JSON.stringify(ga4MeasurementId)},{send_page_view:false,anonymize_ip:true});`}
          </Script>
          <Script
            id="ga4-library"
            src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4MeasurementId)}`}
            strategy="afterInteractive"
            onReady={() => setGa4Ready(true)}
          />
        </>
      ) : null}

      {clarityProjectId ? (
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script",${JSON.stringify(clarityProjectId)});`}
        </Script>
      ) : null}
    </>
  );
}
