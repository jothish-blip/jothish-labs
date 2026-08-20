export function isVisitorOnline(lastSeenAt: string | null | undefined): boolean {
  if (!lastSeenAt) return false;
  const now = new Date().getTime();
  const lastSeen = new Date(lastSeenAt).getTime();
  
  // 60 seconds heartbeat timeout for visitors
  return (now - lastSeen) < 60 * 1000;
}

export function isAdminOnline(lastActivityAt: string | null | undefined): boolean {
  if (!lastActivityAt) return false;
  const now = new Date().getTime();
  const lastActivity = new Date(lastActivityAt).getTime();
  
  // 30 minutes inactivity timeout for admins
  return (now - lastActivity) < 30 * 60 * 1000;
}
