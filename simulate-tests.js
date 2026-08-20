const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });
const { v4: uuidv4 } = require('uuid');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function runSimulations() {
  const visitorId = uuidv4();
  const sessionId = uuidv4();
  let log = "";
  
  const writeLog = (msg) => { console.log(msg); log += msg + "\n"; };
  
  writeLog("=== TEST 1: Open Website ===");
  writeLog(`Visitor ID: ${visitorId}`);
  writeLog(`Session ID: ${sessionId}`);
  
  await fetch('http://localhost:3000/api/telemetry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': `pf_vid=${visitorId}; pf_sid=${sessionId}` },
    body: JSON.stringify({ type: 'page_view', path: '/' })
  });
  
  let { data: sessions1 } = await supabase.from('portfolio_sessions').select('*').eq('visitor_id', visitorId);
  writeLog(`DB Sessions for visitor after Test 1: ${sessions1.length}`);
  writeLog(`Status: ${sessions1[0]?.status}`);

  writeLog("\n=== TEST 2: Navigate 20 Pages ===");
  for(let i=0; i<20; i++) {
    await fetch('http://localhost:3000/api/telemetry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': `pf_vid=${visitorId}; pf_sid=${sessionId}` },
      body: JSON.stringify({ type: 'page_view', path: `/page-${i}` })
    });
  }
  let { data: sessions2 } = await supabase.from('portfolio_sessions').select('*').eq('visitor_id', visitorId);
  writeLog(`DB Sessions for visitor after Test 2: ${sessions2.length}`);
  writeLog(`Page View Count: ${sessions2[0]?.page_view_count}`);

  writeLog("\n=== TEST 3: Refresh Browser ===");
  await fetch('http://localhost:3000/api/telemetry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': `pf_vid=${visitorId}; pf_sid=${sessionId}` },
    body: JSON.stringify({ type: 'page_view', path: `/page-19` })
  });
  let { data: sessions3 } = await supabase.from('portfolio_sessions').select('*').eq('visitor_id', visitorId);
  writeLog(`DB Sessions for visitor after Test 3: ${sessions3.length}`);

  writeLog("\n=== TEST 4: Close browser, Wait 70s (Simulated) ===");
  // Simulate 70s wait by backdating the session
  const backdateStr = new Date(Date.now() - 71000).toISOString();
  await supabase.from('portfolio_sessions').update({ last_ping_at: backdateStr }).eq('session_id', sessionId);
  
  // Trigger a sweep via findActiveVisitorSession
  await fetch('http://localhost:3000/api/telemetry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': `pf_vid=some-other-visitor; pf_sid=some-other-session` },
    body: JSON.stringify({ type: 'page_view', path: `/` })
  });
  
  let { data: sessions4 } = await supabase.from('portfolio_sessions').select('*').eq('visitor_id', visitorId);
  writeLog(`Status of Test 4 Session: ${sessions4[0]?.status}`);
  
  fs.writeFileSync('test_results.txt', log);
}
runSimulations();
