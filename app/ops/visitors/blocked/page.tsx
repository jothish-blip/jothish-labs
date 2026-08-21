import { createClient } from '@/utils/supabase/server';
import BlockedClient from './BlockedClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function OpsBlockedVisitors() {
  const supabase = await createClient();
  
  const { data: blocked } = await supabase
    .from('portfolio_blocked_visitors')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <BlockedClient initialBlocked={blocked || []} />
  );
}
