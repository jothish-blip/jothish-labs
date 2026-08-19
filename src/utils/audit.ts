import { createClient } from './supabase/server';
import { headers } from 'next/headers';

type AuditLogParams = {
  action: string;
  entity: string;
  entity_id?: string;
  original_value?: unknown;
  new_value?: unknown;
  details?: string;
};

export async function logAdminAction(params: AuditLogParams) {
  try {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) return;

    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || headersList.get('x-real-ip') || 'Unknown';

    await supabase.from('portfolio_admin_logs').insert({
      admin_id: authData.user.id,
      admin_email: authData.user.email,
      action: params.action,
      entity: params.entity,
      entity_id: params.entity_id,
      original_value: params.original_value,
      new_value: params.new_value,
      details: params.details,
      ip_address: ip
    });
  } catch (error) {
    console.error('Failed to log admin action:', error);
  }
}
