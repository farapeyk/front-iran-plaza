import { z } from 'zod';
import { verifyAccessToken } from './verify-access-token';
import type { VerifyOtpResponse } from '@/types/auth';

const schema = z.object({
  accessToken: z.string().min(1), refreshToken: z.string().min(1), isNewUser: z.boolean().optional().default(false),
  user: z.object({ id: z.string().min(1), phone: z.string().min(1), fullName: z.string().nullable(), userType: z.string().min(1) }).passthrough(),
});
export async function validateAuthResponse(value: unknown): Promise<VerifyOtpResponse | null> {
  const parsed = schema.safeParse(value);
  if (!parsed.success) return null;
  const claims = await verifyAccessToken(parsed.data.accessToken);
  if (!claims || claims.sub !== parsed.data.user.id || claims.userType !== parsed.data.user.userType) return null;
  return parsed.data;
}
