import { createClient } from '@/utils/supabase/server';
import SessionsClient from './SessionsClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SessionsPage() {
  const supabase = await createClient();

  const { data: sessions } = await supabase
    .from('portfolio_admin_sessions')
    .select('*')
    .eq('is_revoked', false)
    .gt('expires_at', new Date().toISOString())
    .order('last_activity_at', { ascending: false });

  return <SessionsClient initialSessions={sessions || []} />;
}
