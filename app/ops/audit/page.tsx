import { createClient } from '@/utils/supabase/server';
import AuditClient from './AuditClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function OpsAudit() {
  const supabase = await createClient();

  const { data: logs, error } = await supabase
    .from('portfolio_audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500); // Larger limit for full audit log view

  return (
    <AuditClient initialLogs={logs || []} />
  );
}
