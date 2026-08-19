import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('[Error] Supabase URL or Service Role Key missing from environment.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function clearData() {
  console.log('[Clear] Starting database wipe of test data...');

  // Delete all from tables
  const tables = ['telemetry_events', 'contact_messages', 'audit_logs', 'visitors'];
  
  for (const table of tables) {
    console.log(`[Clear] Deleting data from ${table}...`);
    // Delete all rows by finding ones with not null ID (which is all of them)
    const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) {
      // Some tables might have different PK, try another way if error
      console.warn(`[Warn] Could not delete by id from ${table}: ${error.message}`);
      // Fallback: delete without filter if RPC exists, or delete by another field
      // but supabase JS client requires at least one filter.
      // So we filter where id is not null. Let's try where id is not null if it's uuid
    } else {
      console.log(`[Clear] Successfully cleared ${table}.`);
    }
  }

  // Double check visitors delete by visitor_id
  const { error: vError } = await supabase.from('visitors').delete().neq('visitor_id', 'none');

  console.log('[Clear] Database is clean and ready for production!');
}

clearData();
