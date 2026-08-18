import { createClient } from '@/utils/supabase/server';
import VisitorsClient from './VisitorsClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function OpsVisitors() {
  const supabase = await createClient();
  
  const { data: visitors } = await supabase
    .from('portfolio_visitors')
    .select('*')
    .order('last_visit', { ascending: false })
    .limit(50);

  const { data: sessions } = await supabase
    .from('portfolio_sessions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  return (
    <VisitorsClient 
      visitors={visitors || []} 
      recentSessions={sessions || []}
    />
  );
}
