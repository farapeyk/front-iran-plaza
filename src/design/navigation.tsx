"use client";

import NextLink from "next/link";
import { useParams as nextParams, usePathname, useRouter, useSearchParams as nextSearch } from "next/navigation";
import { useEffect, type ComponentProps } from "react";
import { logoutAction } from "@/features/auth/actions/logout.action";

const aliases: Record<string, string> = {
  "/profile": "/dashboard/business/profile",
  "/user-info": "/dashboard/profile",
  "/subscription": "/dashboard/subscription",
  "/payments": "/dashboard/payments",
  "/support": "/dashboard/support",
};
export function canonicalHref(to: string): string {
  const [pathname, query] = to.split("?");
  let result = aliases[pathname] ?? pathname;
  if (pathname.startsWith("/profile/edit/")) {
    const section = pathname.slice("/profile/edit/".length);
    result = "/dashboard/business/profile/" + ({ bio: "basic", installments: "installment" }[section] ?? section);
  }
  return result + (query ? "?" + query : "");
}
export function Link({ to, ...props }: Omit<ComponentProps<typeof NextLink>, "href"> & { to: string }) {
  if (to === "/logout") return <form action={logoutAction}><button type="submit" {...props as ComponentProps<"button">} /></form>;
  return <NextLink href={canonicalHref(to)} {...props} />;
}
type NavState = { isActive: boolean };
export function NavLink({ to, end, className, children, ...props }: Omit<ComponentProps<typeof NextLink>, "href" | "className" | "children"> & { to: string; end?: boolean; className?: string | ((state: NavState) => string); children?: React.ReactNode | ((state: NavState) => React.ReactNode) }) {
  const pathname = usePathname();
  const href = canonicalHref(to);
  const isActive = pathname === href || (!end && href !== "/" && pathname.startsWith(href + "/"));
  return <NextLink href={href} aria-current={isActive ? "page" : undefined} className={typeof className === "function" ? className({ isActive }) : className} {...props}>{typeof children === "function" ? children({ isActive }) : children}</NextLink>;
}
export function useNavigate() {
  const router = useRouter();
  return (to: string | number, options?: { replace?: boolean }) => {
    if (typeof to === "number") { router.back(); return; }
    const href = canonicalHref(to);
    if (options?.replace) router.replace(href); else router.push(href);
  };
}
export function useLocation() {
  const current = usePathname();
  const pathname = current.startsWith("/dashboard/business/profile/")
    ? current.replace("/dashboard/business/profile/", "/profile/edit/").replace(/\/basic$/, "/bio").replace(/\/installment$/, "/installments")
    : Object.entries(aliases).find(([, value]) => value === current)?.[0] ?? current;
  return { pathname };
}
export function useParams<T extends Record<string, string> = Record<string, string>>() {
  const params = nextParams();
  const path = usePathname();
  const section = path.split("/").at(-1);
  return { ...params, id: params.id ?? params.slug, section: section === "basic" ? "bio" : section === "installment" ? "installments" : section } as unknown as T;
}
export function useSearchParams() {
  const search = nextSearch();
  return [search] as const;
}
export function Navigate({ to }: { to: string; replace?: boolean }) {
  const router = useRouter();
  useEffect(() => { router.replace(canonicalHref(to)); }, [router, to]);
  return null;
}
