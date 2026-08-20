'use server';

import { expireAdmin } from '@/lib/session-service';

export async function revokeAdminSession(sessionToken: string, adminId: string) {
  await expireAdmin(sessionToken, adminId);
}
