import type { Metadata } from "next";

type Environment = Readonly<Record<string, string | undefined>>;

export type SiteIntegrations = {
  ga4MeasurementId?: string;
  clarityProjectId?: string;
  yandexVerification?: string;
  baiduVerification?: string;
};

const integrationFields = {
  NEXT_PUBLIC_GA4_MEASUREMENT_ID: {
    pattern: /^G-[A-Z0-9]{4,20}$/,
    example: "G-XXXXXXXXXX",
  },
  NEXT_PUBLIC_CLARITY_PROJECT_ID: {
    pattern: /^[a-z0-9]{5,32}$/i,
    example: "abc123def4",
  },
  NEXT_PUBLIC_YANDEX_SITE_VERIFICATION: {
    pattern: /^[a-z0-9_-]{4,128}$/i,
    example: "0123456789abcdef",
  },
  NEXT_PUBLIC_BAIDU_SITE_VERIFICATION: {
    pattern: /^[a-z0-9_-]{4,128}$/i,
    example: "codeva-xxxxxxxxxx",
  },
} as const;

function optionalIntegrationValue(
  environment: Environment,
  name: keyof typeof integrationFields,
): string | undefined {
  const value = environment[name]?.trim();
  if (!value) return undefined;

  const rule = integrationFields[name];
  if (!rule.pattern.test(value)) {
    throw new Error(`${name} is invalid; expected a value like ${rule.example}`);
  }

  return value;
}

export function readSiteIntegrations(environment?: Environment): SiteIntegrations {
  const source = environment ?? {
    NEXT_PUBLIC_GA4_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID,
    NEXT_PUBLIC_CLARITY_PROJECT_ID: process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID,
    NEXT_PUBLIC_YANDEX_SITE_VERIFICATION: process.env.NEXT_PUBLIC_YANDEX_SITE_VERIFICATION,
    NEXT_PUBLIC_BAIDU_SITE_VERIFICATION: process.env.NEXT_PUBLIC_BAIDU_SITE_VERIFICATION,
  };

  return {
    ga4MeasurementId: optionalIntegrationValue(source, "NEXT_PUBLIC_GA4_MEASUREMENT_ID"),
    clarityProjectId: optionalIntegrationValue(source, "NEXT_PUBLIC_CLARITY_PROJECT_ID"),
    yandexVerification: optionalIntegrationValue(source, "NEXT_PUBLIC_YANDEX_SITE_VERIFICATION"),
    baiduVerification: optionalIntegrationValue(source, "NEXT_PUBLIC_BAIDU_SITE_VERIFICATION"),
  };
}

export function buildSiteVerification(
  integrations: SiteIntegrations,
): Metadata["verification"] | undefined {
  const { yandexVerification, baiduVerification } = integrations;
  if (!yandexVerification && !baiduVerification) return undefined;

  return {
    ...(yandexVerification ? { yandex: yandexVerification } : {}),
    ...(baiduVerification
      ? { other: { "baidu-site-verification": baiduVerification } }
      : {}),
  };
}
