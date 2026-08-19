import { createClient } from '@/utils/supabase/server';
import NotificationsHistoryClient from './NotificationsHistoryClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function NotificationsPage() {
  const supabase = await createClient();

  const { data: notifications } = await supabase
    .from('portfolio_notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  return <NotificationsHistoryClient initialNotifications={notifications || []} />;
}
