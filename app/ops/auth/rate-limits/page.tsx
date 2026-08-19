import { createClient } from '@/utils/supabase/server';
import RateLimitsClient from './RateLimitsClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function RateLimitsPage() {
  const supabase = await createClient();

  const { data: limits } = await supabase
    .from('portfolio_rate_limits')
    .select('*')
    .order('attempts', { ascending: false });

  return <RateLimitsClient initialLimits={limits || []} />;
}
