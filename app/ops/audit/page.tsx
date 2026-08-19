import { createAdminClient } from '@/utils/supabase/server';
import AuditClient from './AuditClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function OpsAudit() {
  const supabase = await createAdminClient();

  const { data: adminLogs } = await supabase
    .from('portfolio_audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500);

  const { data: portfolioLogs } = await supabase
    .from('portfolio_events')
    .select('id, created_at, event_type, event_name, visitor_id, session_id, metadata, event_data')
    .order('created_at', { ascending: false })
    .limit(500);

  return (
    <AuditClient initialAdminLogs={adminLogs || []} initialPortfolioLogs={portfolioLogs || []} />
  );
}
