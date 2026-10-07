import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: process.env.SITE_URL ? new URL(process.env.SITE_URL) : undefined,
  title: "Iran Plaza | ایران پلازا",
  description: "مرجع معرفی بهترین کسب و کارها",
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
        {children}
        <Toaster richColors position="top-center" dir="rtl" />
      </body>
    </html>
  );
}
