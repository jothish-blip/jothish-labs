'use server';

import { createClient, createAdminClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { 
  manageIpRule, 
  manageDeviceStatus, 
  manageAdminLock, 
  managePasswordReset, 
  logAdminAction 
} from '@/lib/security-service';
import { expireAdmin, expireAllAdmins } from '@/lib/session-service';

async function checkPermission() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
  
  // Check role
  const supabaseAdmin = await createAdminClient();
  const { data: roleData } = await supabaseAdmin
    .from('portfolio_user_roles')
    .select('portfolio_roles(name)')
    .eq('admin_id', user.id)
    .single();

  const role = (roleData as any)?.portfolio_roles?.name || '';
  if (role !== 'superadmin') {
    throw new Error('Requires Superadmin role for administrative security controls.');
  }
  
  return user;
}

export async function handleBlockIp(ip: string, reason: string) {
  const admin = await checkPermission();
  await manageIpRule(ip, 'BLOCK', reason);
  
  await logAdminAction({
    adminId: admin.id,
    actor: admin.email || 'unknown',
    action: 'IP_BLOCK',
    resourceType: 'network',
    resourceId: ip,
    details: { reason }
  });
  
  revalidatePath('/ops/security');
}

export async function handleWhitelistIp(ip: string, reason: string) {
  const admin = await checkPermission();
  await manageIpRule(ip, 'WHITELIST', reason);
  
  await logAdminAction({
    adminId: admin.id,
    actor: admin.email || 'unknown',
    action: 'IP_WHITELIST',
    resourceType: 'network',
    resourceId: ip,
    details: { reason }
  });
  
  revalidatePath('/ops/security');
}

export async function handleRemoveIpRule(ip: string) {
  const admin = await checkPermission();
  await manageIpRule(ip, 'REMOVE');
  
  await logAdminAction({
    adminId: admin.id,
    actor: admin.email || 'unknown',
    action: 'IP_RULE_REMOVE',
    resourceType: 'network',
    resourceId: ip
  });
  
  revalidatePath('/ops/security');
}

export async function handleRevokeSession(token: string, targetAdminId: string) {
  const admin = await checkPermission();
  await expireAdmin(token, targetAdminId);
  
  await logAdminAction({
    adminId: admin.id,
    actor: admin.email || 'unknown',
    action: 'SESSION_REVOKE',
    resourceType: 'session',
    resourceId: token,
    details: { targetAdminId }
  });
  
  revalidatePath('/ops/security');
}

export async function handleRevokeAllSessions(targetAdminId: string) {
  const admin = await checkPermission();
  await expireAllAdmins(targetAdminId);
  
  await logAdminAction({
    adminId: admin.id,
    actor: admin.email || 'unknown',
    action: 'ALL_SESSIONS_REVOKE',
    resourceType: 'session',
    resourceId: targetAdminId,
    details: { targetAdminId }
  });
  
  revalidatePath('/ops/security');
}

export async function handleManageDevice(targetAdminId: string, deviceId: string, action: 'TRUST' | 'UNTRUST' | 'BLOCK' | 'UNBLOCK') {
  const admin = await checkPermission();
  await manageDeviceStatus(targetAdminId, deviceId, action);
  
  await logAdminAction({
    adminId: admin.id,
    actor: admin.email || 'unknown',
    action: `DEVICE_${action}`,
    resourceType: 'device',
    resourceId: deviceId,
    details: { targetAdminId }
  });
  
  revalidatePath('/ops/security');
}

export async function handleManageAdminLock(targetAdminId: string, action: 'LOCK' | 'UNLOCK', reason?: string) {
  const admin = await checkPermission();
  await manageAdminLock(targetAdminId, action, reason);
  
  await logAdminAction({
    adminId: admin.id,
    actor: admin.email || 'unknown',
    action: `ADMIN_${action}`,
    resourceType: 'user',
    resourceId: targetAdminId,
    details: { reason }
  });
  
  revalidatePath('/ops/security');
}

export async function handleForcePasswordReset(targetAdminId: string, action: 'FORCE' | 'CLEAR') {
  const admin = await checkPermission();
  await managePasswordReset(targetAdminId, action);
  
  await logAdminAction({
    adminId: admin.id,
    actor: admin.email || 'unknown',
    action: `FORCE_PASSWORD_RESET_${action}`,
    resourceType: 'user',
    resourceId: targetAdminId
  });
  
  revalidatePath('/ops/security');
}

export async function handleResolveAlert(alertId: string) {
  const admin = await checkPermission();
  const supabase = await createAdminClient();
  
  await supabase.from('portfolio_security_alerts').update({
    is_resolved: true,
    resolved_at: new Date().toISOString(),
    resolved_by: admin.id
  }).eq('id', alertId);
  
  await logAdminAction({
    adminId: admin.id,
    actor: admin.email || 'unknown',
    action: 'ALERT_RESOLVE',
    resourceType: 'alert',
    resourceId: alertId
  });
  
  revalidatePath('/ops/security');
}
