import type { Metadata } from "next";
import { TooManyRequestsNotice } from "@/features/shared/components/too-many-requests-notice";

export const metadata: Metadata = {
  title: "درخواست‌های زیاد | ایران پلازا",
  robots: { index: false, follow: false },
};

export default function TooManyRequestsPage() {
  return <TooManyRequestsNotice />;
}
