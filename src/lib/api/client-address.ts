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
  return firstValidIp(headers.get("x-forwarded-for"))
    ?? firstValidIp(headers.get("x-real-ip"));
}
