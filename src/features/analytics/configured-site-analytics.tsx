import { Suspense } from "react";
import { SiteAnalytics } from "./site-analytics";
import { readSiteIntegrations } from "./site-integrations";

export function ConfiguredSiteAnalytics() {
  const integrations = readSiteIntegrations();

  return (
    <Suspense fallback={null}>
      <SiteAnalytics
        ga4MeasurementId={integrations.ga4MeasurementId}
        clarityProjectId={integrations.clarityProjectId}
      />
    </Suspense>
  );
}
