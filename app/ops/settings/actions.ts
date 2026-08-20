'use server';

import { createClient } from '@/utils/supabase/server';
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function saveSettingsAction(updates: any[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }

  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() || headersList.get('x-real-ip') || 'unknown';
  const adminEmail = user.email || 'unknown';

  // Perform updates
  for (const update of updates) {
    const { error } = await supabase.from('portfolio_settings').upsert(update, { onConflict: 'key' });
    if (error) throw new Error(error.message);
  }

  // Log action
  try {
    await supabase.from('portfolio_audit_logs').insert({
      actor: adminEmail,
      action: 'UPDATE_SETTINGS',
      resource_type: 'settings',
      details: { updates },
      ip_address: ip
    });
  } catch (e) {
    console.error('Audit log failed', e);
  }

  revalidatePath('/ops/settings');
  return { success: true };
}
