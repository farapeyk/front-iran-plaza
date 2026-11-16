import { isIP } from "node:net";

export const INTERNAL_CLIENT_IP_HEADER = "x-iranplaza-client-ip";

function firstValidIp(value: string | null): string | undefined {
  if (!value) return undefined;
  return value
    .split(",")
    .map(item => item.trim())
    .find(item => isIP(item) !== 0);
}

export function clientAddressFromHeaders(headers: Headers): string | undefined {
  // Prefer the CDN-configured single visitor address over XFF, which may hold
  // a chain of CDN/proxy addresses or client-supplied values.
  return firstValidIp(headers.get("x-real-ip"))
    ?? firstValidIp(headers.get("x-forwarded-for"));
}
