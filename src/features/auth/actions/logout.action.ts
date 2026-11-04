"use server";

import { redirect } from "next/navigation";
import { endAuthSession } from "@/lib/auth/logout";

export async function logoutAction() {
  await endAuthSession();
  redirect("/login");
}
