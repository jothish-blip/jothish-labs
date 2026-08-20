const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });
const { v4: uuidv4 } = require('uuid');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function runAdminSimulations() {
  let log = "";
  const writeLog = (msg) => { console.log(msg); log += msg + "\n"; };
  
  // Fake admin ID
  const adminId = "e5b8d2b9-3b6b-4b11-9a7c-f12b6b553e19";
  
  writeLog("\n=== TEST 5: Admin Login ===");
  const sessionToken1 = uuidv4();
  await supabase.from('portfolio_admin_sessions').insert({
    admin_id: adminId,
    session_token: sessionToken1,
    ip_address: "127.0.0.1",
    status: 'ACTIVE',
    expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString()
  });
  
  let { data: adminSess1 } = await supabase.from('portfolio_admin_sessions').select('*').eq('admin_id', adminId).eq('status', 'ACTIVE');
  writeLog(`Active admin sessions after first login: ${adminSess1.length}`);
  
  writeLog("\n=== TEST 6: Second Browser Login ===");
  const sessionToken2 = uuidv4();
  await supabase.from('portfolio_admin_sessions').insert({
    admin_id: adminId,
    session_token: sessionToken2,
    ip_address: "192.168.1.100",
    status: 'ACTIVE',
    expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString()
  });
  let { data: adminSess2 } = await supabase.from('portfolio_admin_sessions').select('*').eq('admin_id', adminId).eq('status', 'ACTIVE');
  writeLog(`Active admin sessions after second login: ${adminSess2.length}`);
  
  writeLog("Simulating heartbeat for Browser 2...");
  const newExpiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();
  await supabase.from('portfolio_admin_sessions').update({ 
    last_activity_at: new Date().toISOString(),
    expires_at: newExpiresAt,
    status: 'ACTIVE'
  }).eq('session_token', sessionToken2).eq('admin_id', adminId);
  
  let { data: sess1Check } = await supabase.from('portfolio_admin_sessions').select('*').eq('session_token', sessionToken1).single();
  let { data: sess2Check } = await supabase.from('portfolio_admin_sessions').select('*').eq('session_token', sessionToken2).single();
  
  writeLog(`Browser 1 expires_at: ${sess1Check.expires_at}`);
  writeLog(`Browser 2 expires_at: ${sess2Check.expires_at}`);
  writeLog(`Are they different? ${sess1Check.expires_at !== sess2Check.expires_at}`);

  writeLog("\n=== TEST 7: Close Browser 1, Wait 30m ===");
  const backdateStr = new Date(Date.now() - 35 * 60000).toISOString();
  await supabase.from('portfolio_admin_sessions').update({ expires_at: backdateStr }).eq('session_token', sessionToken1);
  
  // Sweep
  const now = Date.now();
  await supabase
    .from('portfolio_admin_sessions')
    .update({ status: 'EXPIRED' })
    .in('status', ['ACTIVE', 'IDLE'])
    .lt('expires_at', new Date(now).toISOString());

  let { data: finalSess1 } = await supabase.from('portfolio_admin_sessions').select('*').eq('session_token', sessionToken1).single();
  let { data: finalSess2 } = await supabase.from('portfolio_admin_sessions').select('*').eq('session_token', sessionToken2).single();
  
  writeLog(`Browser 1 Status: ${finalSess1.status}`);
  writeLog(`Browser 2 Status: ${finalSess2.status}`);

  fs.appendFileSync('test_results.txt', log);
}
runAdminSimulations();
