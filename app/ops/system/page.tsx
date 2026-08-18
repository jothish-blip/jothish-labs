import { createClient } from '@/utils/supabase/server';
import SystemClient from './SystemClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
import pkg from '../../../package.json';

export default async function OpsSystem() {
  const supabase = await createClient();
  
  // Measure Database Latency & Status
  // eslint-disable-next-line react-hooks/purity
  const dbStart = Date.now();
  const { error: dbError } = await supabase.from('portfolio_settings').select('key').limit(1);
  // eslint-disable-next-line react-hooks/purity
  const dbEnd = Date.now();
  const dbLatency = dbEnd - dbStart;
  const dbStatus = dbError ? 'Degraded' : 'Healthy';

  // Measure Auth Status
  const { error: authError } = await supabase.auth.getSession();
  const authStatus = authError ? 'Degraded' : 'Healthy';

  // Measure Storage Status
  const { error: storageError } = await supabase.storage.listBuckets();
  const storageStatus = storageError ? 'Degraded' : 'Healthy';

  // Telemetry Status (Can we query portfolio_events?)
  const { error: telError } = await supabase.from('portfolio_events').select('id').limit(1);
  const telemetryStatus = telError ? 'Degraded' : 'Healthy';

  // API Status (Assuming Edge function is running if this page renders)
  const apiStatus = 'Healthy'; 

  // Next and React version from package.json dependencies
  const nextVersion = (pkg.dependencies as Record<string, string>)?.next || 'Unknown';
  const reactVersion = (pkg.dependencies as Record<string, string>)?.react || 'Unknown';
  
  return (
    <SystemClient 
      dbStatus={dbStatus}
      dbLatency={dbLatency}
      apiStatus={apiStatus}
      authStatus={authStatus}
      storageStatus={storageStatus}
      telemetryStatus={telemetryStatus}
      nodeEnv={process.env.NODE_ENV || 'development'}
      nextVersion={nextVersion}
      reactVersion={reactVersion}
    />
  );
}
