import { createClient } from '@/utils/supabase/server';
import LoginsClient from './LoginsClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function LoginsPage() {
  const supabase = await createClient();

  const { data: logins } = await supabase
    .from('portfolio_admin_logins')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);

  return <LoginsClient initialLogins={logins || []} />;
}
