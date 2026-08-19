import { createClient } from '@/utils/supabase/server';
import SystemClient from './SystemClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
import pkg from '../../../package.json';

import os from 'os';

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

  // Telemetry Status
  const { error: telError } = await supabase.from('portfolio_events').select('id').limit(1);
  const telemetryStatus = telError ? 'Degraded' : 'Healthy';

  // API Status
  const apiStatus = 'Healthy'; 

  // Next and React version from package.json
  const nextVersion = (pkg.dependencies as Record<string, string>)?.next || 'Unknown';
  const reactVersion = (pkg.dependencies as Record<string, string>)?.react || 'Unknown';
  
  // Real OS Stats
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const memoryUsage = ((totalMem - freeMem) / totalMem) * 100;
  
  // Load average on Windows is mostly 0, but we'll use it
  const cpus = os.cpus();
  let cpuUsage = 0;
  if (cpus && cpus.length > 0) {
     const load = os.loadavg()[0]; // 1 minute load average
     cpuUsage = Math.min((load / cpus.length) * 100, 100);
  }

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
      initialMemoryUsage={memoryUsage}
      initialCpuUsage={cpuUsage}
    />
  );
}
