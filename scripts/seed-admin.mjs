import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  console.error('[Error] .env.local not found');
  process.exit(1);
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('[Error] Supabase URL or Service Role Key missing from environment.');
  process.exit(1);
}

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('[Error] ADMIN_EMAIL or ADMIN_PASSWORD missing from environment.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function provisionAdmin() {
  console.log(`[Seed] Provisioning admin account for: ${ADMIN_EMAIL}`);
  
  // Try to find if user already exists
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    console.error('[Error] Failed to list users:', listError.message);
    process.exit(1);
  }

  const existingUser = users.find(u => u.email === ADMIN_EMAIL);

  if (existingUser) {
    console.log('[Seed] Admin user exists, updating password...');
    const { error: updateError } = await supabase.auth.admin.updateUserById(existingUser.id, {
      password: ADMIN_PASSWORD,
      email_confirm: true
    });
    
    if (updateError) {
      console.error('[Error] Failed to update password:', updateError.message);
      process.exit(1);
    }
    console.log('[Seed] Password updated successfully.');
  } else {
    console.log('[Seed] Admin user does not exist, creating...');
    const { error: createError } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: { role: 'admin' }
    });
    
    if (createError) {
      console.error('[Error] Failed to create admin user:', createError.message);
      process.exit(1);
    }
    console.log('[Seed] Admin user created successfully.');
  }

  console.log('[Success] Administrator provisioning complete.');
}

provisionAdmin();
