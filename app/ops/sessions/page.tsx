import { createClient } from '@/utils/supabase/server';
import SessionsClient from './SessionsClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function OpsSessions() {
  const supabase = await createClient();
  
  const { data: sessions } = await supabase
    .from('portfolio_sessions')
    .select('*, portfolio_visitors(visitor_name, public_ip, browser, browser_version, os, city, country)')
    .order('created_at', { ascending: false })
    .limit(100);

  return (
    <SessionsClient initialSessions={sessions || []} />
  );
}
