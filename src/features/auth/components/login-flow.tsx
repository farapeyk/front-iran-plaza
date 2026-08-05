"use client";

import { useState } from "react";
import { OtpRequestForm } from "@/features/auth/components/otp-request-form";
import { OtpVerifyForm } from "@/features/auth/components/otp-verify-form";

export function LoginFlow() {
  const [phone, setPhone] = useState<string | null>(null);

  if (phone) {
    return <OtpVerifyForm phone={phone} onBack={() => setPhone(null)} />;
  }

  return <OtpRequestForm onRequested={setPhone} />;
}
