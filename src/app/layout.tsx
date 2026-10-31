import type { Metadata } from "next";
import { Toaster } from "sonner";
import { buildSiteVerification, readSiteIntegrations } from "@/features/analytics/site-integrations";
import { siteOrigin } from "@/features/seo/article-seo";
import { JsonLd } from "@/features/seo/json-ld";
import { buildSiteStructuredData } from "@/features/seo/site-structured-data";
import "./globals.css";

const siteIntegrations = readSiteIntegrations();

const title = "Iran Plaza | ایران پلازا";
const description = "مرجع معرفی و انتخاب بهترین کسب‌وکارهای ایران";

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin()),
  title,
  description,
  applicationName: "ایران پلازا",
  referrer: "origin-when-cross-origin",
  formatDetection: { address: false, email: false, telephone: false },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: "ایران پلازا",
    url: "/",
    title,
    description,
  },
  twitter: { card: "summary", title, description },
  verification: buildSiteVerification(siteIntegrations),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <JsonLd data={buildSiteStructuredData()} />
        {children}
        <Toaster richColors position="top-center" dir="rtl" />
      </body>
    </html>
  );
}
